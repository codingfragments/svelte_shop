import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { APP_CONFIG } from '../src/lib/config.js';
import { db, initializeDatabase, wipeDatabase, queries } from '../src/lib/db/index.js';

interface SeedProduct {
	name: string;
	description: string;
	price: number;
	category: string;
	in_stock: boolean;
	stock_quantity: number;
	sku?: string;
	featured: boolean;
	pictures: string[];
}

interface SeedData {
	categories: typeof APP_CONFIG.categories;
	products: SeedProduct[];
}

// Generate slug from name
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Get random images from category folder
function getRandomImages(categorySlug: string, count: number = Math.floor(Math.random() * 3) + 1): string[] {
	try {
		const imagesPath = join(process.cwd(), 'static', 'images', categorySlug);
		const imageFiles = readdirSync(imagesPath).filter(file => 
			file.toLowerCase().endsWith('.png') || 
			file.toLowerCase().endsWith('.jpg') || 
			file.toLowerCase().endsWith('.jpeg')
		);
		
		const shuffled = imageFiles.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, Math.min(count, imageFiles.length));
	} catch (error) {
		console.warn(`Could not read images for category ${categorySlug}:`, error);
		return [];
	}
}

// Generate random product name based on category
function generateProductName(category: string): string {
	const productNames = {
		keyboards: [
			'Mechanical Pro X1', 'Ultra Compact 60%', 'Wireless Elite', 'RGB Gaming Master',
			'Tactile Wonder', 'Silent Stealth', 'Custom Build Kit', 'Premium Aluminum',
			'Hot-Swap Ready', 'Wireless Freedom', 'Compact Travel', 'Full Size Pro',
			'Gaming Legend', 'Artisan Custom', 'Professional Plus', 'Minimalist White'
		],
		keycaps: [
			'Cherry Profile Set', 'OEM Double Shot', 'Artisan Collection', 'Retro Vintage',
			'RGB Translucent', 'PBT Thick Caps', 'Custom Legend Set', 'Blank Minimalist',
			'Colorway Special', 'Gaming Legend Set', 'Professional Black', 'Pastel Dream',
			'Neon Glow Set', 'Classic Blue', 'Sunset Orange', 'Ocean Wave'
		],
		switches: [
			'Linear Red Pro', 'Tactile Brown Elite', 'Clicky Blue Master', 'Silent Black',
			'Speed Silver', 'Heavy Clear', 'Vintage White', 'Custom Lubed',
			'Holy Panda', 'Gateron Yellow', 'Cherry MX Blue', 'Kailh Box White',
			'Zealios V2', 'Alpaca Linear', 'Tangerine Switch', 'Creamy White'
		],
		cables: [
			'Coiled USB-C Pro', 'Braided Nylon', 'Wireless Adapter', 'Magnetic Connector',
			'Custom Length', 'Premium Sleeved', 'Right Angle', 'Gold Plated',
			'Flexible Coil', 'Detachable Design', 'Color Matched', 'Heavy Duty',
			'Ultra Flexible', 'Quick Connect', 'Premium Build', 'Custom Colors'
		],
		accessories: [
			'Wrist Rest Ergonomic', 'Switch Puller Tool', 'Keycap Remover', 'Lube Station Kit',
			'Carrying Case Pro', 'Desk Mat Large', 'Switch Tester', 'Foam Dampener',
			'Stabilizer Set', 'O-Ring Kit', 'Cleaning Kit', 'Tool Set Complete',
			'Cable Management', 'Stand Adjustable', 'LED Strip Kit', 'Sound Dampener'
		]
	};

	const names = productNames[category as keyof typeof productNames] || ['Generic Product'];
	return names[Math.floor(Math.random() * names.length)];
}

