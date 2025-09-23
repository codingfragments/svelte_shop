import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/faqs');
		if (!response.ok) {
			throw new Error('Failed to fetch FAQs');
		}
		
		const faqs = await response.json();
		
		// Group FAQs by category
		const faqsByCategory = faqs.reduce((acc: any, faq: any) => {
			const category = faq.category || 'general';
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(faq);
			return acc;
		}, {});
		
		return {
			faqsByCategory
		};
	} catch (error) {
		console.error('Error loading FAQs:', error);
		return {
			faqsByCategory: {}
		};
	}
};