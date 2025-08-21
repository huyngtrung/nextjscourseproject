import { db } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { revalidatePurchaseCache } from './cache';
import { eq } from 'drizzle-orm';

export async function insertPurchase(
    data: typeof PurchaseTable.$inferInsert,
    trx: Omit<typeof db, '$client'> = db,
) {
    const details = data.productDetails;

    await trx
        .insert(PurchaseTable)
        .values({
            ...data,
            productDetails: {
                name: details.name,
                description: details.description,
                imageUrl: details.imageUrl,
            },
        })
        .onDuplicateKeyUpdate({
            set: {
                updatedAt: new Date(),
            },
        });

    const [newPurchase] = await trx.query.PurchaseTable.findMany({
        columns: {
            id: true,
            userId: true,
            productId: true,
            stripeSessionId: true,
            vnpTxnRef: true,
            vnpTransactionId: true,
            vnpTransactionDate: true,
            momoTransactionId: true,
            createdAt: true,
            updatedAt: true,
            productDetails: true,
        },
        where: (fields, { and, eq, or }) =>
            and(
                eq(fields.userId, data.userId),
                eq(fields.productId, data.productId),
                or(
                    eq(fields.stripeSessionId, data.stripeSessionId ?? ''),
                    eq(fields.vnpTxnRef, data.vnpTxnRef ?? ''),
                    eq(fields.momoTransactionId, data.momoTransactionId ?? ''),
                ),
            ),
        orderBy: (fields, { desc }) => [desc(fields.id)],
        limit: 1,
    });

    if (newPurchase != null) revalidatePurchaseCache(newPurchase);

    return newPurchase;
}

export async function updatePurchase(
    id: string,
    data: Partial<typeof PurchaseTable.$inferInsert>,
    trx: Omit<typeof db, '$client'> = db,
) {
    const details = data.productDetails;

    await trx
        .update(PurchaseTable)
        .set({
            ...data,
            productDetails: details
                ? {
                      name: details.name,
                      description: details.description,
                      imageUrl: details.imageUrl,
                  }
                : undefined,
        })
        .where(eq(PurchaseTable.id, id));

    const [updatedPurchase] = await trx
        .select()
        .from(PurchaseTable)
        .where(eq(PurchaseTable.id, id))
        .limit(1);

    if (updatedPurchase == null) throw new Error('Failed to update purchase');

    revalidatePurchaseCache(updatedPurchase);

    return updatedPurchase;
}
