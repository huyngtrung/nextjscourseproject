'use server';

import z from 'zod';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/clerk';
import {
    insertProduct,
    updateProduct as updateProductDb,
    deleteProduct as deleteProductDB,
} from '../db/products';
import { canCreateProducts, canDeleteProducts, canUpdateProducts } from '../permissions/products';
import { productSchema } from '../schema/products';

export async function createProduct(unsafeData: z.infer<typeof productSchema>) {
    const { success, data } = productSchema.safeParse(unsafeData);

    if (!success || !canCreateProducts(await getCurrentUser())) {
        return { error: true, message: 'Error creating Product' };
    }

    await insertProduct(data);

    redirect('/admin/products');
}

export async function updateProduct(id: string, unsafeData: z.infer<typeof productSchema>) {
    const { success, data } = productSchema.safeParse(unsafeData);

    if (!success || !canUpdateProducts(await getCurrentUser())) {
        return { error: true, message: 'Error updating product' };
    }

    await updateProductDb(id, data);

    return { error: false, message: 'Successfully updated product' };
}

export async function deleteProduct(id: string) {
    if (!canDeleteProducts(await getCurrentUser())) {
        return { error: true, message: 'Error deleting product' };
    }

    await deleteProductDB(id);

    return { error: false, message: 'Successfully deleted product' };
}
