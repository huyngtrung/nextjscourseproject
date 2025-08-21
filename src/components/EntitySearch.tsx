'use client';

import { Input } from '@/components/ui/input';
import { SearchCheckIcon, SearchIcon, SearchXIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

function getNestedValue<T>(obj: T, path: string): unknown {
    return path.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj as unknown);
}

type EntitySearchProps<T> = {
    placeholder?: string;
    searchKeys: string[];
    data: T[];
    onSearch: (results: T[]) => void;
};

export function EntitySearch<T>({
    placeholder = 'Search...',
    searchKeys,
    data,
    onSearch,
}: EntitySearchProps<T>) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasResults, setHasResults] = useState(false);

    const handleChange = (value: string) => {
        const validValue = value.trimStart();
        setQuery(validValue);
        setIsSearching(true);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const lower = query.toLowerCase();

            const filtered = data.filter((item) =>
                searchKeys.some((key) =>
                    String(getNestedValue(item, key) ?? '')
                        .toLowerCase()
                        .includes(lower),
                ),
            );

            onSearch(filtered);
            setHasResults(filtered.length > 0);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, data, onSearch, searchKeys]);

    return (
        <div className="w-full lg:w-1/4 ml-auto">
            <div className="relative flex items-center w-full lg:max-w-md">
                <div className="absolute left-3 ">
                    {isSearching ? (
                        <LoadingSpinner className="w-4 h-4" />
                    ) : query.length > 0 ? (
                        hasResults ? (
                            <SearchCheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                            <SearchXIcon className="w-4 h-4 text-red-500" />
                        )
                    ) : (
                        <SearchIcon className="w-4 h-4 text-gray-900" />
                    )}
                </div>
                <Input
                    className="pl-9 pr-3 w-full focus-visible:ring-ring/80 focus-visible:ring-[1px]"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
        </div>
    );
}
