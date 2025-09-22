import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queries, db, type Category } from '$lib/db/index.js';

interface CategoryWithStats extends Category {
	product_count: number;
	featured_count: number;
	in_stock_count: number;
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		const includeStats = url.searchParams.get('stats') === 'true';

		// Get all categories
		const categories = queries.getAllCategories.all() as Category[];

		let categoriesWithStats: CategoryWithStats[];

		if (includeStats) {
			// Get product counts for each category
			categoriesWithStats = categories.map(category => {
				const productCount = db.prepare(
					'SELECT COUNT(*) as count FROM products WHERE category_id = ?'
				).get(category.id) as { count: number };

				const featuredCount = db.prepare(
					'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND featured = 1'
				).get(category.id) as { count: number };

				const inStockCount = db.prepare(
					'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND in_stock = 1'
				).get(category.id) as { count: number };

				return {
					...category,
					product_count: productCount.count,
					featured_count: featuredCount.count,
					in_stock_count: inStockCount.count
				};
			});
		} else {
			categoriesWithStats = categories.map(category => ({
				...category,
				product_count: 0,
				featured_count: 0,
				in_stock_count: 0
			}));
		}

		return json({
			categories: categoriesWithStats,
			total: categories.length
		});

	} catch (error) {
		console.error('Categories API error:', error);
		return json(
			{ error: 'Failed to fetch categories' },
			{ status: 500 }
		);
	}
};