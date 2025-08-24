import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/drizzle/db';
import { CourseSectionTable, CourseTable, LessonTable } from '@/drizzle/schema';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { getCourseIdTag } from '@/features/courses/db/cache/courses';
import { SectionFormDialog } from '@/features/courseSections/components/SectionFormDialog';
import { SortableSectionList } from '@/features/courseSections/components/SortableSectionList';
import { SortableLessonList } from '@/features/lessons/components/SortableLessonList';
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache';
import { LessonFormDialog } from '@/features/lessons/components/LessonFormDialog';
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons';
import { cn } from '@/lib/utils';
import { asc, eq } from 'drizzle-orm';
import { BookIcon, EyeClosedIcon, PaperclipIcon, PlusIcon } from 'lucide-react';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { notFound } from 'next/navigation';
interface PageProps {
    params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
    //     {
    //     params,
    // }: {
    //     // params: Promise<{ courseId: string }>;
    // }
    const { courseId } = await Promise.resolve(params);
    // const { courseId } = await params;
    const course = await getCourse(courseId);

    if (course == null) return notFound();
    return (
        <div className="container my-8 px-12">
            <PageHeader
                title={`Edit course: ${course.name}`}
                description="Update the course information below. All changes will be saved automatically after submission."
            />
            <Tabs defaultValue="lessons">
                <TabsList>
                    <TabsTrigger value="lessons">Lessons</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="lessons" className="flex flex-col gap-2">
                    <Card>
                        <CardHeader className="flex items-center flex-row justify-between">
                            <CardTitle className="flex gap-2">
                                <BookIcon className="h-4 w-4 text-black" />
                                All {course.name} Sections
                            </CardTitle>
                            <SectionFormDialog courseId={course.id}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="cursor-pointer text-base">
                                        <PlusIcon /> New Section
                                    </Button>
                                </DialogTrigger>
                            </SectionFormDialog>
                        </CardHeader>
                        <CardContent>
                            <SortableSectionList
                                courseId={course.id}
                                sections={course.courseSections ?? []}
                            ></SortableSectionList>
                        </CardContent>
                    </Card>
                    <hr className="my-4" />
                    {course.courseSections?.map((section) => (
                        <Card key={section.id} className="border-l-12 border-amber-700">
                            <CardHeader className="flex items-center flex-row justify-between gap-4">
                                <CardTitle
                                    className={cn(
                                        'flex items-center gap-2',
                                        section.status === 'private' && 'text-muted-foreground',
                                    )}
                                >
                                    {section.status === 'private' && <EyeClosedIcon />}
                                    <PaperclipIcon className="h-4 w-4 text-black" />
                                    <span className="text-muted-foreground">All Lessons in: </span>
                                    <span className="italic text-primary">{section.name}</span>
                                </CardTitle>
                                <LessonFormDialog
                                    defaultSectionId={section.id}
                                    sections={course.courseSections ?? []}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="cursor-pointer text-base"
                                        >
                                            <PlusIcon /> New Lesson
                                        </Button>
                                    </DialogTrigger>
                                </LessonFormDialog>
                            </CardHeader>
                            <CardContent>
                                <SortableLessonList
                                    sections={course.courseSections ?? []}
                                    lessons={section.lessons ?? []}
                                ></SortableLessonList>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CourseForm course={course} />
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

async function getCourse(id: string) {
    'use cache';

    cacheTag(getCourseIdTag(id), getCourseSectionCourseTag(id), getLessonCourseTag(id));

    return db.query.CourseTable.findFirst({
        columns: { id: true, name: true, description: true },
        where: eq(CourseTable.id, id),
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                columns: { id: true, status: true, name: true },
                with: {
                    lessons: {
                        orderBy: asc(LessonTable.order),
                        columns: {
                            id: true,
                            status: true,
                            name: true,
                            description: true,
                            youtubeVideoId: true,
                            sectionId: true,
                        },
                    },
                },
            },
        },
    }).then((res) =>
        res
            ? {
                  ...res,
                  courseSections: res.courseSections ?? [],
              }
            : null,
    );
}
