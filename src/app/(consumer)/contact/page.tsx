'use client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { HomeIcon, PhoneIcon, MailIcon, CheckCircle2Icon } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import z from 'zod';
import { sendContactForm } from '@/lib/api';
import { actionToast } from '@/lib/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { animateEnvelopeBorder } from '@/lib/animations';

const contactSchema = z.object({
    email: z.string().email(),
    phone: z.string().min(8),
    message: z.string().min(5),
});

export default function ContactPage() {
    const [phoneInputError, setPhoneInputError] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { email: '', phone: '', message: '' },
    });

    useEffect(() => {
        animateEnvelopeBorder();
    }, []);

    async function handleOnSubmit(values: z.infer<typeof contactSchema>) {
        try {
            await sendContactForm(values);
            actionToast({
                actionData: {
                    error: false,
                    message: 'Your message has been sent successfully!',
                },
            });
            form.reset();
            setPhoneInputError(null);
        } catch (error) {
            console.error(error);
            actionToast({
                actionData: {
                    error: true,
                    message: 'Failed to send your message. Please try again later.',
                },
            });
        }
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
        <div className="container my-6 lg:px-12 px-4">
            <PageHeader
                title="Contact Us"
                description="We are always here to listen, answer your questions, and provide timely support to help you make the most of your learning journey."
            />

            <div className="flex gap-12 flex-col lg:flex-row">
                <div
                    className="envelope-border lg:w-1/2 w-full border-[12px] p-4 border-transparent
                    [border-image:repeating-linear-gradient(45deg,#4a90e2_0_15px,white_15px_30px,#4a90e2_30px_45px,white_45px_60px)_12/1]"
                >
                    <div className="flex gap-2 mb-2 text-sm items-center">
                        <HomeIcon className="size-6" />
                        <span>Ha Noi, xxxx, xxxx</span>
                    </div>
                    <div className="flex gap-2 mb-2 text-sm">
                        <PhoneIcon className="size-6" />
                        <span>0353600281</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                        <MailIcon className="size-6" />
                        <span>huynguyen2004119007@gmail.com</span>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleOnSubmit, handleOnInvalid)}
                            className="flex gap-6 flex-col mt-8"
                        >
                            <div className="grid gap-6 grid-cols-1 items-start">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address',
                                        },
                                    }}
                                    render={({ field }) => {
                                        const hasError = !!form.formState.errors.email;
                                        const isValid =
                                            field.value &&
                                            !hasError &&
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    {isValid ? (
                                                        <CheckCircle2Icon className="text-green-500 w-4 h-4" />
                                                    ) : (
                                                        <RequiredLabelIcon />
                                                    )}
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="Enter your email..."
                                                        className={` ${isValid ? 'border-green-500' : ''}`}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => {
                                        const hasError = form.formState.errors.phone;
                                        const isValid =
                                            field.value &&
                                            !hasError &&
                                            !phoneInputError &&
                                            field.value.length >= 8;

                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    {isValid ? (
                                                        <CheckCircle2Icon className="text-green-500 w-4 h-4" />
                                                    ) : (
                                                        <RequiredLabelIcon />
                                                    )}
                                                    Phone
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="string"
                                                        {...field}
                                                        placeholder="Enter your phone..."
                                                        className={` ${isValid ? 'border-green-500' : ''}`}
                                                        onKeyDown={(e) => {
                                                            //number only
                                                            if (
                                                                !/[0-9]/.test(e.key) &&
                                                                e.key !== 'Backspace' &&
                                                                e.key !== 'ArrowLeft' &&
                                                                e.key !== 'ArrowRight' &&
                                                                e.key !== 'Tab'
                                                            ) {
                                                                e.preventDefault();
                                                                setPhoneInputError(
                                                                    'Phone must contain only numbers',
                                                                );
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value);
                                                            if (/^\d*$/.test(value)) {
                                                                setPhoneInputError(null);
                                                            }
                                                        }}
                                                    ></Input>
                                                </FormControl>
                                                <FormMessage>
                                                    {phoneInputError ?? hasError?.message}
                                                </FormMessage>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => {
                                    const hasError = form.formState.errors.message;
                                    const isValid =
                                        field.value && !hasError && field.value.length >= 5;
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                {isValid ? (
                                                    <CheckCircle2Icon className="text-green-500 w-4 h-4" />
                                                ) : (
                                                    <RequiredLabelIcon />
                                                )}
                                                Message
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className={`min-h-20 resize-none  ${isValid ? 'border-green-500' : ''}`}
                                                    {...field}
                                                    placeholder="Enter your message..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="w-full sm:w-auto self-end">
                                <Button
                                    className="w-full sm:w-auto cursor-pointer px-12"
                                    disabled={form.formState.isSubmitting}
                                    type="submit"
                                >
                                    Send
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className="lg:w-1/2 w-full lg:max-h-fit h-100 rounded-lg overflow-hidden shadow-lg border-4 border-amber-100">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.6439090418717!2d105.78291137530151!3d21.046929480606945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abb158a2305d%3A0x5c357d21c785ea3d!2sElectric%20Power%20University!5e0!3m2!1sen!2s!4v1755272097646!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
