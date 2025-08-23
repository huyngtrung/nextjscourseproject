'use server';

import { createCourse, updateCourse, deleteCourse } from '@/features/courses/actions/courses';

export async function createCourseAction(data: any) {
    const course = await createCourse(data);
    return { success: true, course: JSON.parse(JSON.stringify(course)) };
}

export async function updateCourseAction(id: string, data: any) {
    const updated = await updateCourse(id, data);
    return { success: true, course: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteCourseAction(id: string) {
    await deleteCourse(id);
    return { success: true };
}
