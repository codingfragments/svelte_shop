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

interface SeedFAQ {
	question: string;
	answer: string;
	category: string;
	is_featured: boolean;
	related_products?: string[]; // Product slugs
}

interface SeedData {
	categories: typeof APP_CONFIG.categories;
	products: SeedProduct[];
	faqs: SeedFAQ[];
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

// Generate FAQ data with keyboard facts and related products
function generateFAQs(): SeedFAQ[] {
	return [
		{
			question: "What are mechanical keyboards and how do they differ from membrane keyboards?",
			answer: "Mechanical keyboards use individual mechanical switches under each key, providing tactile feedback, audible clicks, and superior durability. Unlike membrane keyboards that use a rubber dome system, mechanical switches offer consistent key feel, faster response times, and can last 50-100 million keystrokes. They're preferred by gamers, programmers, and typing enthusiasts for their precision and satisfaction.",
			category: "general",
			is_featured: true,
			related_products: ["mechanical-pro-x1", "ultra-compact-60", "tactile-wonder"]
		},
		{
			question: "What's the difference between linear, tactile, and clicky switches?",
			answer: "Linear switches (like Cherry MX Red) provide smooth keystrokes without tactile bumps or clicks, ideal for gaming. Tactile switches (like Cherry MX Brown) have a bump that you feel when the key actuates, great for typing accuracy. Clicky switches (like Cherry MX Blue) provide both tactile feedback and an audible click, loved by typing purists but can be noisy in shared spaces.",
			category: "switches",
			is_featured: true,
			related_products: ["linear-red-pro", "tactile-brown-elite", "clicky-blue-master"]
		},
		{
			question: "What does '60%', '65%', 'TKL', and 'Full Size' mean for keyboard layouts?",
			answer: "These refer to keyboard sizes: 60% keyboards remove function keys, arrow keys, and numpad for maximum compactness (61 keys). 65% adds arrow keys and some function keys (68 keys). TKL (Tenkeyless) removes only the numpad, keeping function keys and arrows (87 keys). Full Size includes everything including the numpad (104+ keys). Smaller sizes save desk space and can improve ergonomics.",
			category: "keyboards",
			is_featured: true,
			related_products: ["ultra-compact-60", "wireless-elite", "full-size-pro"]
		},
		{
			question: "What are hot-swap keyboards and why are they useful?",
			answer: "Hot-swap keyboards allow you to remove and replace switches without soldering. They use special sockets that hold switches securely while allowing easy removal with a switch puller. This lets you experiment with different switch types, replace broken switches, or upgrade your keyboard's feel without buying a new board. Perfect for enthusiasts who want to customize their typing experience.",
			category: "keyboards",
			is_featured: false,
			related_products: ["hot-swap-ready", "custom-build-kit", "switch-puller-tool"]
		},
		{
			question: "What's the difference between ABS and PBT keycaps?",
			answer: "ABS (Acrylonitrile Butadiene Styrene) keycaps are cheaper and easier to manufacture with vibrant colors and shine over time. PBT (Polybutylene Terephthalate) keycaps are more durable, resist shine, have better texture, and maintain their appearance longer. PBT caps often have a more premium feel and are preferred by enthusiasts, while ABS caps are common on gaming keyboards for their bright RGB compatibility.",
			category: "keycaps",
			is_featured: true,
			related_products: ["pbt-thick-caps", "rgb-translucent", "cherry-profile-set"]
		},
		{
			question: "What does 'Cherry Profile', 'OEM', 'SA', and other keycap profiles mean?",
			answer: "Keycap profiles define the shape and height of keycaps. Cherry profile is lower and more sculpted, preferred for fast typing. OEM is the most common profile, slightly taller than Cherry. SA profile is very tall and heavily sculpted, vintage-style. XDA and DSA are uniform height across all rows. Each profile affects typing feel, comfort, and aesthetics differently.",
			category: "keycaps",
			is_featured: false,
			related_products: ["cherry-profile-set", "oem-double-shot", "artisan-collection"]
		},
		{
			question: "How do I know which switches are right for me?",
			answer: "Consider your primary use case: gamers often prefer linear switches (Red, Black) for smooth, fast actuation. Typists usually prefer tactile switches (Brown, Clear) for feedback without noise. If you love the classic typewriter feel, try clicky switches (Blue, Green). Weight preferences vary - lighter switches (45g) for speed, heavier switches (65g+) for deliberate typing. Try a switch tester to find your preference!",
			category: "switches",
			is_featured: false,
			related_products: ["switch-tester", "linear-red-pro", "tactile-brown-elite"]
		},
		{
			question: "What is keyboard lubing and should I do it?",
			answer: "Switch lubing involves applying a thin layer of special lubricant to switch components to reduce friction, eliminate scratchiness, and create smoother keystrokes. It's an advanced modification that can significantly improve typing feel, especially on budget switches. However, it's time-consuming (2-4 hours per keyboard) and requires practice. Many premium switches come pre-lubed from the factory.",
			category: "switches",
			is_featured: false,
			related_products: ["lube-station-kit", "custom-lubed", "premium-aluminum"]
		},
		{
			question: "What's the purpose of stabilizers on keyboards?",
			answer: "Stabilizers ('stabs') are mechanisms that keep larger keys (spacebar, enter, shift) stable and prevent them from wobbling or binding when pressed off-center. Good stabilizers ensure smooth, consistent key presses across the entire key surface. Poor stabilizers cause rattling, sticking, or uneven key feel. Quality stabilizers are crucial for a premium typing experience.",
			category: "keyboards",
			is_featured: false,
			related_products: ["stabilizer-set", "premium-aluminum", "custom-build-kit"]
		},
		{
			question: "Why are some mechanical keyboards so expensive?",
			answer: "Premium keyboards use high-quality materials like aluminum cases, brass plates, and premium switches. Features like hot-swap sockets, USB-C connectivity, wireless capability, and RGB lighting add cost. Small-batch artisan boards have higher manufacturing costs. Additionally, research and development for innovative designs, premium packaging, and brand reputation contribute to pricing. You're paying for durability, features, and typing experience.",
			category: "general",
			is_featured: false,
			related_products: ["premium-aluminum", "wireless-elite", "artisan-custom"]
		},
		{
			question: "What's the difference between 2.4GHz and Bluetooth wireless keyboards?",
			answer: "2.4GHz wireless uses a dedicated USB receiver for low-latency connection, ideal for gaming with response times under 1ms. Bluetooth connects directly to devices without a receiver, perfect for multiple device switching and mobile use, but has higher latency (20-50ms). Many modern keyboards offer both modes, letting you choose based on your needs - 2.4GHz for gaming, Bluetooth for productivity.",
			category: "keyboards",
			is_featured: false,
			related_products: ["wireless-elite", "wireless-freedom", "wireless-adapter"]
		},
		{
			question: "How do I clean and maintain my mechanical keyboard?",
			answer: "Regular maintenance keeps your keyboard performing well: 1) Use compressed air to blow out debris weekly. 2) Remove keycaps monthly for deep cleaning with mild soap and water. 3) Clean the board surface with isopropyl alcohol wipes. 4) For switches, use a brush to remove dust. 5) Avoid eating over your keyboard. 6) Store in a dust-free environment. Proper care can extend your keyboard's life significantly.",
			category: "general",
			is_featured: false,
			related_products: ["cleaning-kit", "keycap-remover", "carrying-case-pro"]
		},
		{
			question: "What cables work best with mechanical keyboards?",
			answer: "USB-C is becoming the standard for modern keyboards, offering reversible connection and faster data transfer. Coiled cables add aesthetic appeal and reduce desk clutter while allowing flexibility. Braided or paracord sleeving provides durability and looks premium. Detachable cables make storage and transport easier. Avoid cheap cables that may cause connection issues or limit features like RGB or high polling rates.",
			category: "cables",
			is_featured: false,
			related_products: ["coiled-usb-c-pro", "braided-nylon", "detachable-design"]
		},
		{
			question: "Do I need a wrist rest for my mechanical keyboard?",
			answer: "Wrist rests can improve comfort during long typing sessions by maintaining proper wrist alignment and reducing strain. They're especially helpful with taller keyboards or if you experience wrist fatigue. However, the key is proper typing technique - wrists should float, not rest constantly. Choose ergonomic designs that match your keyboard's height and provide appropriate support without forcing unnatural hand positions.",
			category: "accessories",
			is_featured: false,
			related_products: ["wrist-rest-ergonomic", "desk-mat-large", "ergonomic-stand"]
		},
		{
			question: "What's the deal with artisan keycaps?",
			answer: "Artisan keycaps are handcrafted, often one-of-a-kind keycaps that serve as art pieces and conversation starters. They're typically made from resin, wood, or metal with intricate designs, colors, or embedded objects. While they don't improve functionality, they add personality and uniqueness to your keyboard. Prices range from $20 to hundreds of dollars for rare pieces from renowned artisans.",
			category: "keycaps",
			is_featured: false,
			related_products: ["artisan-collection", "custom-legend-set", "colorway-special"]
		},
		{
			question: "How important is keyboard polling rate for gaming?",
			answer: "Polling rate (measured in Hz) determines how often your keyboard reports key presses to your computer. Higher rates (1000Hz) mean lower input lag but use more CPU. For most gaming, 125Hz is sufficient, but competitive gamers may benefit from 1000Hz. The difference is minimal (8ms vs 1ms) and other factors like switch type, your reaction time, and monitor refresh rate have bigger impacts on gaming performance.",
			category: "keyboards",
			is_featured: false,
			related_products: ["gaming-legend", "rgb-gaming-master", "speed-silver"]
		},
		{
			question: "What's N-Key Rollover and Anti-Ghosting?",
			answer: "N-Key Rollover (NKRO) means your keyboard can register unlimited simultaneous key presses without conflicts. Anti-ghosting prevents 'phantom' key presses when multiple keys are held. These features are crucial for gaming and fast typing where multiple keys might be pressed simultaneously. Most quality mechanical keyboards support at least 6-key rollover, while premium boards offer full NKRO.",
			category: "keyboards",
			is_featured: false,
			related_products: ["gaming-legend", "professional-plus", "ultra-compact-60"]
		},
		{
			question: "How do RGB keyboards work and are they worth it?",
			answer: "RGB keyboards use LED lights under each key that can display millions of colors and effects. They're controlled by software allowing custom lighting patterns, reactive typing effects, and game integration. While purely aesthetic, RGB can improve visibility in dark environments and add personality to your setup. Consider whether you value customization and ambiance, as RGB typically adds $20-50 to keyboard cost.",
			category: "keyboards",
			is_featured: false,
			related_products: ["rgb-gaming-master", "rgb-translucent", "neon-glow-set"]
		},
		{
			question: "What tools do I need to build a custom keyboard?",
			answer: "Basic custom keyboard building requires: switch pullers for hot-swap boards, keycap pullers for maintenance, screwdrivers for case assembly, and optionally a soldering iron for non-hot-swap builds. Advanced builders use switch lubing stations, films for switch modification, foam for sound dampening, and various stabilizer tools. Start with hot-swap kits to avoid soldering while learning the hobby.",
			category: "accessories",
			is_featured: false,
			related_products: ["tool-set-complete", "lube-station-kit", "switch-puller-tool"]
		},
		{
			question: "How do I reduce keyboard noise for office use?",
			answer: "Several approaches reduce keyboard noise: choose linear or tactile switches over clicky ones, use dampening foam inside the case, install O-rings under keycaps to reduce bottom-out sound, ensure proper stabilizer lubrication, and consider a desk mat to absorb vibrations. Silent switches like Cherry MX Silent Red are specifically designed for quiet operation while maintaining mechanical feel.",
			category: "general",
			is_featured: false,
			related_products: ["silent-stealth", "silent-black", "foam-dampener", "o-ring-kit"]
		}
	];
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
		products: [],
		faqs: generateFAQs()
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
		
		// Insert FAQs
		console.log('Inserting FAQs...');
		let faqCount = 0;
		let faqProductCount = 0;
		const usedFAQProductPairs = new Set<string>(); // Track used FAQ-product pairs
		
		for (let i = 0; i < seedData.faqs.length; i++) {
			const faq = seedData.faqs[i];
			
			// Insert FAQ
			const faqResult = queries.insertFAQ.run(
				faq.question,
				faq.answer,
				faq.category,
				i, // sort_order
				faq.is_featured ? 1 : 0 // Convert boolean to integer
			);
			
			const faqId = faqResult.lastInsertRowid;
			faqCount++;
			
			// Insert related products if any
			if (faq.related_products && faq.related_products.length > 0) {
				const categoryMatch = faq.category === 'keyboards' ? 'keyboards' :
									faq.category === 'switches' ? 'switches' :
									faq.category === 'keycaps' ? 'keycaps' :
									faq.category === 'cables' ? 'cables' :
									'accessories';
									
				// Get multiple products from the matching category
				const categoryProducts = db.prepare(`
					SELECT p.id FROM products p
					JOIN categories c ON p.category_id = c.id
					WHERE c.slug = ?
					ORDER BY RANDOM()
					LIMIT 5
				`).all(categoryMatch) as any[];
				
				let linkedCount = 0;
				for (const product of categoryProducts) {
					if (linkedCount >= Math.min(faq.related_products.length, 3)) break;
					
					const pairKey = `${faqId}-${product.id}`;
					if (!usedFAQProductPairs.has(pairKey)) {
						queries.insertFAQProduct.run(faqId, product.id, linkedCount);
						usedFAQProductPairs.add(pairKey);
						faqProductCount++;
						linkedCount++;
					}
				}
			}
		}
		
		console.log(`Inserted ${faqCount} FAQs with ${faqProductCount} product links`);
		console.log('Database seeding completed successfully!');
		
		// Print summary
		const categoryStats = queries.getAllCategories.all() as any[];
		for (const cat of categoryStats) {
			const productCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(cat.id) as any;
			console.log(`${cat.name}: ${productCount.count} products`);
		}
		
		const faqStats = db.prepare('SELECT COUNT(*) as count FROM faqs').get() as any;
		console.log(`FAQs: ${faqStats.count} entries`);
		
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