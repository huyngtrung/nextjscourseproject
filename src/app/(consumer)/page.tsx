import { HeroSection } from '@/components/HeroSection';
import { PageHeader } from '@/components/PageHeader';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { db } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { ProductCard } from '@/features/products/components/ProductCard';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { getUserCoupon } from '@/lib/userCountryHeader';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

export default async function HomePage() {
    const products = await getPublicProducts();
    const coupon = await getUserCoupon();
    const productsData = products.map((p) => ({
        ...p,
        couponPercent: coupon?.discountPercentage,
    }));

    return (
        <div className="container my-8 px-12">
            <PageHeader
                title="Welcome to Our Store"
                description="Explore a wide range of digital courses, tools, and resources to boost your knowledge."
            />
            <HeroSection />
            <WhyChooseUs />

            <>
                <div className="flex justify-center mb-4 animate-auto-show">
                    <p
                        className="inline-block px-4 py-2 rounded-4xl text-sm font-semibold text-green-700 uppercase tracking-[0.3em] bg-gray-200"
                        style={{ wordSpacing: '0.3em' }}
                    >
                        Explore Courses
                    </p>
                </div>
                <ProductCard products={productsData} />
            </>
        </div>
    );
}

async function getPublicProducts() {
    'use cache';
    cacheTag(getProductGlobalTag());

    return db.query.ProductTable.findMany({
        columns: {
            id: true,
            name: true,
            description: true,
            priceInDollars: true,
            imageUrl: true,
        },
        where: wherePublicProducts,
        orderBy: asc(ProductTable.name),
    });
}
