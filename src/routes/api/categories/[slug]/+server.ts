import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queries, db, type Category, type Product, type ProductPicture } from '$lib/db/index.js';

interface CategoryWithProducts extends Category {
	product_count: number;
	products: Array<Product & { pictures: ProductPicture[] }>;
}

export const GET: RequestHandler = async ({ params, url }) => {
	try {
		const { slug } = params;
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		// Get category by slug
		const category = queries.getCategoryBySlug.get(slug) as Category | undefined;

		if (!category) {
			return json(
				{ error: 'Category not found' },
				{ status: 404 }
			);
		}

		// Get products for this category
		const allProducts = queries.getProductsByCategory.all(slug) as Product[];
		const totalProducts = allProducts.length;

		// Apply pagination
		const paginatedProducts = allProducts.slice(offset, offset + limit);

		// Get pictures for each product
		const productsWithPictures = paginatedProducts.map(product => {
			const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];
			return { ...product, pictures };
		});

		const categoryWithProducts: CategoryWithProducts = {
			...category,
			product_count: totalProducts,
			products: productsWithPictures
		};

		return json({
			category: categoryWithProducts,
			pagination: {
				total: totalProducts,
				limit,
				offset,
				hasNext: offset + limit < totalProducts,
				hasPrev: offset > 0
			}
		});

	} catch (error) {
		console.error('Category API error:', error);
		return json(
			{ error: 'Failed to fetch category' },
			{ status: 500 }
		);
	}
};