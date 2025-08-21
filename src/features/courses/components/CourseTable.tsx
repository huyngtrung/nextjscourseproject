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
import { formatPlural } from '@/lib/formatters';
import { ArrowDown01Icon, ArrowDown10Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { deleteCourse } from '../actions/courses';
import { EntitySearch } from '@/components/EntitySearch';
import { useEffect, useState } from 'react';

export function CourseTable({
    courses,
}: {
    courses: {
        id: string;
        name: string;
        sectionsCount: number;
        lessonsCount: number;
        studentsCount: number;
    }[];
}) {
    const [searchResults, setSearchResults] = useState<typeof courses>([]);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const sortCourses = (data: typeof courses, direction: 'asc' | 'desc') => {
        return [...data].sort((a, b) =>
            direction === 'asc'
                ? a.studentsCount - b.studentsCount
                : b.studentsCount - a.studentsCount,
        );
    };

    useEffect(() => {
        const sorted = [...courses].sort((a, b) =>
            sortDirection === 'asc'
                ? a.studentsCount - b.studentsCount
                : b.studentsCount - a.studentsCount,
        );
        setSearchResults(sorted);
    }, [courses, sortDirection]);

    const handleSearch = (results: typeof courses) => {
        setSearchResults(sortCourses(results, sortDirection));
    };

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className="space-y-4">
            <EntitySearch
                searchKeys={['name']}
                data={courses}
                placeholder="Search courses..."
                onSearch={handleSearch}
            />

            <Table className="border-[1px] border-gray-300 rounded-md">
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="text-sm font-semibold text-foreground">
                            {formatPlural(courses.length, {
                                singular: 'course',
                                plural: 'courses',
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
                                <span>Students</span>
                            </button>
                        </TableHead>
                        <TableHead className="text-sm font-semibold text-foreground text-right pr-6">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {searchResults.length > 0 ? (
                        searchResults.map((course) => (
                            <TableRow
                                key={course.id}
                                className="hover:bg-muted/80 transition-normal"
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="font-medium text-base text-foreground">
                                            {course.name}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            <span className="mr-1">
                                                {formatPlural(course.sectionsCount, {
                                                    singular: 'section',
                                                    plural: 'sections',
                                                })}
                                            </span>
                                            -
                                            <span className="ml-1">
                                                {formatPlural(course.lessonsCount, {
                                                    singular: 'lesson',
                                                    plural: 'lessons',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-sm text-foreground">
                                    {course.studentsCount}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button asChild>
                                            <Link href={`/admin/courses/${course.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <ActionButton
                                            className="cursor-pointer group"
                                            variant={'destructiveOutline'}
                                            requireAreYouSure
                                            action={deleteCourse.bind(null, course.id)}
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
