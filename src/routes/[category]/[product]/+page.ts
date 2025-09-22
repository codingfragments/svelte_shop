import { error } from '@sveltejs/kit';
import { APP_CONFIG } from '$lib/config.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { category, product: productSlug } = params;
	
	// Verify the category exists in our config
	const validCategory = APP_CONFIG.categories.find(cat => cat.slug === category);
	if (!validCategory) {
		throw error(404, 'Category not found');
	}

	try {
		// Fetch product by slug
		const productResponse = await fetch(`/api/products/${productSlug}`);
		
		if (!productResponse.ok) {
			throw error(404, 'Product not found');
		}

		const productData = await productResponse.json();

		// Verify product belongs to the correct category
		if (productData.product.category_slug !== category) {
			throw error(404, 'Product not found in this category');
		}

		return {
			product: productData.product,
			relatedProducts: productData.related || [],
			category: validCategory
		};
	} catch (err) {
		console.error('Failed to load product page:', err);
		throw error(500, 'Failed to load product');
	}
};