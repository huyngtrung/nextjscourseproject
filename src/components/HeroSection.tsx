'use client';
import { GraduationCapIcon, MoveRightIcon, StarIcon, Undo2Icon, User2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { animateHeroSection } from '@/lib/animations';

export function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        animateHeroSection(sectionRef);
    }, []);

    return (
        <div className="relative" ref={sectionRef}>
            {/* Desktop version*/}
            <div className="hidden lg:block relative">
                <svg width="0" height="0" className="absolute inset-0 z-0">
                    <defs>
                        <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
                            <path
                                d=" 
                            M 0,0.73 
                            A 0.1,0.8 0 0,0 0.03,0.78 
                            L 0.43,0.78 
                            A 0.08,0.5 0 0,1 0.46,0.81 
                            L 0.52,0.98 
                            A 0.08,0.8 0 0,0 0.54,1 
                            L 0.97,1 
                            A 0.08,0.8 0 0,0 1,0.95 
                            L 1,0.05 
                            A 0.08,0.8 0 0,0 0.97,0 
                            L 0.03,0 
                            A 0.08,0.8 0 0,0 0,0.05 
                            L 0.0,0.75 Z"
                            />
                        </clipPath>
                    </defs>
                </svg>

                <div
                    className="hero-bg relative h-[40rem] w-full bg-green-600 overflow-hidden z-9"
                    style={{
                        clipPath: 'url(#hero-clip)',
                        background: 'url(/imgs/home/PullRequestBro.png), #F0811F',
                        backgroundPosition: 'right',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                    }}
                >
                    <div className="max-w-7xl mx-auto px-6 pt-8">
                        <p className="hero-slogan uppercase tracking-wide text-sm font-bold text-lime-200 mb-3">
                            ✨ Enhance Your Career
                        </p>
                        <h1 className="hero-title text-5xl font-bold mb-8 leading-tight">
                            {`Access the world's`} <br />
                            best learning course <br />
                            D0F DigiCademy
                        </h1>
                        <p className="hero-subtitle text-lg text-white/80 max-w-xl">
                            Discover a world of knowledge with our cutting-edge online course app.
                            Empower yourself to succeed in your career, passions, and personal
                            growth journey.
                        </p>
                        <div className="hero-button mt-8 flex gap-4">
                            <Button
                                className=" bg-white text-green-600 px-4 py-2 rounded-md font-semibold cursor-pointer"
                                asChild
                            >
                                <Link href="/courses">
                                    Learning now <MoveRightIcon />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-col gap-4 justify-center absolute bottom-0 left-10 z-20 w-[50%] h-[22%] rounded-tr-full animate-auto-show"
                    style={{ clipPath: 'inset(6px round 0 80px)' }}
                >
                    <div className="flex justify-start items-center ml-2 text-2xl text-muted-foreground gap-2">
                        <User2Icon /> More than
                        <span className="font-semibold color-foter"> 1000+</span> student trusted us
                    </div>
                    <div className="ml-2 flex">
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-800">
                            <div className="flex flex-col items-center gap-2">
                                <StarIcon className="w-8 h-8 text-yellow-500" />
                                <span className="text-base">
                                    Rated <strong>4.8/5</strong>
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <GraduationCapIcon className="w-8 h-8 text-blue-500" />
                                <span className="text-base">
                                    Expert teachers with <strong>3+ years</strong>
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Undo2Icon className="w-8 h-8 text-red-500" />
                                <span className="text-base">
                                    <strong>7-day</strong> refund guarantee
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tablet & Mobile version*/}
            <div className="block lg:hidden">
                <div
                    className="relative h-[30rem] w-full bg-green-600 overflow-hidden z-10"
                    style={{
                        clipPath: 'url(#hero-clip)',
                        background: 'url(/imgs/home/PullRequestBro.png), #F0811F',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                    }}
                >
                    <div className="px-6 py-8 text-accent-foreground">
                        <p className="uppercase tracking-wide text-sm font-bold text-lime-200 mb-3">
                            ✨ Enhance Your Career
                        </p>
                        <h1 className="text-4xl font-bold mb-8 leading-tight text-yellow-800">
                            {`Access the world's`} <br />
                            best learning course <br />
                            D0F DigiCademy
                        </h1>
                        <p className="text-lg text-yellow-700">
                            Discover a world of knowledge with our cutting-edge online course app.
                            Empower yourself to succeed in your career, passions, and personal
                            growth journey.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Button
                                className=" bg-white text-green-600 px-4 py-2 rounded-md font-semibold "
                                asChild
                            >
                                <Link href="/courses">
                                    Learning now <MoveRightIcon />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white text-gray-800">
                    <div className="flex items-start text-2xl mt-8 mb-4 text-muted-foreground text-center">
                        <User2Icon /> More than 1000+ student trusted us
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <StarIcon className="w-8 h-8 text-yellow-500" />
                            <span className="text-base">
                                Rated <strong>4.8/5</strong>
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <GraduationCapIcon className="w-8 h-8 text-blue-500" />
                            <span className="text-base">
                                Expert teachers with <strong>3+ years</strong>
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Undo2Icon className="w-8 h-8 text-red-500" />
                            <span className="text-base">
                                <strong>7-day</strong> refund guarantee
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
