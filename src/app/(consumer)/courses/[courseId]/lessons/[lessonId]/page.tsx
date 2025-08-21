import { ActionButton } from '@/components/ActionButton';
import { SkeletonButton } from '@/components/Skeleton';
import { Button } from '@/components/ui/button';
import { db } from '@/drizzle/db';
import {
    CourseSectionTable,
    LessonStatus,
    LessonTable,
    UserLessonCompleteTable,
} from '@/drizzle/schema';
import { wherePublicCourseSections } from '@/features/courseSections/permissions/sections';
import { updateLessonCompleteStatus } from '@/features/lessons/actions/userLessonComplete';
import { YouTubeVideoPlayer } from '@/features/lessons/components/YouTubeVideoPlayer';
import { getLessonIdTag } from '@/features/lessons/db/cache/lessons';
import { getUserLessonCompleteIdTag } from '@/features/lessons/db/cache/userLessonComplete';
import { canViewLesson, wherePublicLessons } from '@/features/lessons/permissions/lessons';
import { canUpdateUserLessonCompleteStatus } from '@/features/lessons/permissions/userLessonComplete';
import { getCurrentUser } from '@/services/clerk';
import { and, asc, desc, eq, gt, lt } from 'drizzle-orm';
import { CheckSquare2Icon, LockIcon, XSquareIcon } from 'lucide-react';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

export default async function LessonPage({
    params,
}: {
    params: Promise<{ courseId: string; lessonId: string }>;
}) {
    const { courseId, lessonId } = await params;
    const lesson = await getLesson(lessonId);

    if (lesson == null) return notFound();

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <SuspenBoundary lesson={lesson} courseId={courseId} />
        </Suspense>
    );
}

function LoadingSkeleton() {
    return null;
}

