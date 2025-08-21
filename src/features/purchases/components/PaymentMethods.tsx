'use client';
import { Label } from '@/components/ui/label';
import { StripeCheckoutForm } from '@/services/stripe/components/StripeCheckoutForm';
import { VNPayCheckoutButton } from '@/services/vnPay/components/VNPayCheckoutButton';
import { useState } from 'react';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function PaymentMethods({
    user,
    product,
}: {
    product: {
        description: string;
        id: string;
        imageUrl: string;
        name: string;
        priceInDollars: number;
    };
    user: {
        id: string;
        clerkUserId: string;
        email: string;
        name: string;
        role: 'user' | 'admin';
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    };
}) {
    const [method, setMethod] = useState<'stripe' | 'vnpay' | 'momo'>('stripe');

    return (
        <div className="rounded-xl border p-6 bg-white space-y-6">
            <h2 className="text-lg font-semibold">Payment Methods</h2>
            <p className="text-sm text-muted-foreground">
                All card information is encrypted and secured.
            </p>

            <RadioGroup
                value={method}
                onValueChange={(val) => setMethod(val as 'stripe' | 'vnpay' | 'momo')}
                className="space-y-3"
            >
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="cursor-pointer">
                            Credit/Debit Card (Visa/Master/JCB)
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/paymentLogos/stripeLogo.png"
                            alt="Visa"
                            width={36}
                            height={24}
                        />
                    </div>
                </div>

                {/* VNPay */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="vnpay" id="vnpay" />
                        <Label htmlFor="vnpay" className="cursor-pointer">
                            Pay with QR Code
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/paymentLogos/vnpayLogo.webp"
                            alt="Visa"
                            width={36}
                            height={24}
                        />
                    </div>
                </div>

                {/* MoMo */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="momo" id="momo" />
                        <Label htmlFor="momo" className="cursor-pointer">
                            Pay with E-Wallet (MoMo),
                        </Label>
                    </div>
                    <Image src="/paymentLogos/momoLogo.webp" alt="Visa" width={40} height={40} />
                </div>
            </RadioGroup>

            {/* Render form */}
            <div className="pt-4">
                {method === 'stripe' && <StripeCheckoutForm product={product} user={user} />}
                {method === 'vnpay' && <VNPayCheckoutButton product={product} user={user} />}
                {method === 'momo' && <div>will be updated as soon as possible</div>}
            </div>

            <p className="text-xs text-muted-foreground">
                By clicking &quot;Pay&quot;, you agree to the terms, conditions, and security
                policy. <br />
                <strong>
                    No refund, cancellation, or exchange is available after the transaction is
                    confirmed.
                </strong>
            </p>
        </div>
        // <div className="flex flex-col gap-4">
        //     <div className="flex gap-4">
        //         <button
        //             className={`px-4 py-2 rounded ${method === 'stripe' ? 'bg-primary text-white' : 'bg-muted'}`}
        //             onClick={() => setMethod('stripe')}
        //         >
        //             Stripe
        //         </button>
        //         <button
        //             className={`px-4 py-2 rounded ${method === 'vnpay' ? 'bg-primary text-white' : 'bg-muted'}`}
        //             onClick={() => setMethod('vnpay')}
        //         >
        //             VNPay
        //         </button>
        //         {/* <button
        //             className={`px-4 py-2 rounded ${method === 'momo' ? 'bg-primary text-white' : 'bg-muted'}`}
        //             onClick={() => setMethod('momo')}
        //         >
        //             MoMo
        //         </button> */}
        //     </div>

        //     {method === 'stripe' && <StripeCheckoutForm product={product} user={user} />}
        //     {method === 'vnpay' && <VNPayCheckoutButton product={product} user={user} />}
        //     {/* {method === 'momo' && <StripeCheckoutForm product={product} user={user} />} */}
        // </div>
    );
}
