import { mysqlTable, text, int, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { CourseSectionTable } from './courseSection';
import { UserLessonCompleteTable } from './userLessonComplete';

export const lessonStatuses = ['public', 'private', 'preview'] as const;
export type LessonStatus = (typeof lessonStatuses)[number];
export const lessonStatusEnum = mysqlEnum('lesson_status', lessonStatuses);

export const LessonTable = mysqlTable('lessons', {
    id,
    name: text('name').notNull(),
    description: text('description'),
    youtubeVideoId: text('youtube_video_id').notNull(),
    order: int('order').notNull(),
    status: mysqlEnum('status', lessonStatuses).notNull().default('private'),
    sectionId: varchar('section_id', { length: 255 })
        .notNull()
        .references(() => CourseSectionTable.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
});

export const LessonRelationships = relations(LessonTable, ({ one, many }) => ({
    section: one(CourseSectionTable, {
        fields: [LessonTable.sectionId],
        references: [CourseSectionTable.id],
    }),
    userLessonsComplete: many(UserLessonCompleteTable),
}));
