import { SkeletonArray, SkeletonButton, SkeletonText } from '@/components/Skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';

export function UserPurchaseTable({
    purchases,
}: {
    purchases: {
        id: string;
        pricePaidInCents: number;
        createdAt: Date;
        refundedAt: Date | null;
        paymentProvider: string;
        productDetails: {
            name: string;
            imageUrl: string;
        };
    }[];
}) {
    return (
        <Table className="border-[1px] border-gray-300 rounded-md">
            <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead className="text-sm font-semibold text-foreground">Product</TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-center">
                        Payment Provider
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-center">
                        Amount
                    </TableHead>
                    <TableHead className="text-sm font-semibold text-foreground text-center">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Image
                                    className="object-cover rounded size-12"
                                    src={purchase.productDetails.imageUrl}
                                    alt={purchase.productDetails.name}
                                    width={48}
                                    height={48}
                                />
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">
                                        {purchase.productDetails.name}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {formatDate(purchase.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-foreground">
                            {purchase.paymentProvider}
                        </TableCell>
                        <TableCell className="text-center text-sm text-foreground">
                            {purchase.refundedAt ? (
                                <Badge variant="outline">Refunded</Badge>
                            ) : (
                                formatPrice(purchase.pricePaidInCents / 100)
                            )}
                        </TableCell>
                        <TableCell className="text-center text-sm text-foreground">
                            <Button variant="outline" asChild>
                                <Link href={`/purchases/${purchase.id}`}>Details</Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function UserPurchaseTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <SkeletonArray amount={3}>
                    <TableRow>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-secondary animate-pulse rounded" />
                                <div className="flex flex-col gap-1">
                                    <SkeletonText className="w-36" />
                                    <SkeletonText className="w-3/4" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <SkeletonText className="w-12" />
                        </TableCell>
                        <TableCell>
                            <SkeletonButton />
                        </TableCell>
                    </TableRow>
                </SkeletonArray>
            </TableBody>
        </Table>
    );
}
