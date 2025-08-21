import { db } from '@/drizzle/db';
import { UserLessonCompleteTable } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { revalidateUserLessonCompleteCache } from './cache/userLessonComplete';

export async function updateLessonCompleteStatus({
    lessonId,
    userId,
    complete,
}: {
    lessonId: string;
    userId: string;
    complete: boolean;
}) {
    let completion: { lessonId: string; userId: string } | undefined;
    if (complete) {
        await db
            .insert(UserLessonCompleteTable)
            .values({ lessonId, userId })
            .onDuplicateKeyUpdate({ set: {} });

        const [c] = await db
            .select()
            .from(UserLessonCompleteTable)
            .where(
                and(
                    eq(UserLessonCompleteTable.lessonId, lessonId),
                    eq(UserLessonCompleteTable.userId, userId),
                ),
            );

        completion = c;
    } else {
        const [c] = await db
            .select()
            .from(UserLessonCompleteTable)
            .where(
                and(
                    eq(UserLessonCompleteTable.lessonId, lessonId),
                    eq(UserLessonCompleteTable.userId, userId),
                ),
            );

        if (c) {
            await db
                .delete(UserLessonCompleteTable)
                .where(
                    and(
                        eq(UserLessonCompleteTable.lessonId, lessonId),
                        eq(UserLessonCompleteTable.userId, userId),
                    ),
                );
            completion = c;
        }
    }

    if (completion == null) return;

    revalidateUserLessonCompleteCache({ lessonId: completion.lessonId, userId: completion.userId });

    return completion;
}
