import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MESSAGES = [
	{
		text: 'Life is too short for mushy membrane keyboards. You deserve better.',
		category: 'wisdom'
	},
	{
		text: "Your keyboard sounds like rain on a tin roof. Is that... good? It's good.",
		category: 'affirmation'
	},
	{
		text: 'The clicky switch you bought at midnight was an act of self-care.',
		category: 'affirmation'
	},
	{
		text: "Somewhere, a rubber dome is crying. That's on you. No regrets.",
		category: 'humor'
	},
	{
		text: 'Fun fact: 87% of productivity gains can be attributed to a satisfying bottom-out.',
		category: 'humor'
	},
	{
		text: 'You cannot buy happiness, but you can buy switches. Roughly the same thing.',
		category: 'wisdom'
	},
	{ text: "Today is a great day to lube your stabilizers. You won't regret it.", category: 'tip' },
	{
		text: "A 65% keyboard means 65% less keyboard to clean. That's called efficiency.",
		category: 'wisdom'
	},
	{
		text: "Your coworkers say your keyboard is 'distracting'. Your coworkers are jealous.",
		category: 'humor'
	},
	{
		text: 'Hot take: the best keycap colorway is whichever one you currently cannot afford.',
		category: 'humor'
	},
	{
		text: 'Every group buy you missed has made you stronger. Probably.',
		category: 'affirmation'
	},
	{
		text: 'A well-built keyboard outlasts trends, jobs, and possibly relationships. Choose wisely.',
		category: 'wisdom'
	},
	{
		text: "Gasket mount wasn't a buzzword. It was a prophecy.",
		category: 'wisdom'
	},
	{
		text: 'The sound of linears: smooth. The sound of tactiles: satisfying. The sound of clickies: controversial.',
		category: 'humor'
	},
	{
		text: "You didn't buy a $300 keyboard. You invested in your fingers' future.",
		category: 'affirmation'
	},
	{
		text: 'Desk mats: because your keyboard deserves a better landing pad than your dignity.',
		category: 'humor'
	},
	{
		text: 'Clack responsibly. Your open-plan office depends on it.',
		category: 'tip'
	},
	{
		text: "There is no such thing as 'too many keyboards'. That's a myth spread by Big Membrane.",
		category: 'wisdom'
	},
	{
		text: "The right switch is a personal journey. The wrong switch is someone else's endgame.",
		category: 'wisdom'
	},
	{
		text: "Legends never fade — unless you're using shine-through PBT. Then they might.",
		category: 'humor'
	},
	{
		text: 'GMK lead times build character. Lots of character. So much character.',
		category: 'affirmation'
	},
	{
		text: 'Pro tip: the loudest keyboard in the room is always the best keyboard in the room.',
		category: 'tip'
	},
	{
		text: "You're not addicted to keyboards. You're just very enthusiastic about typing accuracy.",
		category: 'affirmation'
	},
	{
		text: 'South-facing RGB is an aesthetic choice. North-facing RGB is a lifestyle.',
		category: 'wisdom'
	},
	{
		text: "If your keyboard doesn't spark joy, it's time to Marie Kondo your switch collection.",
		category: 'tip'
	}
];

export const GET: RequestHandler = async () => {
	const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

	return json({
		timestamp: new Date().toISOString(),
		message: message.text,
		category: message.category
	});
};
