'use server';

import { ProductCode, VNPay, ignoreLogger, VnpLocale, ReturnQueryFromVNPay } from 'vnpay';
import { env } from '@/data/env/server';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const vnpay = new VNPay({
    tmnCode: env.VNPAY_TMN_CODE,
    secureSecret: env.VNPAY_SECURE_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    loggerFn: ignoreLogger,
});

export async function createVNPayPaymentUrl({
    // amount,
    ipAddr,
    txnRef,
    orderInfo,
    orderType,
    returnUrl,
    locale = VnpLocale.VN,
    createDate = new Date(),
    expireMinutes = 15,
}: {
    // amount: number;
    ipAddr: string;
    txnRef: string;
    orderInfo: string;
    orderType: string;
    returnUrl: string;
    locale?: VnpLocale;
    createDate?: Date;
    expireMinutes?: number;
}) {
    const vnp_CreateDate = formatDate(createDate);
    const vnp_ExpireDate = formatDate(new Date(createDate.getTime() + expireMinutes * 60 * 1000));
    const orderInfoObj = JSON.parse(orderInfo);

    const price = orderInfoObj.priceInDollars;
    const discount = orderInfoObj.discountApplied;
    const rate = await getUsdToVndRate();
    const finalprice = Math.round(price * rate * discount);

    const paymentUrl = await vnpay.buildPaymentUrl({
        vnp_Amount: finalprice,
        vnp_IpAddr: ipAddr,
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType as ProductCode,
        vnp_ReturnUrl: returnUrl,
        vnp_Locale: locale,
        vnp_CreateDate,
        vnp_ExpireDate,
    });

    return paymentUrl;
}

export async function verifyVNPayReturn(query: Record<string, string | string[]>) {
    return vnpay.verifyReturnUrl(query as unknown as ReturnQueryFromVNPay);
}

export async function refundVNPay({
    txnRef,
    amount,
    transactionType,
    user,
    transactionNo,
    transactionDate,
}: {
    txnRef: string;
    amount: number;
    transactionType: '02' | '03';
    user: string;
    transactionNo: string;
    transactionDate: string | null;
}) {
    try {
        const vnp_RequestId = uuidv4().replace(/-/g, '').slice(0, 32);
        const vnp_Version = '2.1.0';
        const vnp_Command = 'refund';
        const vnp_TmnCode = env.VNPAY_TMN_CODE;
        const vnp_TransactionType = transactionType;
        const vnp_TxnRef = txnRef;
        const vnp_Amount = amount * 100;
        const vnp_OrderInfo = `Refund for order ${txnRef}`;
        const vnp_TransactionNo = transactionNo;
        const vnp_TransactionDate = transactionDate;
        const vnp_CreateDate = formatDate(new Date());
        const vnp_CreateBy = user;
        const vnp_IpAddr = '127.0.0.1';

        const signData = [
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_Amount,
            vnp_TransactionNo,
            vnp_TransactionDate,
            vnp_CreateBy,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
        ].join('|');

        const hmac = crypto.createHmac('sha512', env.VNPAY_SECURE_SECRET);
        const vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        const body = {
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode,
            vnp_TransactionType,
            vnp_TxnRef,
            vnp_Amount,
            vnp_OrderInfo,
            vnp_TransactionNo,
            vnp_TransactionDate,
            vnp_CreateDate,
            vnp_CreateBy,
            vnp_IpAddr,
            vnp_SecureHash,
        };

        const response = await fetch(
            'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            },
        );

        const result = await response.json();

        return result;
    } catch (err) {
        console.error('🔥 VNPay refund error:', err);
        return { error: 'Refund request failed', details: (err as Error).message };
    }
}

function formatDate(date: Date): number {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted =
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds());

    return Number(formatted); // ép thành number
}

async function getUsdToVndRate(): Promise<number> {
    const { data } = await axios.get('https://open.er-api.com/v6/latest/USD');
    return data.rates.VND;
}
