import { mysqlTable, int, text, varchar, datetime } from 'drizzle-orm/mysql-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { UserTable } from './user';
import { ProductTable } from './product';

export const PurchaseTable = mysqlTable('purchases', {
    id,
    pricePaidInCents: int('price_paid_in_cents').notNull(),
    productDetails: text('product_details')
        .notNull()
        .$type<{ name: string; description: string; imageUrl: string }>(),
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => UserTable.id, { onDelete: 'restrict' }),
    productId: varchar('product_id', { length: 255 })
        .notNull()
        .references(() => ProductTable.id, { onDelete: 'restrict' }),
    stripeSessionId: varchar('stripe_session_id', { length: 255 }).unique(),
    paymentProvider: varchar('payment_provider', { length: 50 }).notNull(),
    vnpTxnRef: varchar('vnp_txn_ref', { length: 255 }),
    vnpTransactionId: varchar('vnp_transaction_id', { length: 255 }).unique(),
    vnpTransactionDate: varchar('vnp_transaction_date', { length: 14 }),
    momoTransactionId: varchar('momo_transaction_id', { length: 255 }).unique(),
    refundedAt: datetime('refunded_at'),
    createdAt,
    updatedAt,
});

// export const PurchaseTable = mysqlTable('purchases', {
//     id,
//     pricePaidInCents: int('price_paid_in_cents').notNull(),
//     productDetails: json('product_details')
//         .notNull()
//         .$type<{ name: string; description: string; imageUrl: string }>(),
//     userId: varchar('user_id', { length: 255 })
//         .notNull()
//         .references(() => UserTable.id, { onDelete: 'restrict' }),
//     productId: varchar('product_id', { length: 255 })
//         .notNull()
//         .references(() => ProductTable.id, { onDelete: 'restrict' }),
//     stripeSessionId: varchar('stripe_session_id', { length: 255 }).notNull().unique(),
//     paymentProvider: varchar('payment_provider', { length: 50 }).notNull(),
//     vnpTransactionId: varchar('vnp_transaction_id', { length: 255 }),
//     momoTransactionId: varchar('momo_transaction_id', { length: 255 }),
//     refundedAt: timestamp('refunded_at', { mode: 'date' }),
//     createdAt,
//     updatedAt,
// });

export const PurchaseRelationships = relations(PurchaseTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [PurchaseTable.userId],
        references: [UserTable.id],
    }),
    product: one(ProductTable, {
        fields: [PurchaseTable.productId],
        references: [ProductTable.id],
    }),
}));

// import { mysqlTable, int, json, varchar, text, timestamp } from 'drizzle-orm/mysql-core';
// import { createdAt, id, updatedAt } from '../schemaHelpers';
// import { relations } from 'drizzle-orm';
// import { UserTable } from './user';
// import { ProductTable } from './product';

// export const PurchaseTable = mysqlTable('purchases', {
//     id,
//     pricePaidInCents: int('price_paid_in_cents').notNull(),
//     productDetails: json('product_details')
//         .notNull()
//         .$type<{ name: string; description: string; imageUrl: string }>(),
//     userId: varchar('user_id', { length: 255 })
//         .notNull()
//         .references(() => UserTable.id, { onDelete: 'restrict' }),
//     productId: varchar('product_id', { length: 255 })
//         .notNull()
//         .references(() => ProductTable.id, { onDelete: 'restrict' }),
//     stripeSessionId: varchar('stripe_session_id', { length: 255 }).notNull().unique(),
//     refundedAt: timestamp('refunded_at', { mode: 'date' }),
//     createdAt,
//     updatedAt,
// });

// export const PurchaseRelationships = relations(PurchaseTable, ({ one }) => ({
//     user: one(UserTable, {
//         fields: [PurchaseTable.userId],
//         references: [UserTable.id],
//     }),
//     product: one(ProductTable, {
//         fields: [PurchaseTable.productId],
//         references: [ProductTable.id],
//     }),
// }));
