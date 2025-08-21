import { PageHeader } from '@/components/PageHeader';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/drizzle/db';
import {
    CourseSectionTable,
    CourseTable,
    LessonTable,
    ProductTable,
    PurchaseTable,
    UserCourseAccessTable,
} from '@/drizzle/schema';
import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
import { getUserCourseAccessGlobalTag } from '@/features/courses/db/cache/userCourseAccess';
import { getCourseSectionGlobalTag } from '@/features/courseSections/db/cache';
import { getLessonGlobalTag } from '@/features/lessons/db/cache/lessons';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { getPurchaseGlobalTag } from '@/features/purchases/db/cache';
import { formatNumber, formatPrice } from '@/lib/formatters';
import { count, countDistinct, isNotNull, sql, sum } from 'drizzle-orm';
import {
    BarChartIcon,
    BookIcon,
    BookOpenIcon,
    CreditCardIcon,
    DollarSignIcon,
    LayoutListIcon,
    PackageIcon,
    ShoppingCartIcon,
    Undo2Icon,
    UsersIcon,
} from 'lucide-react';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { ReactNode } from 'react';

export default async function AdminPage() {
    const {
        totalRefunds,
        netSales,
        refundedPurchases,
        netPurchases,
        averageNetPurchasesPerCustomer,
    } = await getPurchaseDetails();

    const [totalStudents, totalProducts, totalCourses, totalCourseSections, totalLessons] =
        await Promise.all([
            getTotalStudents(),
            getTotalProducts(),
            getTotalCourses(),
            getTotalCourseSections(),
            getTotalLessons(),
        ]);

    const stats: {
        title: string;
        value: ReactNode;
        icon: ReactNode;
    }[] = [
        { title: 'Net Sales', value: formatPrice(netSales), icon: <DollarSignIcon /> },
        { title: 'Refund Sales', value: formatPrice(totalRefunds), icon: <Undo2Icon /> },
        {
            title: 'Un-Refunded Purchases',
            value: formatNumber(netPurchases),
            icon: <ShoppingCartIcon />,
        },
        {
            title: 'Refunded Purchases',
            value: formatNumber(refundedPurchases),
            icon: <CreditCardIcon />,
        },
        {
            title: 'Purchases Per User',
            value: formatNumber(averageNetPurchasesPerCustomer, {
                maximumFractionDigits: 2,
            }),
            icon: <BarChartIcon />,
        },
        { title: 'Students', value: formatNumber(totalStudents), icon: <UsersIcon /> },
        { title: 'Products', value: formatNumber(totalProducts), icon: <PackageIcon /> },
        { title: 'Courses', value: formatNumber(totalCourses), icon: <BookOpenIcon /> },
        {
            title: 'Courses Sections',
            value: formatNumber(totalCourseSections),
            icon: <LayoutListIcon />,
        },
        { title: 'Lessons', value: formatNumber(totalLessons), icon: <BookIcon /> },
    ];
    return (
        <div className="container my-8 px-12">
            <PageHeader
                title="Admin Dashboard"
                description="Overview of purchases, products, courses, and student statistics"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} title={stat.title} icon={stat.icon}>
                        {stat.value}
                    </StatCard>
                ))}
            </div>
        </div>
    );
}

function StatCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
}) {
    return (
        <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition duration-300">
            <CardHeader className="flex flex-col items-center text-center space-y-2">
                <div className="text-muted-foreground">{icon}</div>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="font-bold text-2xl">{children}</CardTitle>
            </CardHeader>
        </Card>
    );
}

async function getPurchaseDetails() {
    'use cache';
    cacheTag(getPurchaseGlobalTag());

    const data = await db
        .select({
            totalSales: sql<number>`COALESCE(${sum(PurchaseTable.pricePaidInCents)}, 0)`.mapWith(
                Number,
            ),
            totalPurchases: count(PurchaseTable.id),
            totalUser: countDistinct(PurchaseTable.userId),
            isRefund: isNotNull(PurchaseTable.refundedAt),
        })
        .from(PurchaseTable)
        .groupBy((table) => table.isRefund);

    const [refundData] = data.filter((row) => row.isRefund);
    const [salesData] = data.filter((row) => !row.isRefund);

    const totalRefunds = (refundData?.totalSales ?? 0) / 100;
    const netSales = (salesData?.totalSales ?? 0) / 100;
    const refundedPurchases = refundData?.totalPurchases ?? 0;
    const netPurchases = salesData?.totalPurchases ?? 0;
    const averageNetPurchasesPerCustomer =
        salesData?.totalUser != null && salesData.totalUser > 0
            ? netPurchases / salesData.totalUser
            : 0;
    return {
        totalRefunds,
        netSales,
        refundedPurchases,
        netPurchases,
        averageNetPurchasesPerCustomer,
    };
}

async function getTotalStudents() {
    'use cache';
    cacheTag(getUserCourseAccessGlobalTag());

    const [data] = await db
        .select({ totalStudents: countDistinct(UserCourseAccessTable.userId) })
        .from(UserCourseAccessTable);

    if (data == null) return 0;

    return data.totalStudents;
}

async function getTotalCourses() {
    'use cache';
    cacheTag(getCourseGlobalTag());

    const [data] = await db.select({ totalCourses: count(CourseTable.id) }).from(CourseTable);

    if (data == null) return 0;

    return data.totalCourses;
}

async function getTotalProducts() {
    'use cache';
    cacheTag(getProductGlobalTag());

    const [data] = await db.select({ totalProducts: count(ProductTable.id) }).from(ProductTable);

    if (data == null) return 0;

    return data.totalProducts;
}

async function getTotalLessons() {
    'use cache';
    cacheTag(getLessonGlobalTag());

    const [data] = await db.select({ totalLessons: count(LessonTable.id) }).from(LessonTable);

    if (data == null) return 0;

    return data.totalLessons;
}

async function getTotalCourseSections() {
    'use cache';
    cacheTag(getCourseSectionGlobalTag());

    const [data] = await db
        .select({ totalCourseSections: count(CourseSectionTable.id) })
        .from(CourseSectionTable);

    if (data == null) return 0;

    return data.totalCourseSections;
}
