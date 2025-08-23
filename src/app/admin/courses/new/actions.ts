'use server';

import { createCourse, updateCourse, deleteCourse } from '@/features/courses/actions/courses';

export const createCourseAction = createCourse;
export const updateCourseAction = updateCourse;
export const deleteCourseAction = deleteCourse;
