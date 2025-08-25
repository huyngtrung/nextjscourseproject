'use server';

import z from 'zod';
import { courseSchema } from '../schemas/courses';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/clerk';
import {
    canCreateCourses,
    canDeleteCourses,
    canUpdateCourses,
} from '../permissions/canCreateCourses';
import { insertCourse, deleteCourse as deleteCourseDB, updateCourseDb } from '../db/courses';

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
    const { success, data } = courseSchema.safeParse(unsafeData);

    if (!success || !canCreateCourses(await getCurrentUser())) {
        return { error: true, message: 'Error creating course' };
    }

    const course = await insertCourse(data);
    // return { success: true, id: course.id };
    redirect(`/admin/courses/${course.id}/edit`);
}

export async function updateCourse(id: string, unsafeData: z.infer<typeof courseSchema>) {
    const { success, data } = courseSchema.safeParse(unsafeData);

    if (!success || !canUpdateCourses(await getCurrentUser())) {
        return { error: true, message: 'Error updating course' };
    }

    await updateCourseDb(id, data);

    return { error: false, message: 'Successfully updated course' };
}

export async function deleteCourse(id: string) {
    if (!canDeleteCourses(await getCurrentUser())) {
        return { error: true, message: 'Error deleting course' };
    }

    await deleteCourseDB(id);

    return { error: false, message: 'Successfully deleted course' };
}
