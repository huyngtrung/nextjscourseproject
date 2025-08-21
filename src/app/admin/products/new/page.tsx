import { PageHeader } from '@/components/PageHeader';
import { db } from '@/drizzle/db';
import { CourseTable } from '@/drizzle/schema';
import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
import { ProductForm } from '@/features/products/components/ProductForm';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';

export default async function NewProductsPage() {
    return (
        <div className="container my-8 px-12">
            <PageHeader
                title="Create Your New Product"
                description="Add a new product to your catalog by filling in the details below."
            ></PageHeader>
            <ProductForm courses={await getCourses()}></ProductForm>
        </div>
    );
}

async function getCourses() {
    'use cache';
    cacheTag(getCourseGlobalTag());
    return db.query.CourseTable.findMany({
        orderBy: asc(CourseTable.name),
        columns: { id: true, name: true },
    });
}
