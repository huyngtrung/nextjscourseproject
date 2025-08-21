import { db } from '@/drizzle/db';
import { ProductTable, UserTable } from '@/drizzle/schema';
import { addUserCourseAccess } from '@/features/courses/db/userCourseAcccess';
import { insertPurchase } from '@/features/purchases/db/purchases';
import { verifyVNPayReturn } from '@/services/vnPay/actions/vnPay';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const verify = verifyVNPayReturn(query);

    let redirectUrl: string;

    if ((await verify).isSuccess) {
        try {
            const orderInfo = JSON.parse(query.vnp_OrderInfo as string);
            const { productId, userId, discountApplied = 0 } = orderInfo;

            const product = await getProduct(productId);
            if (!product) throw new Error('Product not found');

            const rate = await getUsdToVndRate();
            const expectedAmount = Math.round(
                product.priceInDollars * rate * (1 - discountApplied),
            );

            const paidAmount = Number(query.vnp_Amount) / 100;

            if (paidAmount !== expectedAmount) {
                throw new Error(
                    `Invalid payment amount. Expected: ${expectedAmount}, got: ${paidAmount}`,
                );
            }

            await processVNPayCheckout({
                productId,
                userId,
                vnpTransactionId: query.vnp_TransactionNo as string,
                vnpTxnRef: query.vnp_TxnRef as string,
                vnpPayDate: query.vnp_PayDate as string,
                amount: paidAmount,
            });

            redirectUrl = `/products/${productId}/purchase/success`;
        } catch (err) {
            console.error('VNPay checkout error:', err);
            redirectUrl = `/products/purchase-failure`;
        }
    } else {
        redirectUrl = `/products/purchase-failure`;
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url));
}

async function processVNPayCheckout({
    productId,
    userId,
    vnpTransactionId,
    vnpTxnRef,
    vnpPayDate,
    amount,
}: {
    productId: string;
    userId: string;
    vnpTransactionId: string;
    vnpTxnRef: string;
    vnpPayDate: string;
    amount: number;
}) {
    const [product, user] = await Promise.all([getProduct(productId), getUser(userId)]);

    if (product == null) throw new Error('Product not found');
    if (user == null) throw new Error('User not found');

    const courseIds = product.courseProducts.map((cp) => cp.courseId);

    await db.transaction(async (trx) => {
        try {
            await addUserCourseAccess({ userId: user.id, courseIds }, trx);
            await insertPurchase(
                {
                    stripeSessionId: '',
                    vnpTransactionId,
                    vnpTxnRef,
                    vnpTransactionDate: vnpPayDate,
                    momoTransactionId: null,
                    pricePaidInCents: amount,
                    productDetails: product,
                    userId: user.id,
                    productId,
                    paymentProvider: 'vnpay',
                },
                trx,
            );
        } catch (error) {
            trx.rollback();
            throw error;
        }
    });

    return productId;
}

function getProduct(id: string) {
    return db.query.ProductTable.findFirst({
        columns: {
            id: true,
            priceInDollars: true,
            name: true,
            description: true,
            imageUrl: true,
        },
        where: eq(ProductTable.id, id),
        with: {
            courseProducts: { columns: { courseId: true } },
        },
    });
}

function getUser(id: string) {
    return db.query.UserTable.findFirst({
        columns: { id: true },
        where: eq(UserTable.id, id),
    });
}

async function getUsdToVndRate(): Promise<number> {
    const { data } = await axios.get('https://open.er-api.com/v6/latest/USD');
    return data.rates.VND;
}
