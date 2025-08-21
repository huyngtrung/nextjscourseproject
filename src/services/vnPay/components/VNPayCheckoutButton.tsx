'use client';

import { useState } from 'react';
import axios from 'axios';
import { createVNPayPaymentUrl } from '../actions/vnPay';
import { v4 as uuidv4 } from 'uuid';

export function VNPayCheckoutButton({
    product,
    user,
}: {
    product: {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        priceInDollars: number;
    };
    user: {
        id: string;
        email: string;
    };
}) {
    const [loading, setLoading] = useState(false);

    async function handleCheckout() {
        setLoading(true);

        try {
            const { data } = await axios.get('/api/vnpay-discount');
            const discount = data.discountPercentage ?? 0;

            const txnRef = `order_${uuidv4()}`;
            const orderInfo = JSON.stringify({
                productId: product.id,
                userId: user.id,
                priceInDollars: product.priceInDollars,
                discountApplied: discount,
            });

            const paymentUrl = await createVNPayPaymentUrl({
                // amount: 0,
                ipAddr: '127.0.0.1',
                txnRef,
                orderInfo,
                orderType: 'Entertainment_Training',
                returnUrl: `${window.location.origin}/api/webhooks/vnpay`,
            });

            window.location.href = paymentUrl;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something wentWrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleCheckout}
        >
            {loading ? 'Processing...' : 'VNpay payment'}
        </button>
    );
}

// 'use client';

// import { useState } from 'react';
// import { createVNPayPaymentUrl } from '../actions/vnPay';

// export function VNPayCheckoutButton({
//     product,
//     user,
// }: {
//     product: {
//         id: string;
//         name: string;
//         description: string;
//         imageUrl: string;
//         priceInDollars: number;
//     };
//     user: {
//         id: string;
//         email: string;
//     };
// }) {
//     const [loading, setLoading] = useState(false);

//     async function handleCheckout() {
//         setLoading(true);

//         const res = await fetch('/api/vnpay-discount');

//         const data = await res.json();
//         const discount = data.discountPercentage ?? 0;

//         const originalAmount = await getConvertedAmount(product.priceInDollars);
//         const finalAmount = Math.round(originalAmount * (1 - discount));

//         const txnRef = `order_${Date.now()}`;
//         const orderInfo = JSON.stringify({
//             productId: product.id,
//             userId: user.id,
//             discountApplied: discount,
//         });

//         const paymentUrl = await createVNPayPaymentUrl({
//             amount: finalAmount,
//             ipAddr: '127.0.0.1',
//             txnRef,
//             orderInfo,
//             orderType: 'Entertainment_Training',
//             returnUrl: `${window.location.origin}/api/webhooks/vnpay`,
//         });

//         window.location.href = paymentUrl;
//     }

//     return (
//         <button
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={handleCheckout}
//         >
//             {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
//         </button>
//     );
// }

// async function getConvertedAmount(productPriceUsd: number): Promise<number> {
//     const res = await fetch('https://open.er-api.com/v6/latest/USD');
//     const data = await res.json();
//     const rate = data.rates.VND;

//     return productPriceUsd * rate;
// }
