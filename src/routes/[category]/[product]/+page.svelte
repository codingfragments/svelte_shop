<script lang="ts">
	import { generateMockRating, generateMockReviews, generateMockSpecs, generateEnthusiastComment } from '$lib/utils/mockData.js';
	import { cart } from '$lib/stores/cart.js';
	import StarRating from '$lib/components/StarRating.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedImageIndex = $state(0);
	let quantity = $state(1);
	let activeTab = $state('details');
	let isAddingToCart = $state(false);

	const mockRating = $derived(generateMockRating(data.product.id));
	const mockReviews = $derived(generateMockReviews(data.product.id, data.category.slug, 5));
	const mockSpecs = $derived(generateMockSpecs(data.category.slug, data.product.name));
	const enthusiastComment = $derived(generateEnthusiastComment(data.product.id, data.category.slug, data.product.name));

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	function getStockStatus(inStock: boolean, quantity: number): { text: string; color: string } {
		if (!inStock) {
			return { text: 'Out of Stock', color: 'text-error' };
		}
		if (quantity < 5) {
			return { text: `Only ${quantity} left!`, color: 'text-warning' };
		}
		if (quantity < 20) {
			return { text: 'Low Stock', color: 'text-warning' };
		}
		return { text: 'In Stock', color: 'text-success' };
	}

	const stockStatus = $derived(getStockStatus(data.product.in_stock, data.product.stock_quantity));

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	async function handleAddToCart() {
		if (isAddingToCart) return;
		
		isAddingToCart = true;
		
		const cartItem = {
			id: data.product.id,
			name: data.product.name,
			slug: data.product.slug,
			category_slug: data.product.category_slug || '',
			price: data.product.price,
			image_path: data.product.pictures?.[0]?.image_path,
			in_stock: data.product.in_stock,
			stock_quantity: data.product.stock_quantity
		};
		
		cart.addItem(cartItem, quantity);
		
		// Show animation feedback for 1200ms (longer for detailed page)
		setTimeout(() => {
			isAddingToCart = false;
		}, 1200);
	}
</script>

<svelte:head>
	<title>{data.product.name} - {data.category.name} - KeyCraft</title>
	<meta name="description" content="{data.product.description} - Premium {data.category.name.toLowerCase()} for mechanical keyboard enthusiasts." />
</svelte:head>

<!-- Category Navigation -->
<CategoryNav currentCategory={data.category.slug} />

