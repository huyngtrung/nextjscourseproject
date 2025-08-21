import { Badge } from '@/components/ui/badge';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}

function Navbar() {
    return (
        <header className="flex h-12 shadow bg-background z-10 py-8">
            <nav className="flex gap-4 container px-12">
                <div className="mr-auto flex items-center gap-2">
                    <Link
                        className="mr-auto text-lg flex items-center font-semibold text-orange-600 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                        href="/"
                    >
                        D0F DigiCademy
                    </Link>
                    <Badge asChild className="ml-2">
                        <Link
                            href={'/admin'}
                            className="transition ease-in-out hover:-translate-y-1 hover:scale-105"
                        >
                            Admin
                        </Link>
                    </Badge>
                </div>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                    href="/admin/products"
                >
                    Products
                </Link>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                    href="/admin/courses"
                >
                    Courses
                </Link>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2 text-orange-600 opacity-75 hover:opacity-100 transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                    href="/admin/sales"
                >
                    Sales
                </Link>
                <div className="size-8 self-center">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: { width: '100%', height: '100%' },
                            },
                        }}
                    />
                </div>
            </nav>
        </header>
    );
}
