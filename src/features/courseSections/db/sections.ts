import { CourseSectionTable } from '@/drizzle/schema';
import { revalidateCourseSectionCache } from './cache';
import { db } from '@/drizzle/db';
import { eq, desc, inArray } from 'drizzle-orm';

export async function getNextCourseSectionOrder(courseId: string) {
    const section = await db
        .select({ order: CourseSectionTable.order })
        .from(CourseSectionTable)
        .where(eq(CourseSectionTable.courseId, courseId))
        .orderBy(desc(CourseSectionTable.order))
        .limit(1);

    return section[0] ? section[0].order + 1 : 0;
}

export async function insertSection(data: typeof CourseSectionTable.$inferInsert) {
    await db.insert(CourseSectionTable).values(data);

    const [newSection] = await db
        .select()
        .from(CourseSectionTable)
        .where(eq(CourseSectionTable.name, data.name))
        .orderBy(desc(CourseSectionTable.id))
        .limit(1);

    if (!newSection) throw new Error('Failed to create section');

    revalidateCourseSectionCache({
        courseId: newSection.courseId,
        id: newSection.id,
    });

    return newSection;
}

export async function updateSection(
    id: string,
    data: Partial<typeof CourseSectionTable.$inferInsert>,
) {
    await db.update(CourseSectionTable).set(data).where(eq(CourseSectionTable.id, id));

    const [updatedSection] = await db
        .select()
        .from(CourseSectionTable)
        .where(eq(CourseSectionTable.id, id))
        .limit(1);

    if (!updatedSection) throw new Error('Failed to update section');

    revalidateCourseSectionCache({
        courseId: updatedSection.courseId,
        id: updatedSection.id,
    });

    return updatedSection;
}

export async function deleteSection(id: string) {
    const [section] = await db
        .select()
        .from(CourseSectionTable)
        .where(eq(CourseSectionTable.id, id))
        .limit(1);

    if (!section) throw new Error('Section not found for deletion');

    await db.delete(CourseSectionTable).where(eq(CourseSectionTable.id, id));

    revalidateCourseSectionCache({
        courseId: section.courseId,
        id: section.id,
    });

    return section;
}

export async function updateSectionOrders(sectionIds: string[]) {
    // Cập nhật order cho từng section
    await Promise.all(
        sectionIds.map((id, index) =>
            db
                .update(CourseSectionTable)
                .set({ order: index })
                .where(eq(CourseSectionTable.id, id)),
        ),
    );

    // Sau khi cập nhật, truy vấn lại để lấy courseId và id
    const sections = await db
        .select({
            courseId: CourseSectionTable.courseId,
            id: CourseSectionTable.id,
        })
        .from(CourseSectionTable)
        .where(
            // lọc theo danh sách sectionIds vừa cập nhật
            // dùng cú pháp `inArray` của drizzle-orm để tương thích với MySQL
            inArray(CourseSectionTable.id, sectionIds),
        );

    // await new Promise((res) => setTimeout(res, 2000));

    // Gọi lại cache cho từng section
    sections.flat().forEach(({ id, courseId }) => {
        revalidateCourseSectionCache({ courseId, id });
    });
}
