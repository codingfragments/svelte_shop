import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db/index.js';

export const GET: RequestHandler = async () => {
	let dbStats = null;
	let dbStatus = 'unknown';

	try {
		// Get basic database statistics
		const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
		const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
		const pictureCount = db.prepare('SELECT COUNT(*) as count FROM product_pictures').get() as { count: number };
		const featuredCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE featured = 1').get() as { count: number };
		const inStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 1').get() as { count: number };

		// Get products by category
		const categoryStats = db.prepare(`
			SELECT c.name, c.slug, COUNT(p.id) as product_count
			FROM categories c
			LEFT JOIN products p ON c.id = p.category_id
			GROUP BY c.id, c.name, c.slug
			ORDER BY c.name
		`).all() as { name: string; slug: string; product_count: number }[];

		dbStats = {
			categories: categoryCount.count,
			products: productCount.count,
			pictures: pictureCount.count,
			featured_products: featuredCount.count,
			in_stock_products: inStockCount.count,
			category_breakdown: categoryStats
		};

		dbStatus = 'connected';
	} catch (error) {
		console.error('Database health check failed:', error);
		dbStatus = 'error';
		dbStats = { error: 'Failed to query database' };
	}

	const healthData = {
		status: 'healthy',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || 'development',
		version: '1.0.0',
		database: {
			status: dbStatus,
			stats: dbStats
		}
	};

	return json(healthData, { status: 200 });
};