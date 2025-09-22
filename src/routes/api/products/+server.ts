import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queries, type Product, type ProductPicture } from '$lib/db/index.js';

interface ProductWithPictures extends Product {
	pictures: ProductPicture[];
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		const searchParams = url.searchParams;
		const category = searchParams.get('category');
		const search = searchParams.get('search');
		const featured = searchParams.get('featured');
		const limit = parseInt(searchParams.get('limit') || '20');
		const offset = parseInt(searchParams.get('offset') || '0');
		const sort = searchParams.get('sort') || 'created_at';
		const order = searchParams.get('order') || 'DESC';

		let products: Product[];

		// Get products based on filters
		if (category) {
			products = queries.getProductsByCategory.all(category) as Product[];
		} else {
			products = queries.getAllProducts.all() as Product[];
		}

		// Apply additional filters
		let filteredProducts = products;

		if (search) {
			const searchLower = search.toLowerCase();
			filteredProducts = products.filter(product =>
				product.name.toLowerCase().includes(searchLower) ||
				(product.description && product.description.toLowerCase().includes(searchLower))
			);
		}

		if (featured === 'true') {
			filteredProducts = filteredProducts.filter(product => product.featured);
		}

		// Sort products
		filteredProducts.sort((a, b) => {
			let aVal: any = a[sort as keyof Product];
			let bVal: any = b[sort as keyof Product];

			if (sort === 'price') {
				aVal = parseFloat(aVal);
				bVal = parseFloat(bVal);
			}

			if (order === 'ASC') {
				return aVal > bVal ? 1 : -1;
			} else {
				return aVal < bVal ? 1 : -1;
			}
		});

		// Apply pagination
		const total = filteredProducts.length;
		const paginatedProducts = filteredProducts.slice(offset, offset + limit);

		// Get pictures for each product
		const productsWithPictures: ProductWithPictures[] = paginatedProducts.map(product => {
			const pictures = queries.getProductPictures.all(product.id) as ProductPicture[];
			return { ...product, pictures };
		});

		return json({
			products: productsWithPictures,
			pagination: {
				total,
				limit,
				offset,
				hasNext: offset + limit < total,
				hasPrev: offset > 0
			},
			filters: {
				category,
				search,
				featured: featured === 'true',
				sort,
				order
			}
		});

	} catch (error) {
		console.error('Products API error:', error);
		return json(
			{ error: 'Failed to fetch products' },
			{ status: 500 }
		);
	}
};