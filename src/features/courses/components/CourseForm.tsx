'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema } from '../schemas/courses';
import z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { RequiredLabelIcon } from '@/components/RequiredLabelIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
// import { createCourse, updateCourse } from '../actions/courses';
import { actionToast } from '@/lib/use-toast';
import { createCourseAction, updateCourseAction } from '@/app/admin/courses/actions';

export function CourseForm({
    course,
}: {
    course?: {
        id: string;
        name: string;
        description: string;
    };
}) {
    const form = useForm<z.infer<typeof courseSchema>>({
        resolver: zodResolver(courseSchema),
        defaultValues: course ?? {
            name: '',
            description: '',
        },
    });

    async function handleOnSubmit(values: z.infer<typeof courseSchema>) {
        const action =
            course == null ? createCourseAction : updateCourseAction.bind(null, course.id);
        const data = await action(values);

        actionToast({ actionData: data });
    }

    const handleOnInvalid = () => {
        actionToast({
            actionData: {
                error: true,
                message: 'Please fill out all required fields.',
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleOnSubmit, handleOnInvalid)}
                className="flex gap-6 flex-col"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabelIcon /> Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    autoFocus
                                    {...field}
                                    className="focus-visible:ring-ring/80 focus-visible:ring-[1px]"
                                ></Input>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <RequiredLabelIcon /> Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="min-h-20 resize-none focus-visible:ring-ring/80 focus-visible:ring-[1px]"
                                    {...field}
                                ></Textarea>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full sm:w-auto self-end">
                    <Button
                        className="w-full sm:w-auto cursor-pointer px-12"
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
}
