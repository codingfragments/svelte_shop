import { error } from '@sveltejs/kit';
import { APP_CONFIG } from '$lib/config.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, url }) => {
	const { category } = params;
	
	// Verify the category exists in our config
	const validCategory = APP_CONFIG.categories.find(cat => cat.slug === category);
	if (!validCategory) {
		throw error(404, 'Category not found');
	}

	const searchParams = url.searchParams;
	const search = searchParams.get('search') || '';
	const sort = searchParams.get('sort') || 'created_at';
	const order = searchParams.get('order') || 'DESC';
	const page = parseInt(searchParams.get('page') || '1');
	const limit = 12;
	const offset = (page - 1) * limit;

	try {
		const [categoryResponse, categoriesResponse] = await Promise.all([
			fetch(`/api/categories/${category}?limit=${limit}&offset=${offset}`),
			fetch('/api/categories?stats=true')
		]);

		if (!categoryResponse.ok) {
			throw error(404, 'Category not found');
		}

		const categoryData = await categoryResponse.json();
		const categoriesData = await categoriesResponse.json();

		// Apply search and sort filters client-side if needed
		let products = categoryData.category?.products || [];
		
		if (search) {
			const searchLower = search.toLowerCase();
			products = products.filter((product: any) =>
				product.name.toLowerCase().includes(searchLower) ||
				(product.description && product.description.toLowerCase().includes(searchLower))
			);
		}

		// Sort products
		products.sort((a: any, b: any) => {
			let aVal: any = a[sort as keyof typeof a];
			let bVal: any = b[sort as keyof typeof b];

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

		// Apply pagination to filtered results
		const total = products.length;
		const paginatedProducts = products.slice(offset, offset + limit);

		return {
			category: {
				...categoryData.category,
				products: paginatedProducts
			},
			allCategories: categoriesData.categories || [],
			pagination: {
				total,
				limit,
				offset,
				hasNext: offset + limit < total,
				hasPrev: offset > 0
			},
			currentFilters: {
				search,
				sort,
				order,
				page
			}
		};
	} catch (err) {
		console.error('Failed to load category page:', err);
		throw error(500, 'Failed to load category');
	}
};