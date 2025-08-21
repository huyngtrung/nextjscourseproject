'use client';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatPlural, formatPrice } from '@/lib/formatters';
import { ArrowDown01Icon, ArrowDown10Icon, EyeIcon, LockIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { ProductStatus } from '@/drizzle/schema';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { deleteProduct } from '../actions/products';
import { EntitySearch } from '@/components/EntitySearch';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ProductTable({
    products,
}: {
    products: {
        id: string;
        name: string;
        status: ProductStatus;
        priceInDollars: number;
        description: string;
        imageUrl: string;
        coursesCount: number;
        customersCount: number;
    }[];
}) {
    const [searchResults, setSearchResults] = useState<typeof products>([]);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const sortproducts = (data: typeof products, direction: 'asc' | 'desc') => {
        return [...data].sort((a, b) =>
            direction === 'asc'
                ? a.customersCount - b.customersCount
                : b.customersCount - a.customersCount,
        );
    };

    useEffect(() => {
        const sorted = [...products].sort((a, b) =>
            sortDirection === 'asc'
                ? a.customersCount - b.customersCount
                : b.customersCount - a.customersCount,
        );
        setSearchResults(sorted);
    }, [products, sortDirection]);

    const handleSearch = (results: typeof products) => {
        setSearchResults(sortproducts(results, sortDirection));
    };

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className="space-y-4">
            <EntitySearch
                searchKeys={['name']}
                data={products}
                placeholder="Search products..."
                onSearch={handleSearch}
            />
            <Table className="border-[1px] border-gray-300 rounded-md">
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="text-sm font-semibold text-foreground">
                            {formatPlural(products.length, {
                                singular: 'product',
                                plural: 'products',
                            })}
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
                                <span>Customers</span>
                            </button>
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-center">
                            Status
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-right pr-6">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                            <TableRow
                                key={product.id}
                                className="hover:bg-muted/80 transition-normal"
                            >
                                <TableCell>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                className="object-cover rounded size-16"
                                                src={product.imageUrl}
                                                alt={product.name}
                                                width={224}
                                                height={224}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold">{product.name}</div>
                                            <div className="text-muted-foreground">
                                                <span className="mr-1">
                                                    {formatPlural(product.coursesCount, {
                                                        singular: 'product',
                                                        plural: 'products',
                                                    })}
                                                </span>
                                                -
                                                <span className="ml-1">
                                                    {formatPrice(product.priceInDollars)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    {product.customersCount}
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    <Badge
                                        className={cn(
                                            'inline-flex items-center gap-2 p-2 px-4',
                                            product.status === 'public'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-300 text-gray-950',
                                        )}
                                    >
                                        {getStatusIcon(product.status)}
                                        {product.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <ActionButton
                                            className="cursor-pointer group"
                                            variant={'destructiveOutline'}
                                            requireAreYouSure
                                            action={deleteProduct.bind(null, product.id)}
                                        >
                                            <Trash2Icon className="group-hover:text-white" />
                                            <span className="sr-only">Delete</span>
                                        </ActionButton>
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

function getStatusIcon(status: ProductStatus) {
    const Icon = {
        public: EyeIcon,
        private: LockIcon,
    }[status];

    return <Icon className="size-4" />;
}
