// app/api/vnpay-discount/route.ts
import { NextResponse } from 'next/server';
import { getUserVnpayDiscount } from '@/lib/userCountryHeader';

export async function GET() {
    const discount = await getUserVnpayDiscount();
    return NextResponse.json(discount ?? { discountPercentage: 0 });
}
