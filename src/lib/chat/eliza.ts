export type ProductSummary = {
	name: string;
	slug: string;
	categorySlug: string;
	price: number;
	image: string;
	tagline: string;
};

export type ProductSuggestion = {
	style: 'highlight' | 'card' | 'navigate';
	product: ProductSummary;
	blurb: string;
	ctaLabel?: string;
	autoNavigate?: boolean;
	navigateTo?: string;
};

export type BotResponse = {
	text: string;
	suggestion?: ProductSuggestion;
};

export type ChatMessage = {
	id: string;
	from: 'user' | 'bot';
	text?: string;
	suggestion?: ProductSuggestion;
};

const reflections = new Map<string, string>([
	['am', 'are'],
	["i'm", 'you are'],
	['i', 'you'],
	['me', 'you'],
	['my', 'your'],
	['mine', 'yours'],
	['you', 'I'],
	['your', 'my'],
	['yours', 'mine'],
	['are', 'am']
]);

const patterns: Array<{ pattern: RegExp; responses: string[] }> = [
	{
		pattern: /\b(i need|i want|i would like)\b(?:.*)/i,
		responses: [
			'Why do you need $1?',
			'Would having $1 really solve your concerns?',
			'What would it mean if you got $1?'
		]
	},
	{
		pattern: /\b(i feel|i am feeling)\b(?:.*)/i,
		responses: [
			'What makes you feel that way?',
			'Do these feelings surprise you?',
			'How long have you been feeling this?'
		]
	},
	{
		pattern: /\b(i am|i'm) (.*)/i,
		responses: [
			'How does being $2 make you feel?',
			'Why do you say you are $2?',
			'Do you want to be $2?'
		]
	},
	{
		pattern: /\b(because)\b(?:.*)/i,
		responses: [
			'Is that the real reason?',
			'What other reasons come to mind?',
			'Does that reason feel satisfying to you?'
		]
	},
	{
		pattern: /\b(yes|yeah|yep)\b/i,
		responses: [
			'I see. Can you elaborate?',
			'What else comes to mind?',
			'Under what circumstances would that change?'
		]
	},
	{
		pattern: /\bno\b/i,
		responses: [
			'Why not?',
			'What would make you say yes?',
			'Can you explain that a bit more?'
		]
	},
	{
		pattern: /\b(customer support|support|help)\b/i,
		responses: [
			'What kind of support are you looking for?',
			'Can you describe the issue you are facing with your order?',
			'Have you checked the order status page in your account?'
		]
	},
	{
		pattern: /\b(order|shipping|delivery)\b/i,
		responses: [
			'Are you asking about a recent order?',
			'When was the order placed?'
		]
	},
	{
		pattern: /\b(price|cost|expensive|cheap)\b/i,
		responses: [
			'What price range did you have in mind?',
			'Is your concern about the total cost or shipping fees?'
		]
	},
	{
		pattern: /\b(can you|could you|would you)\b(?:.*)/i,
		responses: [
			'What makes you think I can $1?',
			'How would you feel if I could $1?'
		]
	},
	{
		pattern: /\bwhy\b(?:.*)/i,
		responses: [
			'What do you think?',
			'Why do you ask?',
			'Does the reason matter to you?'
		]
	},
	{
		pattern: /\b(.*)\b/i,
		responses: [
			'Can you tell me more about $1?',
			'What led you to ask about $1 today?',
			'Happy to help—what matters most about $1 for your setup?'
		]
	}
];

const featuredProducts: ProductSummary[] = [
	{
		name: 'Professional Plus',
		slug: 'professional-plus-keyboards-001',
		categorySlug: 'keyboards',
		price: 165.61,
		image: '/images/keyboards/0b1b9eec-f15e-4ada-9470-742b06507429.png',
		tagline: 'Low-profile gasket mount with factory tuning for premium daily typing.'
	},
	{
		name: 'Wireless Freedom',
		slug: 'wireless-freedom-keyboards-002',
		categorySlug: 'keyboards',
		price: 147.89,
		image: '/images/keyboards/28ab0058-2640-4d88-8dd6-0c7e07b4873a.png',
		tagline: 'Tri-mode wireless with hot-swap switches and week-long battery life.'
	},
	{
		name: 'Custom Legend Set',
		slug: 'custom-legend-set-keycaps-001',
		categorySlug: 'keycaps',
		price: 96.56,
		image: '/images/keycaps/46aa9833-5a4e-4710-b599-624ae333731b.png',
		tagline: 'Crisp doubleshot legends in a creamy gradient to refresh any board.'
	},
	{
		name: 'Tactile Brown Elite',
		slug: 'tactile-brown-elite-switches-002',
		categorySlug: 'switches',
		price: 58.95,
		image: '/images/switches/5989f927-2fce-4e7f-a2b2-b33c9d829039.png',
		tagline: 'Pre-lubed tactiles with a satisfying bump and ultra-low wobble.'
	},
	{
		name: 'Coiled USB-C Pro',
		slug: 'coiled-usb-c-pro-cables-002',
		categorySlug: 'cables',
		price: 77.48,
		image: '/images/cables/d477e2bd-d0c1-4675-9b2a-4b2ce46d08cc.png',
		tagline: 'Hand-coiled aviator cable in our lavender finish—plug-and-play flair.'
	},
	{
		name: 'Lube Station Kit',
		slug: 'lube-station-kit-accessories-003',
		categorySlug: 'accessories',
		price: 45.38,
		image: '/images/accessories/1c05fd11-f189-46a2-a7c8-2ee033c050c9.png',
		tagline: 'All-in-one tools and trays so you can tune switches without the mess.'
	}
];

const suggestionStyles: Array<ProductSuggestion['style']> = ['highlight', 'card', 'navigate'];

let responseCounter = 0;
let productCursor = 0;
let suggestionCursor = 0;

function nextProduct(): ProductSummary {
	const product = featuredProducts[productCursor];
	productCursor = (productCursor + 1) % featuredProducts.length;
	return product;
}

function nextSuggestionStyle(): ProductSuggestion['style'] {
	const style = suggestionStyles[suggestionCursor];
	suggestionCursor = (suggestionCursor + 1) % suggestionStyles.length;
	return style;
}

function productLink(product: ProductSummary): string {
	return `/${product.categorySlug}/${product.slug}`;
}

function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

function buildHighlightSuggestion(product: ProductSummary): ProductSuggestion {
	const link = productLink(product);
	return {
		style: 'highlight',
		product,
		blurb: `How about <a href="${link}" class="font-semibold text-primary underline decoration-primary/60 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card">${product.name}</a>? It lands at ${formatPrice(product.price)} and ${product.tagline}`
	};
}

function buildCardSuggestion(product: ProductSummary): ProductSuggestion {
	return {
		style: 'card',
		product,
		blurb: 'Here’s a combo that tends to wow shoppers looking for a fast upgrade:',
		ctaLabel: 'View details'
	};
}

function buildNavigateSuggestion(product: ProductSummary): ProductSuggestion {
	const link = productLink(product);
	return {
		style: 'navigate',
		product,
		blurb: `I’ve already opened <a href="${link}" class="font-semibold text-primary underline decoration-primary/60 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card">${product.name}</a> for you—explore the specs as you read along!`,
		autoNavigate: true,
		navigateTo: link
	};
}

function createSuggestion(): ProductSuggestion {
	const product = nextProduct();
	switch (nextSuggestionStyle()) {
		case 'card':
			return buildCardSuggestion(product);
		case 'navigate':
			return buildNavigateSuggestion(product);
		default:
			return buildHighlightSuggestion(product);
	}
}

function reflect(fragment: string): string {
	return fragment
		.split(/\b/)
		.map((token) => {
			const lower = token.toLowerCase();
			return reflections.get(lower) ?? token;
		})
		.join('');
}

function choose<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

export function respond(input: string): BotResponse {
	const cleaned = input.trim();
	if (!cleaned) {
		return {
			text: 'Let me know what kind of keyboard setup or accessory you’re after and I’ll line up options.'
		};
	}

	let reply: string | undefined;

	for (const { pattern, responses } of patterns) {
		const match = cleaned.match(pattern);
		if (!match) continue;

		let responseText = choose(responses);
		responseText = responseText.replace(/\$(\d)/g, (_, index: string) => {
			const capture = match[Number(index)] ?? '';
			return reflect(capture.toLowerCase());
		});
		reply = responseText;
		break;
	}

	if (!reply) {
		reply = 'I’m on your side—tell me what you’re shopping for and I’ll tee up the best picks.';
	}

	responseCounter += 1;
	const suggestion = responseCounter % 3 === 0 ? createSuggestion() : undefined;

	return {
		text: reply,
		suggestion
	};
}
