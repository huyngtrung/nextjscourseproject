import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { canAccessAdminPages } from '@/permissions/general';
import { getCurrentUser } from '@/services/clerk';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import {
    BookUserIcon,
    DribbbleIcon,
    FacebookIcon,
    FileTextIcon,
    GithubIcon,
    HomeIcon,
    HouseIcon,
    LayoutDashboardIcon,
    MailIcon,
    MenuIcon,
    PhoneIcon,
    PhoneIncomingIcon,
    SchoolIcon,
    SendIcon,
    TicketCheckIcon,
    TwitterIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ReactNode, Suspense } from 'react';

export default function ConsumerLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
            <footer>
                <Footer />
            </footer>
        </>
    );
}

function Navbar() {
    return (
        <header className="flex h-12 shadow bg-background z-10 py-8">
            <nav className="flex gap-4 container px-12">
                <Link
                    className="animate-slide-up mr-auto text-lg flex items-center font-semibold text-orange-600 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 "
                    href="/"
                >
                    <SchoolIcon className="mr-2" />
                    D0F DigiCademy
                </Link>
                <Suspense>
                    <SignedIn>
                        {/* Desktop version*/}
                        <div className="hidden md:flex">
                            <AdminLink></AdminLink>
                            <Link
                                className="animate-slide-up hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                                href="/"
                            >
                                Home
                            </Link>
                            <Link
                                className="animate-slide-up hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                                href="/about"
                            >
                                About Us
                            </Link>
                            <Link
                                className="animate-slide-up hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                                href="/contact"
                            >
                                Contact
                            </Link>
                            <Link
                                className="animate-slide-up hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                                href="/courses"
                            >
                                My Courses
                            </Link>
                            <Link
                                className="animate-slide-up hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                                href="/purchases"
                            >
                                Purchase History
                            </Link>
                            <div className="animate-slide-up size-8 self-center">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: { width: '100%', height: '100%' },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        {/* Tablet & Mobile version*/}
                        <div className="flex md:hidden items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <MenuIcon className="cursor-pointer text-accent" />
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle className="text-3xl">Menu</SheetTitle>
                                        <SheetDescription>
                                            Quickly navigate to different sections of the site.
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="grid flex-1 auto-rows-min border-t-2 border-amber-500">
                                        <Button
                                            className="justify-start text-lg text-orange-600 opacity-75 bg-white rounded-none py-8"
                                            asChild
                                        >
                                            <AdminLink></AdminLink>
                                        </Button>
                                        <Button
                                            className="justify-start text-lg text-orange-600 opacity-75 bg-white rounded-none py-8 border-b-2"
                                            asChild
                                        >
                                            <Link href="/">
                                                <HouseIcon /> Home
                                            </Link>
                                        </Button>
                                        <Button
                                            className="justify-start text-lg text-orange-600 opacity-75 bg-white rounded-none py-8 border-b-2"
                                            asChild
                                        >
                                            <Link href="/about">
                                                <FileTextIcon /> About Us
                                            </Link>
                                        </Button>
                                        <Button
                                            className="justify-start text-lg text-orange-600 opacity-75 bg-white rounded-none py-8 border-b-2"
                                            asChild
                                        >
                                            <Link href="/contact">
                                                <PhoneIncomingIcon /> Contact
                                            </Link>
                                        </Button>
                                        <Button
                                            className="justify-start text-lg text-orange-600 opacity-75 bg-white rounded-none py-8 border-b-2"
                                            asChild
                                        >
                                            <Link href="/courses">
                                                <BookUserIcon /> My Courses
                                            </Link>
                                        </Button>
                                        <Button
                                            className="justify-start text-lg text-orange-600 opacity-75 bg-white rounded-none py-8"
                                            asChild
                                        >
                                            <Link href="/purchases">
                                                <TicketCheckIcon /> Purchase History
                                            </Link>
                                        </Button>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button variant="outline">Close</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                            <div className="size-8 self-center">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: {
                                                width: '100%',
                                                height: '100%',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </SignedIn>
                </Suspense>
                <Suspense>
                    <SignedOut>
                        <Button className="self-center" asChild>
                            <SignInButton>Sign In</SignInButton>
                        </Button>
                    </SignedOut>
                </Suspense>
            </nav>
        </header>
    );
}

async function AdminLink() {
    const user = await getCurrentUser({ allData: true });

    if (!canAccessAdminPages(user)) return null;

    return (
        <>
            <Link
                className="hidden md:flex animate-slide-up hover:bg-accent/10 items-center px-2  text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                href="/admin"
            >
                Admin
            </Link>
            <Button
                className="justify-start md:hidden text-lg text-orange-600 opacity-75 bg-white rounded-none py-8 border-b-2"
                asChild
            >
                <Link href="/purchases">
                    <LayoutDashboardIcon /> Admin
                </Link>
            </Button>
        </>
    );
}

function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 text-white pt-20 pb-4 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[120px]">
                <svg
                    className="absolute w-full h-[120px] left-0  scale-y-[-1]"
                    viewBox="0 0 2 1"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <path
                            id="w"
                            d="
                                m0 1v-.5 
                                q.5.5 1 0
                                t1 0 1 0 1 0
                                v.5z"
                        />
                    </defs>
                    <g>
                        <use
                            href="#w"
                            y=".0"
                            fill="#60a5fa"
                            style={{
                                animation: 'moveForever 18s linear infinite',
                            }}
                        />
                        <use
                            href="#w"
                            y=".1"
                            fill="#2563eb"
                            style={{
                                animation: 'moveForever 16s linear infinite',
                                animationDelay: '-1.5s',
                            }}
                        />
                        <use
                            href="#w"
                            y=".2"
                            fill="#1e40af"
                            style={{
                                animation: 'moveForever 10s linear infinite',
                            }}
                        />
                    </g>
                    <style>{`
                        @keyframes moveForever {
                                0% { transform: translate(-2px, 0); }
                                100% { transform: translate(0px, 0); }
                        }
                    `}</style>
                </svg>
            </div>
            <div className="pt-8">
                <Link
                    className="text-3xl flex items-center justify-center font-semibold text-white"
                    href="/"
                >
                    <SchoolIcon className="mr-2" />
                    D0F DigiCademy
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-12 gap-6 mt-4 ">
                    <div>
                        <Button
                            className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                            asChild
                        >
                            <Link
                                className="text-xl flex items-center justify-center font-semibold text-blue-600"
                                href="/"
                            >
                                About Us
                            </Link>
                        </Button>
                        <p className="text-gray-100 max-w-xl mx-auto text-sm">
                            Empowering learners with quality content and modern web solutions —
                            built with passion and precision.
                        </p>
                    </div>

                    <div>
                        <Button
                            className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                            asChild
                        >
                            <Link
                                className="text-xl flex items-center justify-center font-semibold text-blue-600"
                                href="/"
                            >
                                Keep Connected
                            </Link>
                        </Button>
                        <div className="flex justify-center gap-4">
                            {[
                                FacebookIcon,
                                MailIcon,
                                GithubIcon,
                                SendIcon,
                                TwitterIcon,
                                DribbbleIcon,
                            ].map((Icon, idx) => (
                                <Button
                                    key={idx}
                                    className="w-10 h-10 flex items-center justify-center bg-white shadow-lg rounded-full hover:scale-105 hover:bg-gray-300 transition cursor-pointer "
                                    asChild
                                >
                                    <Link className="text-blue-600" href="/">
                                        <Icon className="w-4 h-4 text-blue-600" />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Button
                            className="bg-white text-blue-600 px-6 py-6 mb-4 rounded-full font-semibold shadow-md hover:bg-gray-300 transition cursor-pointer"
                            asChild
                        >
                            <Link
                                className="text-xl flex items-center justify-center font-semibold text-blue-600"
                                href="/"
                            >
                                Contact Us
                            </Link>
                        </Button>
                        <div className="flex gap-4 mb-2">
                            <HomeIcon />
                            <span>Ha Noi, xxxx, xxxx</span>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <PhoneIcon />
                            <span>123456789</span>
                        </div>
                        <div className="flex gap-4">
                            <MailIcon />
                            <span>huynguyen2004119007@gmail.com</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-200 mt-10">© 2025 All Rights Reserved</p>
            </div>
        </footer>
    );
}
