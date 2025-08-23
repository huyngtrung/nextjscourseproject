'use server';

import { createCourse, updateCourse, deleteCourse } from '@/features/courses/actions/courses';
import { courseSchema } from '@/features/courses/schemas/courses';
import z from 'zod';

type CourseInput = z.infer<typeof courseSchema>;

export async function createCourseAction(data: CourseInput) {
    const course = await createCourse(data);
    return { success: true, course: JSON.parse(JSON.stringify(course)) };
}

export async function updateCourseAction(id: string, data: CourseInput) {
    const updated = await updateCourse(id, data);
    return { success: true, course: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteCourseAction(id: string) {
    await deleteCourse(id);
    return { success: true };
}
