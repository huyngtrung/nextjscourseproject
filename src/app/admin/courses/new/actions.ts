'use server';

import { createCourse, updateCourse, deleteCourse } from '@/features/courses/actions/courses';

export async function createCourseAction(data: any) {
    try {
        const course = await createCourse(data);
        return { success: true, course: JSON.parse(JSON.stringify(course)) };
    } catch (err: any) {
        console.error('Error in createCourseAction:', err);
        return { success: false, error: err.message };
    }
}

export async function updateCourseAction(id: string, data: any) {
    const updated = await updateCourse(id, data);
    return { success: true, course: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteCourseAction(id: string) {
    await deleteCourse(id);
    return { success: true };
}
