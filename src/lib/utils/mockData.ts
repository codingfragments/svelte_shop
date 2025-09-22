// Mock data utilities for ratings, reviews, and other placeholder data

interface MockRating {
	rating: number;
	count: number;
	breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

interface MockReview {
	id: string;
	user: string;
	avatar: string;
	rating: number;
	title: string;
	content: string;
	date: string;
	verified: boolean;
	helpful: number;
}

interface MockProductSpecs {
	[key: string]: string | number | string[];
}

// Generate consistent mock rating based on product ID
export function generateMockRating(productId: number): MockRating {
	const seed = productId * 7919; // Large prime for consistent randomness
	const random = () => (Math.sin(seed * Math.random()) + 1) / 2;
	
	// Generate rating between 3.5 and 5.0 (products are generally well-rated)
	const rating = 3.5 + (random() * 1.5);
	const count = Math.floor(15 + random() * 200); // 15-215 reviews
	
	// Generate rating breakdown
	const breakdown = {
		5: Math.floor(count * (0.4 + random() * 0.35)),
		4: 0,
		3: 0,
		2: 0,
		1: 0
	};
	
	const remaining = count - breakdown[5];
	breakdown[4] = Math.floor(remaining * (0.6 + random() * 0.3));
	breakdown[3] = Math.floor((remaining - breakdown[4]) * (0.4 + random() * 0.4));
	breakdown[2] = Math.floor((remaining - breakdown[4] - breakdown[3]) * (0.3 + random() * 0.4));
	breakdown[1] = remaining - breakdown[4] - breakdown[3] - breakdown[2];
	
	return {
		rating: Math.round(rating * 10) / 10,
		count,
		breakdown
	};
}

// Generate mock reviews for a product
export function generateMockReviews(productId: number, category: string, count: number = 5): MockReview[] {
	const seed = productId * 1009;
	
	const usernames = [
		'KeyboardNinja', 'SwitchMaster', 'ClackyFan', 'TactileLover', 'LinearUser',
		'KeycapCollector', 'MechEnthusiast', 'TypingSpeedster', 'CustomBuilder', 'ThockLife',
		'SwitchTester', 'KeyboardGeek', 'MechHeaven', 'ClickyBoi', 'SilentTyper'
	];
	
	const titles = {
		keyboards: [
			'Amazing build quality!', 'Perfect for gaming', 'Love the typing feel',
			'Great value for money', 'Solid construction', 'Beautiful aesthetics',
			'My new daily driver', 'Exceeded expectations', 'Premium feel'
		],
		switches: [
			'Smooth and responsive', 'Perfect tactile bump', 'Great sound profile',
			'Consistent feel', 'No wobble at all', 'Love the actuation force',
			'Best switches I\'ve tried', 'Buttery smooth', 'Perfect for typing'
		],
		keycaps: [
			'Beautiful colorway', 'Perfect fit and finish', 'Great texture',
			'Love the legends', 'Quality PBT plastic', 'Transforms my board',
			'Stunning design', 'No shine after months', 'Perfect thickness'
		],
		cables: [
			'Great build quality', 'Perfect length', 'Nice coil tension',
			'Beautiful colors', 'Solid connectors', 'No signal issues',
			'Premium feel', 'Matches my setup', 'Excellent craftsmanship'
		],
		accessories: [
			'Useful addition', 'Great quality', 'Perfect for my setup',
			'Solves the problem', 'Well made', 'Good value',
			'Exactly what I needed', 'High quality materials', 'Recommended'
		]
	};
	
	const contents = {
		keyboards: [
			'This keyboard has completely changed my typing experience. The build quality is outstanding and it feels incredibly premium.',
			'Been using this for 3 months now and it\'s been flawless. The switches feel great and the build is rock solid.',
			'Perfect for both gaming and work. The layout is comfortable and the sound is amazing with good switches.',
			'Assembly was straightforward and the end result is beautiful. Highly recommend for anyone wanting to upgrade.',
			'The typing experience is sublime. Every key press feels consistent and satisfying.'
		],
		switches: [
			'These switches are incredible. The consistency between each switch is remarkable and they feel amazing.',
			'Perfect balance of tactility and smoothness. No scratchiness at all, they\'re factory lubed perfectly.',
			'Sound profile is exactly what I was looking for. Not too loud but still satisfying to type on.',
			'Been using these for months and they still feel as good as day one. Great durability.',
			'Upgraded from my old switches and the difference is night and day. These are so much better.'
		],
		keycaps: [
			'The quality of these keycaps is outstanding. The legends are crisp and the colors are exactly as pictured.',
			'Perfect thickness and the texture feels premium. No signs of wear after heavy use.',
			'These completely transformed the look of my keyboard. The colorway is gorgeous.',
			'Fit perfectly on my board with no issues. The profile feels great for typing.',
			'Worth every penny. The quality is evident from the moment you touch them.'
		],
		cables: [
			'Beautiful cable that matches my setup perfectly. The coil holds its shape well.',
			'Great quality connectors and the cable feels very premium. No connection issues.',
			'The length is perfect for my setup and the colors look amazing.',
			'Solid build quality throughout. The connectors feel very secure.',
			'Exactly what I was looking for. Great craftsmanship and attention to detail.'
		],
		accessories: [
			'This accessory has made my keyboard experience so much better. Great quality.',
			'Perfect addition to my setup. Well made and serves its purpose perfectly.',
			'Great value for the price. Quality is better than expected.',
			'Exactly what I needed for my build. Fits perfectly and works great.',
			'Good quality materials and construction. Would definitely recommend.'
		]
	};
	
	const reviews: MockReview[] = [];
	const categoryTitles = titles[category as keyof typeof titles] || titles.keyboards;
	const categoryContents = contents[category as keyof typeof contents] || contents.keyboards;
	
	for (let i = 0; i < count; i++) {
		const userIndex = (seed + i) % usernames.length;
		const titleIndex = (seed + i) % categoryTitles.length;
		const contentIndex = (seed + i) % categoryContents.length;
		
		const rating = Math.floor(4 + (Math.sin(seed + i) + 1) / 2 * 2); // 4-5 stars mostly
		const daysAgo = Math.floor(Math.random() * 90); // Within last 90 days
		const date = new Date();
		date.setDate(date.getDate() - daysAgo);
		
		reviews.push({
			id: `review-${productId}-${i}`,
			user: usernames[userIndex],
			avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernames[userIndex]}`,
			rating,
			title: categoryTitles[titleIndex],
			content: categoryContents[contentIndex],
			date: date.toISOString(),
			verified: Math.random() > 0.3, // 70% verified purchases
			helpful: Math.floor(Math.random() * 20)
		});
	}
	
	return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate product specifications based on category
export function generateMockSpecs(category: string, productName: string): MockProductSpecs {
	const specs: MockProductSpecs = {};
	
	switch (category) {
		case 'keyboards':
			specs['Layout'] = Math.random() > 0.5 ? '60%' : Math.random() > 0.5 ? '65%' : 'Full Size';
			specs['Connection'] = Math.random() > 0.5 ? 'USB-C' : 'Wireless (2.4GHz + Bluetooth)';
			specs['Hot-swap'] = Math.random() > 0.3 ? 'Yes' : 'No';
			specs['Mounting Style'] = ['Gasket', 'Top Mount', 'Tray Mount', 'Plateless'][Math.floor(Math.random() * 4)];
			specs['Case Material'] = ['Aluminum', 'Polycarbonate', 'ABS Plastic'][Math.floor(Math.random() * 3)];
			specs['Plate Material'] = ['FR4', 'Aluminum', 'Carbon Fiber', 'Polycarbonate'][Math.floor(Math.random() * 4)];
			specs['Keycaps'] = ['PBT Double-shot', 'ABS Double-shot', 'PBT Dye-sub'][Math.floor(Math.random() * 3)];
			specs['Switches'] = ['Included', 'Not Included (Hot-swap)'][Math.floor(Math.random() * 2)];
			specs['RGB'] = Math.random() > 0.4 ? 'Per-key RGB' : 'None';
			specs['Weight'] = `${(0.8 + Math.random() * 1.5).toFixed(1)} kg`;
			break;
			
		case 'switches':
			specs['Type'] = ['Linear', 'Tactile', 'Clicky'][Math.floor(Math.random() * 3)];
			specs['Actuation Force'] = `${Math.floor(35 + Math.random() * 30)}g`;
			specs['Total Travel'] = `${(3.5 + Math.random() * 0.8).toFixed(1)}mm`;
			specs['Actuation Distance'] = `${(1.8 + Math.random() * 0.7).toFixed(1)}mm`;
			specs['Housing'] = ['Nylon', 'Polycarbonate', 'POM'][Math.floor(Math.random() * 3)];
			specs['Stem'] = ['POM', 'Nylon'][Math.floor(Math.random() * 2)];
			specs['Spring'] = ['Stainless Steel', 'Gold-plated'][Math.floor(Math.random() * 2)];
			specs['Factory Lubed'] = Math.random() > 0.5 ? 'Yes' : 'No';
			specs['5-pin'] = Math.random() > 0.3 ? 'Yes' : 'No (3-pin)';
			specs['Quantity'] = '10 switches';
			break;
			
		case 'keycaps':
			specs['Profile'] = ['Cherry', 'OEM', 'SA', 'XDA', 'DSA'][Math.floor(Math.random() * 5)];
			specs['Material'] = ['PBT', 'ABS'][Math.floor(Math.random() * 2)];
			specs['Legends'] = ['Double-shot', 'Dye-sublimated', 'Laser Etched'][Math.floor(Math.random() * 3)];
			specs['Thickness'] = `${(1.2 + Math.random() * 0.4).toFixed(1)}mm`;
			specs['Compatibility'] = 'Cherry MX style switches';
			specs['Layout Support'] = ['60%', '65%', '75%', 'TKL', 'Full Size'].slice(0, Math.floor(2 + Math.random() * 3)).join(', ');
			specs['Keys Included'] = `${Math.floor(104 + Math.random() * 40)} keys`;
			specs['Texture'] = ['Smooth', 'Textured'][Math.floor(Math.random() * 2)];
			break;
			
		case 'cables':
			specs['Length'] = [`${Math.floor(4 + Math.random() * 4)}ft`, `${Math.floor(6 + Math.random() * 6)}ft coiled`][Math.floor(Math.random() * 2)];
			specs['Connector A'] = 'USB-A';
			specs['Connector B'] = ['USB-C', 'Micro-USB', 'Mini-USB'][Math.floor(Math.random() * 3)];
			specs['Cable Type'] = ['Coiled', 'Straight'][Math.floor(Math.random() * 2)];
			specs['Sleeving'] = ['Paracord', 'Techflex', 'None'][Math.floor(Math.random() * 3)];
			specs['Connector Finish'] = ['Gold-plated', 'Nickel-plated'][Math.floor(Math.random() * 2)];
			specs['Data Transfer'] = 'USB 2.0';
			specs['Color'] = ['Black', 'White', 'Custom'][Math.floor(Math.random() * 3)];
			break;
			
		case 'accessories':
			specs['Material'] = ['Aluminum', 'Wood', 'Acrylic', 'Plastic'][Math.floor(Math.random() * 4)];
			specs['Compatibility'] = 'Universal';
			specs['Dimensions'] = `${Math.floor(10 + Math.random() * 20)}cm x ${Math.floor(8 + Math.random() * 15)}cm`;
			specs['Weight'] = `${(0.1 + Math.random() * 0.5).toFixed(1)} kg`;
			specs['Color'] = ['Black', 'Silver', 'White', 'Custom'][Math.floor(Math.random() * 4)];
			break;
	}
	
	return specs;
}

// Generate related products suggestions
export function generateRelatedProducts(categorySlug: string, currentProductId: number): string[] {
	const suggestions = {
		keyboards: ['Premium keycap set', 'Custom switches', 'Artisan cable', 'Wrist rest'],
		switches: ['Switch opener tool', 'Lubricant kit', 'Spring set', 'Switch films'],
		keycaps: ['Artisan keycaps', 'Custom cable', 'Keycap puller', 'Keyboard case'],
		cables: ['Cable management', 'USB hub', 'Desk mat', 'Cable stand'],
		accessories: ['Cleaning kit', 'Desk organizer', 'LED strips', 'Switch tester']
	};
	
	return suggestions[categorySlug as keyof typeof suggestions] || [];
}

// Generate enthusiast commentary for products
export function generateEnthusiastComment(productId: number, category: string, productName: string): string {
	const seed = productId * 4649; // Prime for consistent randomness
	
	const comments = {
		keyboards: [
			"The typing experience on this board is absolutely sublime. Every keystroke feels deliberate and satisfying - the perfect balance of tactility and smoothness.",
			"This keyboard has completely transformed my daily workflow. The build quality is exceptional and the sound signature is exactly what I was looking for.",
			"After months of research and testing, this is hands down the best board I've owned. The premium materials and attention to detail really shine through.",
			"The gasket mount design gives this keyboard the perfect amount of flex. Each keypress has this wonderful bouncy feel that never gets old.",
			"I've been in the hobby for years and this board still manages to impress me daily. The typing feel is incredibly consistent across all keys.",
			"The sound profile is chef's kiss - that perfect thocky tone that audiophiles dream of. Neighbors might complain but it's worth every decibel!"
		],
		switches: [
			"These switches are buttery smooth right out of the box. The consistency between each switch is remarkable - no scratchiness or ping whatsoever.",
			"The tactile bump is perfectly placed and not overpowering. Great for both typing and gaming without being fatiguing during long sessions.",
			"Factory lubing on these is on point. Saved me hours of work and they feel premium from day one. The sound is crisp and clean.",
			"Linear perfection! These switches glide like silk and the bottom-out is satisfying without being harsh. My new daily drivers for sure.",
			"The spring weight is spot on for my typing style. Not too light to cause accidental presses, not too heavy to cause finger fatigue.",
			"These have become my go-to switches for builds. The quality control is excellent and they mod beautifully if you want to customize further."
		],
		keycaps: [
			"The legends are crisp and will never fade thanks to the double-shot construction. The texture feels premium and the colors are exactly as pictured.",
			"Perfect thickness - you can feel the quality immediately. These caps have completely transformed the look and feel of my keyboard.",
			"The colorway is absolutely stunning in person. Photos don't do justice to how vibrant and rich these colors are under different lighting.",
			"Cherry profile is my favorite and these caps nail the ergonomics perfectly. Comfortable for hours of typing without any strain.",
			"PBT plastic feels so much better than ABS. No shine even after months of heavy use and the texture is just right - not too smooth, not too rough.",
			"The compatibility is excellent - fit perfectly on my board with no warping or fitment issues. Quality control is clearly top-notch."
		],
		cables: [
			"The coil holds its shape beautifully and the connectors feel incredibly solid. This cable has the perfect balance of flexibility and structure.",
			"Gorgeous cable that perfectly matches my setup. The craftsmanship is evident in every detail from the sleeving to the heat shrink.",
			"No signal issues whatsoever and the length is perfect for my desk setup. The magnetic connector is a game-changer for swapping boards.",
			"The colors are vibrant and the build quality is exceptional. This cable has become the centerpiece of my keyboard aesthetic.",
			"Solid connections, no dropouts, and it looks absolutely stunning. Worth every penny for the premium feel and reliability.",
			"The attention to detail is incredible - from the custom connector housings to the perfectly wound coil. Truly artisan quality."
		],
		accessories: [
			"This accessory has made such a difference in my setup. The build quality exceeds expectations and it serves its purpose perfectly.",
			"Exactly what I needed to complete my build. The materials feel premium and the functionality is spot-on for keyboard enthusiasts.",
			"Great addition to any mechanical keyboard setup. The design is thoughtful and the execution is flawless.",
			"This has become an essential part of my keyboard workflow. Well-designed, well-built, and incredibly useful.",
			"The quality-to-price ratio is outstanding. This accessory punches way above its weight class in terms of build quality.",
			"Simple but effective design that just works. Sometimes the best products are the ones you don't have to think about."
		]
	};

	const categoryComments = comments[category as keyof typeof comments] || comments.keyboards;
	const commentIndex = Math.abs(seed) % categoryComments.length;
	
	return categoryComments[commentIndex];
}