'use server';

import { createCourse, updateCourse, deleteCourse } from '@/features/courses/actions/courses';

export async function createCourseAction(data: any) {
    return await createCourse(data);
}

export async function updateCourseAction(id: string, data: any) {
    return await updateCourse(id, data);
}

export async function deleteCourseAction(id: string) {
    return await deleteCourse(id);
}
