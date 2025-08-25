'use server';

import { createCourse, updateCourse, deleteCourse } from '@/features/courses/actions/courses';
import { courseSchema } from '@/features/courses/schemas/courses';
import z from 'zod';

type CourseInput = z.infer<typeof courseSchema>;

export async function createCourseAction(data: CourseInput) {
    return await createCourse(data);
}

export async function updateCourseAction(id: string, data: CourseInput) {
    const updated = await updateCourse(id, data);
    return { error: false, message: 'Successfully updated course' };
}

export async function deleteCourseAction(id: string) {
    await deleteCourse(id);
    return { error: false, message: 'Successfully deleted course' };
}
