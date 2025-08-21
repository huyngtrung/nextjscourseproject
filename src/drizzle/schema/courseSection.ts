import { mysqlTable, varchar, text, int, mysqlEnum, primaryKey } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { CourseTable } from './course';
import { LessonTable } from './lesson';
import { relations } from 'drizzle-orm';

export const courseSectionStatuses = ['public', 'private'] as const;
export type CourseSectionStatus = (typeof courseSectionStatuses)[number];
export const courseSectionStatusEnum = mysqlEnum('course_section_status', courseSectionStatuses);

export const CourseSectionTable = mysqlTable(
    'course_sections',
    {
        id,
        name: text('name').notNull(),
        status: mysqlEnum('status', courseSectionStatuses).notNull().default('private'),
        order: int('order').notNull(),
        courseId: varchar('course_id', { length: 255 })
            .notNull()
            .references(() => CourseTable.id, { onDelete: 'cascade' }),
        createdAt,
        updatedAt,
    },
    (table) => [primaryKey({ columns: [table.id] })],
);

export const CourseSectionRelationships = relations(CourseSectionTable, ({ one, many }) => ({
    course: one(CourseTable, {
        fields: [CourseSectionTable.courseId],
        references: [CourseTable.id],
    }),
    lessons: many(LessonTable),
}));
