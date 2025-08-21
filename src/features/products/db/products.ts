import { db } from '@/drizzle/db';
import { CourseProductTable, ProductTable, PurchaseTable } from '@/drizzle/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';
import { revalidateProductCache } from './cache';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { getPurchaseUserTag } from '@/features/purchases/db/cache';

export async function userOwnsProduct({
    userId,
    productId,
}: {
    userId: string;
    productId: string;
}) {
    'use cache';
    cacheTag(getPurchaseUserTag(userId));

    const existingPurchase = await db.query.PurchaseTable.findFirst({
        where: and(
            eq(PurchaseTable.productId, productId),
            eq(PurchaseTable.userId, userId),
            isNull(PurchaseTable.refundedAt),
        ),
    });

    return existingPurchase != null;
}

export async function insertProduct(
    data: typeof ProductTable.$inferInsert & { courseIds: string[] },
) {
    const newProduct = await db.transaction(async (trx) => {
        await trx.insert(ProductTable).values(data);

        const [newProduct] = await trx
            .select()
            .from(ProductTable)
            .where(eq(ProductTable.name, data.name))
            .orderBy(desc(ProductTable.id))
            .limit(1);

        if (newProduct == null) {
            trx.rollback();
            throw new Error('Failed to create product');
        }

        await trx.insert(CourseProductTable).values(
            data.courseIds.map((courseId) => ({
                productId: newProduct.id,
                courseId,
            })),
        );

        return newProduct;
    });

    revalidateProductCache(newProduct.id);
    return newProduct;
}

export async function updateProduct(
    id: string,
    data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] },
) {
    const updatedProduct = await db.transaction(async (trx) => {
        await trx.update(ProductTable).set(data).where(eq(ProductTable.id, id));

        const [updatedProduct] = await trx
            .select()
            .from(ProductTable)
            .where(eq(ProductTable.id, id))
            .limit(1);

        if (updatedProduct == null || !updatedProduct) {
            trx.rollback();
            throw new Error('Failed to update product');
        }

        await trx
            .delete(CourseProductTable)
            .where(eq(CourseProductTable.productId, updatedProduct.id));

        await trx.insert(CourseProductTable).values(
            data.courseIds.map((courseId) => ({
                productId: updatedProduct.id,
                courseId,
            })),
        );

        return updatedProduct;
    });

    revalidateProductCache(updatedProduct.id);
    return updatedProduct;
}

export async function deleteProduct(id: string) {
    const [deletedProduct] = await db
        .select()
        .from(ProductTable)
        .where(eq(ProductTable.id, id))
        .limit(1);

    if (deletedProduct == null) throw new Error('Failed to delete product');

    await db.delete(ProductTable).where(eq(ProductTable.id, id));

    revalidateProductCache(deletedProduct.id);
    return deletedProduct;
}
