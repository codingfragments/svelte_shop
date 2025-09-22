import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const searchParams = url.searchParams;
	const query = searchParams.get('q') || '';
	const category = searchParams.get('category') || '';
	const sort = searchParams.get('sort') || 'created_at';
	const order = searchParams.get('order') || 'DESC';
	const page = parseInt(searchParams.get('page') || '1');
	const limit = 12;
	const offset = (page - 1) * limit;

	if (!query || query.trim().length < 2) {
		return {
			results: [],
			query,
			pagination: { total: 0, limit, offset, hasNext: false, hasPrev: false },
			categories: [],
			currentFilters: { query, category, sort, order, page }
		};
	}

	try {
		// Use the products API with search parameter
		const apiUrl = new URL('/api/products', url.origin);
		apiUrl.searchParams.set('search', query);
		if (category) apiUrl.searchParams.set('category', category);
		apiUrl.searchParams.set('sort', sort);
		apiUrl.searchParams.set('order', order);
		apiUrl.searchParams.set('limit', limit.toString());
		apiUrl.searchParams.set('offset', offset.toString());

		const [resultsResponse, categoriesResponse] = await Promise.all([
			fetch(apiUrl.toString()),
			fetch('/api/categories?stats=true')
		]);

		const resultsData = await resultsResponse.json();
		const categoriesData = await categoriesResponse.json();

		return {
			results: resultsData.products || [],
			query,
			pagination: resultsData.pagination || { total: 0, limit, offset, hasNext: false, hasPrev: false },
			categories: categoriesData.categories || [],
			currentFilters: { query, category, sort, order, page }
		};
	} catch (error) {
		console.error('Search failed:', error);
		return {
			results: [],
			query,
			pagination: { total: 0, limit, offset, hasNext: false, hasPrev: false },
			categories: [],
			currentFilters: { query, category, sort, order, page }
		};
	}
};