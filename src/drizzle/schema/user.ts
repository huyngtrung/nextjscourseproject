import { mysqlEnum, mysqlTable, text, datetime, varchar } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { UserCourseAccessTable } from './userCourseAccess';

export const userRoles = ['user', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];

export const UserTable = mysqlTable('users', {
    id,
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    role: mysqlEnum('role', userRoles).notNull().default('user'),
    imageUrl: text('image_url'),
    deletedAt: datetime('deleted_at', { mode: 'date' }),
    createdAt,
    updatedAt,
});

export const UserRelationships = relations(UserTable, ({ many }) => ({
    userCourseAccesses: many(UserCourseAccessTable),
}));
