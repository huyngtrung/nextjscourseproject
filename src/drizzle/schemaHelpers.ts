import { varchar, datetime } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const id = varchar('id', { length: 255 })
    .primaryKey()
    .notNull()
    .default(sql`(UUID())`);

export const createdAt = datetime('created_at', { mode: 'date' })
    .notNull()
    .default(sql`(NOW())`);

export const updatedAt = datetime('updated_at', { mode: 'date' })
    .notNull()
    .default(sql`(NOW())`)
    .$onUpdate(() => new Date());
