import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const searchParams = url.searchParams;
	const category = searchParams.get('category') || '';
	const search = searchParams.get('search') || '';
	const sort = searchParams.get('sort') || 'created_at';
	const order = searchParams.get('order') || 'DESC';
	const page = parseInt(searchParams.get('page') || '1');
	const limit = 12;
	const offset = (page - 1) * limit;

	// Build API URL with parameters
	const apiUrl = new URL('/api/products', url.origin);
	if (category) apiUrl.searchParams.set('category', category);
	if (search) apiUrl.searchParams.set('search', search);
	apiUrl.searchParams.set('sort', sort);
	apiUrl.searchParams.set('order', order);
	apiUrl.searchParams.set('limit', limit.toString());
	apiUrl.searchParams.set('offset', offset.toString());

	try {
		const [productsResponse, categoriesResponse] = await Promise.all([
			fetch(apiUrl.toString()),
			fetch('/api/categories?stats=true')
		]);

		const productsData = await productsResponse.json();
		const categoriesData = await categoriesResponse.json();

		return {
			products: productsData.products || [],
			pagination: productsData.pagination || {},
			filters: productsData.filters || {},
			categories: categoriesData.categories || [],
			currentFilters: {
				category,
				search,
				sort,
				order,
				page
			}
		};
	} catch (error) {
		console.error('Failed to load products page:', error);
		return {
			products: [],
			pagination: {},
			filters: {},
			categories: [],
			currentFilters: { category, search, sort, order, page }
		};
	}
};