<div class="container mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="flex items-center space-x-2 text-sm text-text-muted mb-8">
		<a href="/" class="hover:text-primary transition-colors">Home</a>
		<span>→</span>
		<a href="/{data.category.slug}" class="hover:text-primary transition-colors capitalize">
			{data.category.name}
		</a>
		<span>→</span>
		<span class="text-text-primary">{data.product.name}</span>
	</nav>

	<!-- Product Details -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
		<!-- Product Images -->
		<div class="space-y-4">
			<!-- Main Image -->
			<div class="aspect-square bg-bg-elevated border border-overlay0 rounded-2xl overflow-hidden">
				{#if data.product.pictures && data.product.pictures.length > 0}
					<img
						src={data.product.pictures[selectedImageIndex]?.image_path}
						alt={data.product.pictures[selectedImageIndex]?.alt_text || data.product.name}
						class="w-full h-full object-cover"
					/>
				{:else}
					<div class="w-full h-full flex items-center justify-center text-text-muted">
						<svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
					</div>
				{/if}
			</div>

			<!-- Image Thumbnails -->
			{#if data.product.pictures && data.product.pictures.length > 1}
				<div class="grid grid-cols-4 gap-3">
					{#each data.product.pictures as picture, index}
						<button
							onclick={() => selectedImageIndex = index}
							class="aspect-square bg-bg-elevated border rounded-lg overflow-hidden hover:border-primary transition-colors"
							class:border-primary={selectedImageIndex === index}
							class:border-overlay0={selectedImageIndex !== index}
						>
							<img
								src={picture.image_path}
								alt={picture.alt_text || `${data.product.name} ${index + 1}`}
								class="w-full h-full object-cover"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product Info -->
		<div class="space-y-6">
			<div>
				<p class="text-text-muted text-sm uppercase tracking-wide font-medium mb-2">
					{data.category.name}
				</p>
				<h1 class="text-3xl font-bold text-text-primary mb-4">
					{data.product.name}
				</h1>
				
				<!-- Rating -->
				<div class="flex items-center space-x-4 mb-4">
					<StarRating rating={mockRating.rating} size="lg" />
					<span class="text-text-muted">
						({mockRating.count} reviews)
					</span>
				</div>

				<!-- Price -->
				<div class="mb-6">
					<span class="text-4xl font-bold text-primary">
						{formatPrice(data.product.price)}
					</span>
				</div>

				<!-- Stock Status -->
				<div class="mb-6">
					<span class="font-medium {stockStatus.color}">
						{stockStatus.text}
					</span>
					{#if data.product.sku}
						<span class="text-text-muted text-sm block mt-1">
							SKU: {data.product.sku}
						</span>
					{/if}
				</div>
			</div>

			<!-- Description -->
			{#if data.product.description}
				<div class="prose prose-invert max-w-none">
					<p class="text-text-secondary leading-relaxed">
						{data.product.description}
					</p>
				</div>
			{/if}

			<!-- Enthusiast Comment -->
			<div class="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
				<div class="flex items-start space-x-4">
					<div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
						🎯
					</div>
					<div class="flex-1">
						<h4 class="font-semibold text-primary mb-2 flex items-center space-x-2">
							<span>Enthusiast's Take</span>
							<span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Verified Review</span>
						</h4>
						<blockquote class="text-text-secondary italic leading-relaxed">
							"{enthusiastComment}"
						</blockquote>
						<div class="flex items-center space-x-2 mt-3 text-sm text-text-muted">
							<span>— KeyboardNinja47</span>
							<span>•</span>
							<span>Community Expert</span>
							<span>•</span>
							<StarRating rating={5} size="sm" showValue={false} />
						</div>
					</div>
				</div>
			</div>

			<!-- Quantity & Add to Cart -->
			<div class="border-t border-overlay0 pt-6">
				<div class="flex items-center space-x-4 mb-6">
					<label for="quantity" class="text-text-primary font-medium">Quantity:</label>
					<div class="flex items-center border border-overlay0 rounded-lg">
						<button
							disabled={quantity <= 1}
							onclick={() => quantity = Math.max(1, quantity - 1)}
							class="px-3 py-2 text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							−
						</button>
						<input
							id="quantity"
							type="number"
							bind:value={quantity}
							min="1"
							max={data.product.stock_quantity}
							class="w-16 px-2 py-2 text-center bg-transparent border-0 text-text-primary focus:outline-none"
						/>
						<button
							disabled={quantity >= data.product.stock_quantity}
							onclick={() => quantity = Math.min(data.product.stock_quantity, quantity + 1)}
							class="px-3 py-2 text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							+
						</button>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-4">
					<button
						onclick={handleAddToCart}
						disabled={!data.product.in_stock || isAddingToCart}
						class="relative flex-1 px-8 py-4 bg-primary text-base rounded-2xl hover:bg-secondary disabled:bg-overlay0 disabled:text-text-muted disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg border-2 border-transparent hover:enabled:border-yellow hover:enabled:font-bold active:scale-98 overflow-hidden"
						class:animate-pulse={isAddingToCart}
						class:bg-success={isAddingToCart}
						class:border-success={isAddingToCart}
						class:shadow-xl={isAddingToCart}
					>
						{#if isAddingToCart}
							<!-- Success Animation with Cart Icon -->
							<span class="flex items-center justify-center space-x-3">
								<svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"></path>
								</svg>
								<span>Added {quantity} to Cart!</span>
								<svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							</span>
							<!-- Enhanced Ripple Effect -->
							<div class="absolute inset-0 bg-white opacity-25 animate-ping rounded-2xl"></div>
							<div class="absolute inset-0 bg-success opacity-10 animate-pulse rounded-2xl"></div>
						{:else}
							{data.product.in_stock ? 'Add to Cart' : 'Out of Stock'}
						{/if}
					</button>
					<button class="px-6 py-4 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-base transition-colors font-semibold">
						♡ Wishlist
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Product Details Tabs -->
	<div class="bg-bg-secondary border border-overlay0 rounded-2xl overflow-hidden mb-16">
		<!-- Tab Headers -->
		<div class="border-b border-overlay0">
			<div class="flex">
				<button
					onclick={() => activeTab = 'details'}
					class="px-6 py-4 font-medium transition-colors border-b-2"
					class:border-primary={activeTab === 'details'}
					class:text-primary={activeTab === 'details'}
					class:border-transparent={activeTab !== 'details'}
					class:text-text-muted={activeTab !== 'details'}
				>
					Specifications
				</button>
				<button
					onclick={() => activeTab = 'reviews'}
					class="px-6 py-4 font-medium transition-colors border-b-2"
					class:border-primary={activeTab === 'reviews'}
					class:text-primary={activeTab === 'reviews'}
					class:border-transparent={activeTab !== 'reviews'}
					class:text-text-muted={activeTab !== 'reviews'}
				>
					Reviews ({mockRating.count})
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div class="p-8">
			{#if activeTab === 'details'}
				<!-- Specifications -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each Object.entries(mockSpecs) as [key, value]}
						<div class="flex justify-between py-3 border-b border-overlay0 last:border-b-0">
							<span class="font-medium text-text-primary">{key}:</span>
							<span class="text-text-secondary">{value}</span>
						</div>
					{/each}
				</div>
			{:else if activeTab === 'reviews'}
				<!-- Reviews -->
				<div class="space-y-8">
					<!-- Rating Summary -->
					<div class="bg-bg-elevated border border-overlay0 rounded-xl p-6">
						<div class="flex items-center justify-between mb-4">
							<div>
								<div class="flex items-center space-x-4 mb-2">
									<span class="text-3xl font-bold text-text-primary">
										{mockRating.rating.toFixed(1)}
									</span>
									<StarRating rating={mockRating.rating} size="lg" showValue={false} />
								</div>
								<p class="text-text-muted">Based on {mockRating.count} reviews</p>
							</div>
						</div>
						
						<!-- Rating Breakdown -->
						<div class="space-y-2">
							{#each [5, 4, 3, 2, 1] as stars}
								<div class="flex items-center space-x-3">
									<span class="text-sm text-text-muted w-8">{stars}★</span>
									<div class="flex-1 bg-overlay0 rounded-full h-2">
										<div
											class="bg-yellow h-2 rounded-full"
											style="width: {(mockRating.breakdown[stars] / mockRating.count) * 100}%"
										></div>
									</div>
									<span class="text-sm text-text-muted w-8">
										{mockRating.breakdown[stars]}
									</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Individual Reviews -->
					<div class="space-y-6">
						{#each mockReviews as review}
							<div class="border-b border-overlay0 pb-6 last:border-b-0">
								<div class="flex items-start space-x-4">
									<img
										src={review.avatar}
										alt={review.user}
										class="w-10 h-10 rounded-full"
									/>
									<div class="flex-1">
										<div class="flex items-center space-x-3 mb-2">
											<span class="font-medium text-text-primary">{review.user}</span>
											{#if review.verified}
												<span class="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
													Verified Purchase
												</span>
											{/if}
											<span class="text-sm text-text-muted">
												{formatDate(review.date)}
											</span>
										</div>
										<div class="flex items-center space-x-3 mb-3">
											<StarRating rating={review.rating} size="sm" showValue={false} />
											<h4 class="font-medium text-text-primary">{review.title}</h4>
										</div>
										<p class="text-text-secondary leading-relaxed mb-3">
											{review.content}
										</p>
										<button class="text-text-muted hover:text-primary text-sm transition-colors">
											Helpful ({review.helpful})
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Related Products -->
	{#if data.relatedProducts && data.relatedProducts.length > 0}
		<section>
			<h2 class="text-3xl font-bold text-text-primary mb-8">Related Products</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each data.relatedProducts as product}
					<ProductCard {product} size="sm" showCategory={false} />
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.container {
		max-width: 1400px;
	}
</style>