<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	{#if !import.meta.env.PROD}
		<script
			data-recording-token="4c0XuAryTtycpLIrOIgASje0d1LlMb355Qz6qwDo"
			data-is-production-environment="false"
			src="https://snippet.meticulous.ai/v1/meticulous.js"
		></script>
	{/if}
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="bg-bg-primary text-text-primary flex min-h-screen flex-col">
	<Header />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />
</div>
