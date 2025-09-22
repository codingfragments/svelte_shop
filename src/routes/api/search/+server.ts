import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queries, type Product, type ProductPicture } from '$lib/db/index.js';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const query = url.searchParams.get('q') || '';
		const category = url.searchParams.get('category');
		const limit = parseInt(url.searchParams.get('limit') || '10');

		if (!query || query.trim().length < 2) {
			return json({
				results: [],
				query,
				total: 0
			});
		}

		const searchQuery = query.toLowerCase().trim();
		
		// Get products to search
		let products: Product[];
		if (category) {
			products = queries.getProductsByCategory.all(category) as Product[];
		} else {
			products = queries.getAllProducts.all() as Product[];
		}

		// Perform search
		const searchResults = products
			.filter(product => {
				const nameMatch = product.name.toLowerCase().includes(searchQuery);
				const descMatch = product.description && product.description.toLowerCase().includes(searchQuery);
				const skuMatch = product.sku && product.sku.toLowerCase().includes(searchQuery);
				const categoryMatch = product.category_name && product.category_name.toLowerCase().includes(searchQuery);
				
				return nameMatch || descMatch || skuMatch || categoryMatch;
			})
			.slice(0, limit)
			.map(product => {
				// Get primary picture for each result
				const primaryPicture = queries.getPrimaryProductPicture.get(product.id) as ProductPicture | undefined;
				return {
					...product,
					primary_picture: primaryPicture
				};
			});

		return json({
			results: searchResults,
			query,
			total: searchResults.length,
			category
		});

	} catch (error) {
		console.error('Search API error:', error);
		return json(
			{ error: 'Search failed' },
			{ status: 500 }
		);
	}
};