async function SuspenBoundary({
    lesson,
    courseId,
}: {
    lesson: {
        id: string;
        name: string;
        youtubeVideoId: string;
        description: string | null;
        status: LessonStatus;
        sectionId: string;
        order: number;
    };
    courseId: string;
}) {
    const { userId, role } = await getCurrentUser();
    const isLessonComplete =
        userId == null ? false : await getIsLesonComplete({ lessonId: lesson.id, userId });
    const canView = await canViewLesson({ role, userId }, lesson);
    const canUpdateCompleteStatus = await canUpdateUserLessonCompleteStatus({ userId }, lesson.id);

    return (
        <div className="my-4 flex flex-col gap-4">
            <div className="aspect-video">
                {canView ? (
                    <YouTubeVideoPlayer
                        videoId={lesson.youtubeVideoId}
                        onFinishedVideo={
                            isLessonComplete && canUpdateCompleteStatus
                                ? updateLessonCompleteStatus.bind(null, lesson.id, true)
                                : undefined
                        }
                    />
                ) : (
                    <div className="flex items-center justify-center bg-primary text-primary-foregroundh h-full w-full">
                        <LockIcon className="size-16" />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-4">
                        <h1 className="text-2xl font-semibold">{lesson.name}</h1>
                        <div className="flex gap-2 justify-end">
                            <Suspense fallback={<SkeletonButton />}>
                                <ToLessonButton
                                    lesson={lesson}
                                    courseId={courseId}
                                    lessonFunc={getPreviousLesson}
                                >
                                    Previous
                                </ToLessonButton>
                            </Suspense>

                            {canUpdateCompleteStatus && (
                                <ActionButton
                                    action={updateLessonCompleteStatus.bind(
                                        null,
                                        lesson.id,
                                        !isLessonComplete,
                                    )}
                                    variant="outline"
                                >
                                    <div className="flex gap-2 items-center">
                                        {isLessonComplete ? (
                                            <>
                                                <CheckSquare2Icon /> Mark Incomplete
                                            </>
                                        ) : (
                                            <>
                                                <XSquareIcon /> Mark Complete
                                            </>
                                        )}
                                    </div>
                                </ActionButton>
                            )}

                            <Suspense fallback={<SkeletonButton />}>
                                <ToLessonButton
                                    lesson={lesson}
                                    courseId={courseId}
                                    lessonFunc={getNextLesson}
                                >
                                    Next
                                </ToLessonButton>
                            </Suspense>
                        </div>
                    </div>
                    {canView ? (
                        lesson.description && <p>{lesson.description}</p>
                    ) : (
                        <p>This lesson is lock. Please purchase the course</p>
                    )}
                </div>
            </div>
        </div>
    );
}

async function ToLessonButton({
    children,
    courseId,
    lesson,
    lessonFunc,
}: {
    children: ReactNode;
    courseId: string;
    lesson: {
        id: string;
        sectionId: string;
        order: number;
    };
    lessonFunc: (lesson: {
        id: string;
        sectionId: string;
        order: number;
    }) => Promise<{ id: string } | undefined>;
}) {
    const toLesson = await lessonFunc(lesson);

    if (toLesson == null) return null;

    return (
        <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}/lessons/${toLesson.id}`}>{children}</Link>
        </Button>
    );
}

async function getPreviousLesson(lesson: { id: string; sectionId: string; order: number }) {
    let previousLesson = await db.query.LessonTable.findFirst({
        where: and(
            lt(LessonTable.order, lesson.order),
            eq(LessonTable.sectionId, lesson.sectionId),
            wherePublicLessons,
        ),
        orderBy: desc(LessonTable.order),
        columns: { id: true },
    });

    if (previousLesson == null) {
        const sectiton = await db.query.CourseSectionTable.findFirst({
            where: eq(CourseSectionTable.id, lesson.sectionId),
            columns: {
                order: true,
                courseId: true,
            },
        });

        if (sectiton == null) return;

        const previousSection = await db.query.CourseSectionTable.findFirst({
            where: and(
                lt(CourseSectionTable.order, sectiton.order),
                eq(CourseSectionTable.courseId, sectiton.courseId),
                wherePublicCourseSections,
            ),
            orderBy: desc(LessonTable.order),
            columns: { id: true },
        });

        if (previousSection == null) return;

        previousLesson = await db.query.LessonTable.findFirst({
            where: and(eq(LessonTable.sectionId, previousSection.id), wherePublicLessons),
            orderBy: desc(LessonTable.order),
            columns: { id: true },
        });
    }

    return previousLesson;
}

async function getNextLesson(lesson: { id: string; sectionId: string; order: number }) {
    let nextLesson = await db.query.LessonTable.findFirst({
        where: and(
            gt(LessonTable.order, lesson.order),
            eq(LessonTable.sectionId, lesson.sectionId),
            wherePublicLessons,
        ),
        orderBy: asc(LessonTable.order),
        columns: { id: true },
    });

    if (nextLesson == null) {
        const sectiton = await db.query.CourseSectionTable.findFirst({
            where: eq(CourseSectionTable.id, lesson.sectionId),
            columns: {
                order: true,
                courseId: true,
            },
        });

        if (sectiton == null) return;

        const nextSection = await db.query.CourseSectionTable.findFirst({
            where: and(
                gt(CourseSectionTable.order, sectiton.order),
                eq(CourseSectionTable.courseId, sectiton.courseId),
                wherePublicCourseSections,
            ),
            orderBy: asc(LessonTable.order),
            columns: { id: true },
        });

        if (nextSection == null) return;

        nextLesson = await db.query.LessonTable.findFirst({
            where: and(eq(LessonTable.sectionId, nextSection.id), wherePublicLessons),
            orderBy: asc(LessonTable.order),
            columns: { id: true },
        });
    }

    return nextLesson;
}

async function getLesson(lessonId: string) {
    'use cache';
    cacheTag(getLessonIdTag(lessonId));

    return db.query.LessonTable.findFirst({
        columns: {
            id: true,
            name: true,
            youtubeVideoId: true,
            description: true,
            status: true,
            sectionId: true,
            order: true,
        },
        where: and(eq(LessonTable.id, lessonId), wherePublicLessons),
    });
}

async function getIsLesonComplete({ userId, lessonId }: { userId: string; lessonId: string }) {
    'use cache';
    cacheTag(getUserLessonCompleteIdTag({ userId, lessonId }));

    const data = await db.query.UserLessonCompleteTable.findFirst({
        where: and(
            eq(UserLessonCompleteTable.userId, userId),
            eq(UserLessonCompleteTable.lessonId, lessonId),
        ),
    });

    return data != null;
}
