'use client';

import { ActionButton } from '@/components/ActionButton';
import { SkeletonArray, SkeletonButton, SkeletonText } from '@/components/Skeleton';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatPlural, formatPrice, formatPriceVND } from '@/lib/formatters';
import Image from 'next/image';
import { refundPurchase } from '../actions/purchases';
import { EntitySearch } from '@/components/EntitySearch';
import { useEffect, useState } from 'react';
import { ArrowDown01Icon, ArrowDown10Icon } from 'lucide-react';

export function PurchaseTable({
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
        user: {
            name: string;
        };
    }[];
}) {
    const [searchResults, setSearchResults] = useState<typeof purchases>([]);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const sortPurchases = (data: typeof purchases, direction: 'asc' | 'desc') => {
        return [...data].sort((a, b) =>
            direction === 'asc'
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    };

    useEffect(() => {
        const sorted = [...purchases].sort((a, b) =>
            sortDirection === 'asc'
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setSearchResults(sorted);
    }, [purchases, sortDirection]);

    const handleSearch = (results: typeof purchases) => {
        setSearchResults(sortPurchases(results, sortDirection));
    };

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className="space-y-4">
            <EntitySearch
                searchKeys={['user.name']}
                data={purchases}
                placeholder="Search customer name..."
                onSearch={handleSearch}
            />
            <Table className="border-[1px] border-gray-300 rounded-md">
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="text-sm font-semibold text-foreground">
                            {formatPlural(purchases.length, {
                                singular: 'sale',
                                plural: 'sales',
                            })}
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-center">
                            Customer Name
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-center">
                            Payment Provider
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-center">
                            Amount
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-center">
                            <button
                                onClick={toggleSortDirection}
                                className="flex items-center justify-center gap-1 w-full text-foreground cursor-pointer"
                            >
                                {sortDirection === 'asc' ? (
                                    <ArrowDown01Icon className="w-4 h-4" />
                                ) : (
                                    <ArrowDown10Icon className="w-4 h-4" />
                                )}
                                <span>Create At</span>
                            </button>
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-right pr-6">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {searchResults.length > 0 ? (
                        searchResults.map((purchase) => (
                            <TableRow
                                key={purchase.id}
                                className="hover:bg-muted/80 transition-normal"
                            >
                                <TableCell>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Image
                                            className="object-cover rounded size-12"
                                            src={purchase.productDetails.imageUrl}
                                            alt={purchase.productDetails.name}
                                            width={192}
                                            height={192}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold">
                                                {purchase.productDetails.name}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    {purchase.user.name}
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    {purchase.paymentProvider}
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    {purchase.refundedAt ? (
                                        <Badge variant="default">Refunded</Badge>
                                    ) : purchase.paymentProvider === 'stripe' ? (
                                        formatPrice(purchase.pricePaidInCents / 100, {
                                            showZeroAsNumber: true,
                                        })
                                    ) : (
                                        formatPriceVND(purchase.pricePaidInCents, {
                                            showZeroAsNumber: true,
                                        })
                                    )}
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    <div className="text-muted-foreground">
                                        {formatDate(purchase.createdAt)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {purchase.refundedAt == null &&
                                            purchase.pricePaidInCents > 0 && (
                                                <ActionButton
                                                    className="cursor-pointer hover:text-white"
                                                    action={refundPurchase.bind(
                                                        null,
                                                        purchase.id,
                                                        purchase.paymentProvider,
                                                    )}
                                                    variant={'destructiveOutline'}
                                                    requireAreYouSure
                                                >
                                                    Refund
                                                </ActionButton>
                                            )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center py-4 text-muted-foreground"
                            >
                                No results found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
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
