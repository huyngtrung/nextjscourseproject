'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    BookOpenCheckIcon,
    CalendarCheck2Icon,
    LayersIcon,
    MessagesSquareIcon,
} from 'lucide-react';
import { animeWhychooseUsSection } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

export function WhyChooseUs() {
    const features = [
        {
            icon: <BookOpenCheckIcon className="w-6 h-6 text-white" />,
            title: 'Progress Tracking and Certifications',
            desc: 'Track your progress and earn certifications upon completing modules and courses.',
            bg: 'bg-gradient-to-b from-orange-400 to-orange-600',
        },
        {
            icon: <CalendarCheck2Icon className="w-6 h-6 text-white" />,
            title: 'Accessibility and Convenience',
            desc: 'Learn anytime, anywhere — education that fits your schedule and lifestyle.',
            bg: 'bg-gradient-to-b from-blue-500 to-blue-700',
        },
        {
            icon: <LayersIcon className="w-6 h-6 text-white" />,
            title: 'Diverse Course Selection',
            desc: 'Choose from a wide variety of subjects tailored to different interests and goals.',
            bg: 'bg-gradient-to-b from-yellow-400 to-yellow-600',
        },
        {
            icon: <MessagesSquareIcon className="w-6 h-6 text-white" />,
            title: 'Interactive Learning Experience',
            desc: 'Engage with quizzes, discussions, and activities to enhance your learning.',
            bg: 'bg-gradient-to-b from-emerald-500 to-emerald-700',
        },
    ];

    useEffect(() => {
        animeWhychooseUsSection();
    }, []);

    return (
        <section id="why-choose-us" className="py-24 bg-white">
            <div className="text-center mb-12 animate-auto-show">
                <p className="inline-block px-4 py-2 rounded-4xl text-sm font-semibold text-green-700 uppercase tracking-[0.3em] bg-gray-200">
                    Why Choose Us
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                    Dive into online courses on diverse subjects
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
                {features.map((item, index) => (
                    <div
                        key={index}
                        className="feature-item flex items-start gap-4 bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        <div className={`p-3 rounded-lg ${item.bg}`}>{item.icon}</div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
