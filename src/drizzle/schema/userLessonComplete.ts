import { mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { UserTable } from './user';
import { LessonTable } from './lesson';

export const UserLessonCompleteTable = mysqlTable(
    'user_lesson_complete',
    {
        userId: varchar('user_id', { length: 255 })
            .notNull()
            .references(() => UserTable.id, { onDelete: 'cascade' }),
        lessonId: varchar('lesson_id', { length: 255 })
            .notNull()
            .references(() => LessonTable.id, { onDelete: 'cascade' }),
        createdAt,
        updatedAt,
    },
    (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const UserLessonCompleteRelationships = relations(UserLessonCompleteTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserLessonCompleteTable.userId],
        references: [UserTable.id],
    }),
    lesson: one(LessonTable, {
        fields: [UserLessonCompleteTable.lessonId],
        references: [LessonTable.id],
    }),
}));
