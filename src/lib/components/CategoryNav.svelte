<script lang="ts">
	import { page } from '$app/stores';
	import { APP_CONFIG } from '$lib/config.js';
	
	interface Props {
		currentCategory?: string;
	}
	
	let { currentCategory }: Props = $props();
	
	const isActive = $derived((categorySlug: string) => currentCategory === categorySlug);
</script>

{#if currentCategory}
	<nav class="bg-bg-secondary border-b border-overlay0 sticky top-16 z-40" aria-label="Category navigation">
		<div class="container mx-auto px-4 py-3">
			<div class="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
				<!-- All Products -->
				<a
					href="/products"
					class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
						{$page.url.pathname === '/products' 
							? 'bg-primary text-base' 
							: 'text-text-secondary hover:text-primary hover:bg-bg-elevated'}"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5v14h14m0 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"></path>
					</svg>
					<span class="font-medium">All Products</span>
				</a>
				
				<!-- Divider -->
				<div class="w-px h-6 bg-overlay0 mx-2"></div>
				
				<!-- Category Pills -->
				{#each APP_CONFIG.categories as category}
					<a
						href="/{category.slug}"
						class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
							{isActive(category.slug)
								? 'bg-primary text-base' 
								: 'text-text-secondary hover:text-primary hover:bg-bg-elevated'}"
					>
						<span class="text-sm">{category.icon}</span>
						<span class="font-medium">{category.name}</span>
					</a>
				{/each}
			</div>
		</div>
	</nav>
{/if}

<style>
	.container {
		max-width: 1200px;
	}
	
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>