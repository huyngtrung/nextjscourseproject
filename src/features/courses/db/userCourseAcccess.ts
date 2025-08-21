import { db } from '@/drizzle/db';
import { ProductTable, PurchaseTable, UserCourseAccessTable } from '@/drizzle/schema';
import { revalidateUserCourseAccessCache } from './cache/userCourseAccess';
import { and, eq, inArray, isNull } from 'drizzle-orm';

export async function addUserCourseAccess(
    {
        userId,
        courseIds,
    }: {
        userId: string;
        courseIds: string[];
    },
    trx: Omit<typeof db, '$client'> = db,
) {
    await trx
        .insert(UserCourseAccessTable)
        .values(courseIds.map((courseId) => ({ userId, courseId })))
        .onDuplicateKeyUpdate({
            set: {
                updatedAt: new Date(),
            },
        });

    const accesses = await trx.query.UserCourseAccessTable.findMany({
        where: (fields, { eq }) => eq(fields.userId, userId),
    });

    accesses.forEach(revalidateUserCourseAccessCache);

    return accesses;
}

export async function revokeUserCourseAccess(
    {
        userId,
        productId,
    }: {
        userId: string;
        productId: string;
    },
    trx: Omit<typeof db, '$client'> = db,
) {
    const validPurchases = await trx.query.PurchaseTable.findMany({
        where: and(eq(PurchaseTable.userId, userId), isNull(PurchaseTable.refundedAt)),
        with: {
            product: {
                with: { courseProducts: { columns: { courseId: true } } },
            },
        },
    });

    const refundPurchase = await trx.query.ProductTable.findFirst({
        where: eq(ProductTable.id, productId),
        with: { courseProducts: { columns: { courseId: true } } },
    });

    if (refundPurchase == null) return;

    const validCourseIds = validPurchases.flatMap((p) =>
        p.product.courseProducts.map((cp) => cp.courseId),
    );

    const removeCourseIds = refundPurchase.courseProducts
        .flatMap((cp) => cp.courseId)
        .filter((courseId) => !validCourseIds.includes(courseId));

    // 1. Truy vấn lấy các bản ghi sắp bị xóa
    const revokedAccesses = await trx
        .select()
        .from(UserCourseAccessTable)
        .where(
            and(
                eq(UserCourseAccessTable.userId, userId),
                inArray(UserCourseAccessTable.courseId, removeCourseIds),
            ),
        );

    // 2. Tiến hành xóa
    await trx
        .delete(UserCourseAccessTable)
        .where(
            and(
                eq(UserCourseAccessTable.userId, userId),
                inArray(UserCourseAccessTable.courseId, removeCourseIds),
            ),
        );

    revokedAccesses.forEach(revalidateUserCourseAccessCache);

    return revokedAccesses;
}
