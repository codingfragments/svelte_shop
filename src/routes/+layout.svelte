<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Chatbot from '$lib/components/Chatbot.svelte';
	// import posthog from 'posthog-js';
	// import { browser } from '$app/environment';
	let { children } = $props();

	// export const load = async () => {
	// 	console.log('TTT');
	// 	if (browser) {
	// 		posthog.init('phc_VlI1NVz75X7jNWjYCOLjbprR2TBkVa6UOsT6omlu5io', {
	// 			api_host: 'https://us.i.posthog.com',
	// 			defaults: '2025-05-24'
	// 		});
	// 		console.log('PostHog initialized');
	// 	}
	//
	// 	return;
	// };
</script>

<svelte:head>
	<script
		data-recording-token="2UOrzBuoMskqSoBiiMyMlkpqIlWmwhvbYHZ5s4VK"
		data-is-production-environment={import.meta.env.PROD}
		src="https://snippet.meticulous.ai/v1/meticulous.js"
	></script>

	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-bg-primary text-text-primary">
	<Header />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />

	<Chatbot />
</div>
