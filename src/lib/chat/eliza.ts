export type ChatMessage = {
	from: 'user' | 'bot';
	text: string;
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
			'How does that relate to your shopping goals?',
			'What else would you like to explore?'
		]
	}
];

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

export function respond(input: string): string {
	const cleaned = input.trim();
	if (!cleaned) {
		return 'Please share what is on your mind about shopping today.';
	}

	for (const { pattern, responses } of patterns) {
		const match = cleaned.match(pattern);
		if (!match) continue;

		let response = choose(responses);
		response = response.replace(/\$(\d)/g, (_, index: string) => {
			const capture = match[Number(index)] ?? '';
			return reflect(capture.toLowerCase());
		});
		return response;
	}

	return 'How can I assist you with your shopping experience?';
}
