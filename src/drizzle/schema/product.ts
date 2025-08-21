import { relations } from 'drizzle-orm';
import { mysqlTable, text, int, mysqlEnum } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { CourseProductTable } from './courseProduct';

export const productStatuses = ['public', 'private'] as const;
export type ProductStatus = (typeof productStatuses)[number];
export const productStatusEnum = mysqlEnum('product_status', productStatuses);

export const ProductTable = mysqlTable('products', {
    id,
    name: text('name').notNull(),
    description: text('description').notNull(),
    imageUrl: text('image_url').notNull(),
    priceInDollars: int('price_in_dollars').notNull(),
    status: mysqlEnum('status', productStatuses).notNull().default('private'),
    createdAt,
    updatedAt,
});

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
    courseProducts: many(CourseProductTable),
}));
