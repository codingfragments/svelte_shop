export const APP_CONFIG = {
	// App Info
	name: 'KeyCraft',
	description: 'Next Century Keyboard Shop - Premium mechanical keyboards and accessories',
	version: '1.0.0',
	
	// Categories detected from static/images
	categories: [
		{
			id: 'keyboards',
			name: 'Keyboards',
			description: 'Premium mechanical keyboards for enthusiasts',
			slug: 'keyboards',
			icon: '⌨️'
		},
		{
			id: 'keycaps',
			name: 'Keycaps',
			description: 'Custom keycap sets to personalize your keyboard',
			slug: 'keycaps',
			icon: '🔤'
		},
		{
			id: 'switches',
			name: 'Switches',
			description: 'Mechanical switches for the perfect typing experience',
			slug: 'switches',
			icon: '🔘'
		},
		{
			id: 'cables',
			name: 'Cables',
			description: 'Custom cables and connectors',
			slug: 'cables',
			icon: '🔌'
		},
		{
			id: 'accessories',
			name: 'Accessories',
			description: 'Tools, stands, and other keyboard accessories',
			slug: 'accessories',
			icon: '🛠️'
		}
	],
	
	// API Endpoints
	api: {
		baseUrl: '/api',
		health: '/api/health'
	},
	
	// Image paths
	images: {
		basePath: '/images',
		categories: {
			keyboards: '/images/keyboards',
			keycaps: '/images/keycaps',
			switches: '/images/switches',
			cables: '/images/cables',
			accessories: '/images/accessories'
		}
	},
	
	// Store settings
	currency: 'USD',
	locale: 'en-US',
	
	// Navigation
	navigation: [
		{ name: 'Home', href: '/' },
		{ name: 'Keyboards', href: '/keyboards' },
		{ name: 'Keycaps', href: '/keycaps' },
		{ name: 'Switches', href: '/switches' },
		{ name: 'Cables', href: '/cables' },
		{ name: 'Accessories', href: '/accessories' }
	]
} as const;

export type Category = typeof APP_CONFIG.categories[number];
export type CategoryId = Category['id'];