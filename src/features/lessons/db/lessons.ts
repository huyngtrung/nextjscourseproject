import { db } from '@/drizzle/db';
import { CourseSectionTable, LessonTable } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidateLessonCache } from './cache/lessons';

export async function getNextCourseLessonOrder(sectionId: string) {
    const lesson = await db.query.LessonTable.findFirst({
        columns: { order: true },
        where: ({ sectionId: sectionIdCol }, { eq }) => eq(sectionIdCol, sectionId),
        orderBy: ({ order }, { desc }) => desc(order),
    });

    return lesson ? lesson.order + 1 : 0;
}

export async function insertLesson(data: typeof LessonTable.$inferInsert) {
    const [newLesson, courseId] = await db.transaction(async (trx) => {
        // Insert lesson
        await trx.insert(LessonTable).values(data);

        // Truy vấn bản ghi vừa thêm (theo sectionId và orderBy id DESC)
        const [newLesson] = await trx
            .select()
            .from(LessonTable)
            .where(eq(LessonTable.sectionId, data.sectionId))
            .orderBy(desc(LessonTable.id))
            .limit(1);

        // Lấy courseId từ CourseSectionTable
        const section = await trx
            .select({ courseId: CourseSectionTable.courseId })
            .from(CourseSectionTable)
            .where(eq(CourseSectionTable.id, data.sectionId))
            .limit(1);

        const courseId = section[0]?.courseId;

        if (!newLesson || !courseId) return trx.rollback();

        return [newLesson, courseId];
    });

    if (newLesson == null) throw new Error('Failed to create lesson');

    revalidateLessonCache({ courseId, id: newLesson.id });

    return newLesson;
}

export async function updateLesson(id: string, data: Partial<typeof LessonTable.$inferInsert>) {
    const [updateLeson, courseId] = await db.transaction(async (trx) => {
        const currentLesson = await trx.query.LessonTable.findFirst({
            where: eq(LessonTable.id, id),
            columns: { sectionId: true },
        });

        if (
            data.sectionId != null &&
            currentLesson?.sectionId !== data.sectionId &&
            data.order == null
        ) {
            data.order = await getNextCourseLessonOrder(data.sectionId);
        }

        await trx.update(LessonTable).set(data).where(eq(LessonTable.id, id));

        const result = await trx.select().from(LessonTable).where(eq(LessonTable.id, id)).limit(1);

        const updatedLesson = result[0];

        if (!updatedLesson) throw new Error('Failed to update lesson');

        const section = await trx.query.CourseSectionTable.findFirst({
            columns: { courseId: true },
            where: eq(CourseSectionTable.id, updatedLesson.sectionId),
        });

        if (section == null) return trx.rollback();

        return [updatedLesson, section.courseId];
    });

    revalidateLessonCache({ courseId, id: updateLeson.id });

    return updateLeson;
}

export async function deleteLesson(id: string) {
    const [deletedLesson, courseId] = await db.transaction(async (trx) => {
        // Truy vấn bản ghi trước khi xóa
        const result = await trx.select().from(LessonTable).where(eq(LessonTable.id, id)).limit(1);

        const deletedLesson = result[0];

        if (!deletedLesson) {
            trx.rollback();
            throw new Error('Failed to delete lesson');
        }

        // Xóa bản ghi
        await trx.delete(LessonTable).where(eq(LessonTable.id, id));

        const section = await trx.query.CourseSectionTable.findFirst({
            columns: { courseId: true },
            where: ({ id }, { eq }) => eq(id, deletedLesson.sectionId),
        });

        if (section == null) return trx.rollback();

        return [deletedLesson, section.courseId];
    });

    revalidateLessonCache({ id: deletedLesson.id, courseId });

    return deletedLesson;
}

export async function updateLessonOrders(lessonIds: string[]) {
    const [lessons, courseId] = await db.transaction(async (trx) => {
        const lessons = await Promise.all(
            lessonIds.map(async (id, index) => {
                await trx.update(LessonTable).set({ order: index }).where(eq(LessonTable.id, id));

                // Truy vấn lại lesson vừa cập nhật
                const result = await trx
                    .select({
                        sectionId: LessonTable.sectionId,
                        id: LessonTable.id,
                    })
                    .from(LessonTable)
                    .where(eq(LessonTable.id, id))
                    .limit(1);

                return result;
            }),
        );

        const sectionId = lessons[0]?.[0]?.sectionId;
        if (sectionId == null) return trx.rollback();

        const section = await trx.query.CourseSectionTable.findFirst({
            columns: { courseId: true },
            where: ({ id }, { eq }) => eq(id, sectionId),
        });

        if (section == null) return trx.rollback();

        return [lessons, section.courseId];
    });

    lessons.flat().forEach(({ id }) => {
        revalidateLessonCache({
            courseId,
            id,
        });
    });
}