// Generate random product description
function generateDescription(categoryName: string, productName: string): string {
	const descriptions = [
		`Premium ${categoryName.slice(0, -1)} designed for enthusiasts who demand the best quality and performance.`,
		`Professional-grade ${categoryName.slice(0, -1)} with exceptional build quality and attention to detail.`,
		`High-performance ${categoryName.slice(0, -1)} perfect for gaming, typing, and professional work.`,
		`Custom ${categoryName.slice(0, -1)} featuring premium materials and expert craftsmanship.`,
		`Next-generation ${categoryName.slice(0, -1)} with innovative design and superior functionality.`
	];
	
	return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Generate random price based on category
function generatePrice(category: string): number {
	const priceRanges = {
		keyboards: { min: 89.99, max: 299.99 },
		keycaps: { min: 29.99, max: 149.99 },
		switches: { min: 0.65, max: 1.89 },
		cables: { min: 19.99, max: 79.99 },
		accessories: { min: 9.99, max: 89.99 }
	};
	
	const range = priceRanges[category as keyof typeof priceRanges] || { min: 10, max: 100 };
	return Math.round((Math.random() * (range.max - range.min) + range.min) * 100) / 100;
}

// Load seed data from JSON or generate
function loadSeedData(): SeedData {
	const seedFilePath = join(process.cwd(), 'productseed.json');
	
	if (existsSync(seedFilePath)) {
		try {
			const rawData = readFileSync(seedFilePath, 'utf-8');
			const data = JSON.parse(rawData) as SeedData;
			console.log('Loaded seed data from productseed.json');
			return data;
		} catch (error) {
			console.warn('Failed to load productseed.json, generating random data:', error);
		}
	}
	
	// Generate random seed data
	console.log('Generating random seed data...');
	const seedData: SeedData = {
		categories: APP_CONFIG.categories,
		products: []
	};
	
	// Generate 10-20 products per category
	for (const category of APP_CONFIG.categories) {
		const productCount = Math.floor(Math.random() * 11) + 10; // 10-20 products
		
		for (let i = 0; i < productCount; i++) {
			const productName = generateProductName(category.slug);
			const pictures = getRandomImages(category.slug);
			
			seedData.products.push({
				name: productName,
				description: generateDescription(category.name, productName),
				price: generatePrice(category.slug),
				category: category.slug,
				in_stock: Math.random() > 0.1, // 90% chance of being in stock
				stock_quantity: Math.floor(Math.random() * 100) + 1,
				sku: `${category.slug.toUpperCase()}-${(i + 1).toString().padStart(3, '0')}`,
				featured: Math.random() > 0.8, // 20% chance of being featured
				pictures: pictures.map(pic => `/images/${category.slug}/${pic}`)
			});
		}
	}
	
	return seedData;
}

// Main seeding function
export function seedDatabase() {
	console.log('Starting database seeding...');
	
	try {
		// Wipe and initialize database
		console.log('Wiping existing database...');
		wipeDatabase();
		
		console.log('Initializing database schema...');
		initializeDatabase();
		
		// Load seed data
		const seedData = loadSeedData();
		
		// Insert categories
		console.log('Inserting categories...');
		for (const category of seedData.categories) {
			queries.insertCategory.run(
				category.name,
				category.slug,
				category.description,
				category.icon
			);
		}
		console.log(`Inserted ${seedData.categories.length} categories`);
		
		// Insert products
		console.log('Inserting products...');
		let productCount = 0;
		let pictureCount = 0;
		
		for (const product of seedData.products) {
			// Get category ID
			const category = queries.getCategoryBySlug.get(product.category) as any;
			if (!category) {
				console.warn(`Category not found: ${product.category}`);
				continue;
			}
			
			// Insert product
			const productSlug = slugify(product.name + '-' + product.sku);
			const result = queries.insertProduct.run(
				product.name,
				productSlug,
				product.description,
				product.price,
				category.id,
				product.in_stock ? 1 : 0, // Convert boolean to integer
				product.stock_quantity,
				product.sku,
				product.featured ? 1 : 0  // Convert boolean to integer
			);
			
			const productId = result.lastInsertRowid;
			productCount++;
			
			// Insert product pictures
			for (let i = 0; i < product.pictures.length; i++) {
				const picturePath = product.pictures[i];
				queries.insertProductPicture.run(
					productId,
					picturePath,
					`${product.name} image ${i + 1}`,
					i,
					i === 0 ? 1 : 0 // First image is primary (convert boolean to integer)
				);
				pictureCount++;
			}
		}
		
		console.log(`Inserted ${productCount} products with ${pictureCount} pictures`);
		console.log('Database seeding completed successfully!');
		
		// Print summary
		const categoryStats = queries.getAllCategories.all() as any[];
		for (const cat of categoryStats) {
			const productCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(cat.id) as any;
			console.log(`${cat.name}: ${productCount.count} products`);
		}
		
		return true;
	} catch (error) {
		console.error('Database seeding failed:', error);
		return false;
	}
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase();
	db.close();
}