import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queries, type Product, type ProductPicture } from '$lib/db/index.js';

interface ProductWithPictures extends Product {
	pictures: ProductPicture[];
}

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		let product: Product | undefined;

		// Try to get product by ID first, then by slug
		if (/^\d+$/.test(id)) {
			// It's a numeric ID
			product = queries.getProductById.get(parseInt(id)) as Product | undefined;
		} else {
			// It's a slug
			product = queries.getProductBySlug.get(id) as Product | undefined;
		}

		if (!product) {
			return json(
				{ error: 'Product not found' },
				{ status: 404 }
			);
		}

		// Get product pictures
		const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];
		
		const productWithPictures: ProductWithPictures = {
			...product,
			pictures
		};

		// Get related products (same category, excluding current product)
		const relatedProducts = queries.getProductsByCategory
			.all(product.category_slug!)
			.filter((p: Product) => p.id !== product.id)
			.slice(0, 4)
			.map((p: Product) => {
				const relatedPictures = queries.getProductPictures.all(p.id) as ProductPicture[];
				return { ...p, pictures: relatedPictures };
			});

		return json({
			product: productWithPictures,
			related: relatedProducts
		});

	} catch (error) {
		console.error('Product API error:', error);
		return json(
			{ error: 'Failed to fetch product' },
			{ status: 500 }
		);
	}
};