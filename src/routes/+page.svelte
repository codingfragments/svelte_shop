<script lang="ts">
	import { onMount } from 'svelte';
	import { APP_CONFIG } from '$lib/config.js';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let featuredProducts: any[] = [];
	let categories: any[] = [];
	let loading = true;

	onMount(async () => {
		try {
			// Load featured products
			const productsResponse = await fetch('/api/products?featured=true&limit=6');
			const productsData = await productsResponse.json();
			featuredProducts = productsData.products || [];

			// Load categories with stats
			const categoriesResponse = await fetch('/api/categories?stats=true');
			const categoriesData = await categoriesResponse.json();
			categories = categoriesData.categories || [];
		} catch (error) {
			console.error('Failed to load homepage data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{APP_CONFIG.name} - Next Century Keyboard Shop</title>
	<meta name="description" content={APP_CONFIG.description} />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary py-24">
	<div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
	<div class="relative container mx-auto px-4">
		<div class="mx-auto max-w-4xl space-y-8 text-center">
			<!-- Hero Content -->
			<div class="space-y-6">
				<h1 class="text-5xl leading-tight font-bold text-text-primary md:text-6xl">
					Welcome to <span
						class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
						>{APP_CONFIG.name}</span
					>
				</h1>
				<p class="mx-auto max-w-3xl text-xl leading-relaxed text-text-secondary md:text-2xl">
					{APP_CONFIG.description}
				</p>
				<p class="mx-auto max-w-2xl text-lg text-text-muted">
					Discover premium mechanical keyboards, custom switches, artisan keycaps, and accessories
					crafted for enthusiasts who demand perfection.
				</p>
				<p class="mx-auto max-w-2xl text-lg font-bold text-warning">
					⚠️ This is only a demo shop - no real products are sold here.
				</p>
			</div>

			<!-- CTA Buttons -->
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<a
					href="/products"
					class="rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-crust shadow-lg transition-colors hover:bg-secondary hover:shadow-xl"
				>
					<span class="text-crust">Shop All Products</span>
				</a>
				<a
					href="#categories"
					class="rounded-2xl border border-primary px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-base"
				>
					Browse Categories
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Categories Section -->
<section id="categories" class="bg-bg-secondary py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 space-y-4 text-center">
			<h2 class="text-4xl font-bold text-text-primary">Shop by Category</h2>
			<p class="mx-auto max-w-2xl text-xl text-text-muted">
				Explore our curated collection of mechanical keyboard essentials
			</p>
		</div>

		{#if loading}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(6) as _}
					<div class="animate-pulse rounded-2xl border border-overlay0 bg-bg-card p-6">
						<div class="mb-4 h-16 w-16 rounded-2xl bg-overlay0"></div>
						<div class="mb-2 h-6 rounded bg-overlay0"></div>
						<div class="mb-4 h-4 w-3/4 rounded bg-overlay0"></div>
						<div class="h-4 w-1/2 rounded bg-overlay0"></div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each categories as category}
					<a
						href="/{category.slug}"
						class="group rounded-2xl border border-overlay0 bg-bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
					>
						<div class="flex items-start space-x-4">
							<div
								class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl transition-transform duration-300 group-hover:scale-110"
							>
								{category.icon}
							</div>
							<div class="min-w-0 flex-1">
								<h3
									class="mb-2 text-xl font-semibold text-text-primary transition-colors group-hover:text-primary"
								>
									{category.name}
								</h3>
								<p class="mb-3 line-clamp-2 text-sm text-text-muted">
									{category.description}
								</p>
								<div class="flex items-center justify-between text-sm">
									<span class="text-text-secondary">
										{category.product_count} products
									</span>
									<span
										class="text-primary transition-transform duration-200 group-hover:translate-x-1"
									>
										→
									</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Featured Products Section -->
<section class="bg-bg-primary py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 space-y-4 text-center">
			<h2 class="text-4xl font-bold text-text-primary">Featured Products</h2>
			<p class="mx-auto max-w-2xl text-xl text-text-muted">
				Hand-picked favorites from our community of keyboard enthusiasts
			</p>
		</div>

		{#if loading}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(6) as _}
					<div class="animate-pulse rounded-2xl border border-overlay0 bg-bg-card">
						<div class="h-56 rounded-t-2xl bg-overlay0"></div>
						<div class="space-y-3 p-4">
							<div class="h-4 w-1/3 rounded bg-overlay0"></div>
							<div class="h-5 rounded bg-overlay0"></div>
							<div class="flex space-x-1">
								{#each Array(5) as _}
									<div class="h-4 w-4 rounded bg-overlay0"></div>
								{/each}
							</div>
							<div class="flex items-center justify-between">
								<div class="h-6 w-20 rounded bg-overlay0"></div>
								<div class="h-8 w-24 rounded bg-overlay0"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if featuredProducts.length > 0}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each featuredProducts as product}
					<ProductCard {product} />
				{/each}
			</div>

			<!-- View All Link -->
			<div class="mt-12 text-center">
				<a
					href="/products"
					class="inline-flex items-center space-x-2 rounded-2xl border border-primary px-8 py-4 text-lg font-semibold text-primary transition-colors hover:bg-primary hover:text-base"
				>
					<span>View All Products</span>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						></path>
					</svg>
				</a>
			</div>
		{:else}
			<div class="py-12 text-center">
				<p class="text-lg text-text-muted">No featured products available.</p>
			</div>
		{/if}
	</div>
</section>

<!-- Newsletter Section -->
<section class="border-t border-overlay0 bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl space-y-8 text-center">
			<div class="space-y-4">
				<h2 class="text-4xl font-bold text-text-primary">Stay in the Loop</h2>
				<p class="text-xl text-text-muted">
					Get notified about new products, group buys, and exclusive deals for keyboard enthusiasts
				</p>
			</div>

			<div class="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
				<input
					type="email"
					placeholder="Enter your email address"
					class="flex-1 rounded-lg border border-overlay0 bg-bg-elevated px-4 py-3 text-text-primary placeholder-text-muted transition-colors focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
				/>
				<button
					class="rounded-lg bg-primary px-6 py-3 font-medium whitespace-nowrap text-base transition-colors hover:bg-secondary"
				>
					Subscribe
				</button>
			</div>

			<p class="text-sm text-text-muted">
				Join 10,000+ keyboard enthusiasts. Unsubscribe at any time.
			</p>
		</div>
	</div>
</section>

<style>
	.container {
		max-width: 1200px;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
