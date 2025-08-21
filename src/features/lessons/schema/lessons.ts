import { lessonStatuses } from '@/drizzle/schema';
import z from 'zod';

export const lessonSchema = z.object({
    name: z.string().min(1, 'Requỉed'),
    sectionId: z.string().min(1, 'Requỉed'),
    status: z.enum(lessonStatuses),
    youtubeVideoId: z.string().min(1, 'Required'),
    description: z
        .string()
        .transform((v) => (v === '' ? null : v))
        .nullable(),
});
