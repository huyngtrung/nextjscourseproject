import { db } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidateCourseCache } from './cache/courses';

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
    // Insert course
    await db.insert(CourseTable).values(data);

    const inserted = await db
        .select()
        .from(CourseTable)
        .where(eq(CourseTable.name, data.name))
        .orderBy(CourseTable.id)
        .limit(1);

    const newCourse = inserted[0];

    if (newCourse == null) throw new Error('Failed to create course');

    revalidateCourseCache(newCourse.id);

    return newCourse;
}

export async function updateCourseDb(id: string, data: typeof CourseTable.$inferInsert) {
    await db.update(CourseTable).set(data).where(eq(CourseTable.id, id));

    const updatedCourse = await db
        .select()
        .from(CourseTable)
        .where(eq(CourseTable.id, id))
        .then((rows) => rows[0]);

    if (updatedCourse == null) throw new Error('Failed to update course');

    revalidateCourseCache(updatedCourse.id);

    return updatedCourse;
}

export async function deleteCourse(id: string) {
    //Delete course
    const deletedCourse = await db
        .select()
        .from(CourseTable)
        .where(eq(CourseTable.id, id))
        .then((rows) => rows[0]);

    if (deletedCourse == null) throw new Error('Failed to delete course');

    // 2. Xoá course
    await db.delete(CourseTable).where(eq(CourseTable.id, id));

    // 3. Gọi hàm cache cleanup
    revalidateCourseCache(deletedCourse.id);

    return deletedCourse;
}
