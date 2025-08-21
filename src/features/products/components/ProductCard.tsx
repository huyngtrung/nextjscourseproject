'use client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { animateCourseCard } from '@/lib/animations';

export function ProductCard({
    products,
}: {
    products: {
        id: string;
        name: string;
        imageUrl: string;
        priceInDollars: number;
        description: string;
        couponPercent?: number;
    }[];
}) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        animateCourseCard(sectionRef);
    }, []);

    return (
        <div
            ref={sectionRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 cards-container font-inter"
        >
            {products.map((product) => (
                <div key={product.id} className="card-fade-seq">
                    <Card className="card overflow-hidden flex flex-col w-full max-w-[500px] mx-auto pt-0 pb-6">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardHeader className="space-y-0">
                            <CardTitle className="text-xl">{product.name}</CardTitle>
                            <CardDescription className="-mb-3">
                                <p className="line-clamp-3">{product.description}</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 items-baseline">
                                {product.priceInDollars && (
                                    <span className="line-through text-xs opacity-50">
                                        {product.priceInDollars}
                                    </span>
                                )}
                                <span>
                                    {formatPrice(
                                        product.priceInDollars * (product.couponPercent ?? 0),
                                        {
                                            showZeroAsNumber: true,
                                        },
                                    )}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <Button
                                className="w-full text-md py-y bg-amber-500 hover:bg-white hover:border-2 hover:text-black"
                                asChild
                            >
                                <Link href={`/products/${product.id}/`}>View Course</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    );
}
// async function Price({ price }: { price: number }) {
//     const coupon = await getUserCoupon();

//     if (price === 0 || coupon == null) {
//         return formatPrice(price);
//     }

//     return (
//         <div className="flex gap-2 items-baseline">
//             <div className="line-through text-xs opacity-50">{formatPrice(price)}</div>
//             <div>{formatPrice(price * (1 - coupon.discountPercentage))}</div>
//         </div>
//     );
// }
