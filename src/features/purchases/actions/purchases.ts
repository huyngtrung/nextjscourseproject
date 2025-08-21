'use server';

import { stripeServerClient } from '@/services/stripe/stripeServer';
import { canRefundPurchases } from '../permisssions/purchases';
import { getCurrentUser } from '@/services/clerk';
import { db } from '@/drizzle/db';
import { updatePurchase } from '../db/purchases';
import { revokeUserCourseAccess } from '@/features/courses/db/userCourseAcccess';
import { refundVNPay } from '@/services/vnPay/actions/vnPay';
import { PurchaseTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function refundPurchase(id: string, paymentProvider: string) {
    if (!canRefundPurchases(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error refunding this purchase',
        };
    }

    const data = await db.transaction(async (trx) => {
        try {
            const refundedPurchase = await trx
                .select()
                .from(PurchaseTable)
                .where(eq(PurchaseTable.id, id))
                .limit(1)
                .then((rows) => rows[0]);

            if (!refundedPurchase) {
                throw new Error('Purchase not found');
            }

            //Refund
            if (paymentProvider === 'stripe') {
                if (!refundedPurchase.stripeSessionId) {
                    throw new Error('Stripe session ID not found');
                }

                const session = await stripeServerClient.checkout.sessions.retrieve(
                    refundedPurchase.stripeSessionId,
                );

                if (!session.payment_intent) {
                    throw new Error('Stripe payment intent not found');
                }

                await stripeServerClient.refunds.create({
                    payment_intent:
                        typeof session.payment_intent === 'string'
                            ? session.payment_intent
                            : session.payment_intent.id,
                });
            } else if (paymentProvider === 'vnpay') {
                if (!refundedPurchase.vnpTxnRef || !refundedPurchase.vnpTransactionId) {
                    throw new Error('Missing VNPay transaction info for refund');
                }
                const refundResult = await refundVNPay({
                    txnRef: refundedPurchase.vnpTxnRef,
                    amount: refundedPurchase.pricePaidInCents,
                    transactionType: '02',
                    user: 'admin',
                    transactionNo: refundedPurchase.vnpTransactionId,
                    transactionDate: refundedPurchase.vnpTransactionDate,
                });

                if (refundResult.vnp_ResponseCode !== '00') {
                    throw new Error(`VNPay refund failed: ${refundResult.vnp_Message}`);
                }
            } else if (paymentProvider === 'momo') {
                return;
            } else {
                throw new Error(
                    `Refund not supported for provider ${refundedPurchase.paymentProvider}`,
                );
            }

            await updatePurchase(id, { refundedAt: new Date() }, trx);

            await revokeUserCourseAccess(refundedPurchase, trx);

            return { error: false, message: 'Successfully refunded purchase' };
        } catch (err) {
            trx.rollback();
            return {
                error: true,
                message: 'There was an error refunding this purchase',
                details: (err as Error).message,
            };
        }
    });

    return data ?? { error: false, message: 'Successfully refunded purchase' };
}
