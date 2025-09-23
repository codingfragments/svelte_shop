import { json } from '@sveltejs/kit';
import { queries } from '$lib/db/index.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const category = url.searchParams.get('category');
		
		let faqs;
		if (category) {
			faqs = queries.getFAQsByCategory.all(category);
		} else {
			faqs = queries.getAllFAQs.all();
		}
		
		// Get related products for each FAQ
		const faqsWithProducts = [];
		for (const faq of faqs) {
			const products = queries.getFAQProducts.all(faq.id);
			faqsWithProducts.push({
				...faq,
				related_products: products
			});
		}
		
		return json(faqsWithProducts);
	} catch (error) {
		console.error('Failed to fetch FAQs:', error);
		return json({ error: 'Failed to fetch FAQs' }, { status: 500 });
	}
};