<script lang="ts">
	import { generateMockRating } from '$lib/utils/mockData.js';
	import { cart } from '$lib/stores/cart.js';
	import StarRating from './StarRating.svelte';

	interface Props {
		product: {
			id: number;
			name: string;
			slug: string;
			description?: string;
			price: number;
			category_id: number;
			category_name?: string;
			category_slug?: string;
			in_stock: boolean;
			stock_quantity: number;
			featured: boolean;
			pictures: Array<{
				id: number;
				image_path: string;
				alt_text?: string;
				is_primary: boolean;
			}>;
		};
		size?: 'sm' | 'md' | 'lg';
		showCategory?: boolean;
	}

	let { product, size = 'md', showCategory = true }: Props = $props();

	const mockRating = $derived(generateMockRating(product.id));
	const primaryImage = $derived(product.pictures.find((p) => p.is_primary) || product.pictures[0]);

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg'
	};

	let isAddingToCart = $state(false);

	const imageSizeClasses = {
		sm: 'h-48',
		md: 'h-56',
		lg: 'h-64'
	};

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
			return { text: `Only ${quantity} left`, color: 'text-warning' };
		}
		if (quantity < 20) {
			return { text: 'Low Stock', color: 'text-warning' };
		}
		return { text: 'In Stock', color: 'text-success' };
	}

	const stockStatus = $derived(getStockStatus(product.in_stock, product.stock_quantity));

	async function handleAddToCart(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		if (isAddingToCart) return;

		isAddingToCart = true;

		const cartItem = {
			id: product.id,
			name: product.name,
			slug: product.slug,
			category_slug: product.category_slug || '',
			price: product.price,
			image_path: primaryImage?.image_path,
			in_stock: product.in_stock,
			stock_quantity: product.stock_quantity
		};

		cart.addItem(cartItem, 1);

		// Show animation feedback for 800ms
		setTimeout(() => {
			isAddingToCart = false;
		}, 800);
	}
</script>

<div
	class="group bg-bg-card border-overlay0 hover:border-primary hover:shadow-primary/10 overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl {sizeClasses[
		size
	]}"
>
	<!-- Product Image -->
	<div class="relative {imageSizeClasses[size]} bg-bg-elevated overflow-hidden">
		<a href="/{product.category_slug}/{product.slug}" class="block h-full w-full">
			{#if primaryImage}
				<img
					src={primaryImage.image_path}
					alt={primaryImage.alt_text || product.name}
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
				/>
			{:else}
				<div class="text-text-muted flex h-full w-full items-center justify-center">
					<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						></path>
					</svg>
				</div>
			{/if}
		</a>

		<!-- Out of Stock Overlay -->
		{#if !product.in_stock}
			<div class="bg-base/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
				<div class="relative">
					<!-- Diagonal Strikethrough -->
					<svg
						class="text-error absolute inset-0 h-full w-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<line
							x1="0"
							y1="0"
							x2="100"
							y2="100"
							stroke="currentColor"
							stroke-width="8"
							opacity="0.9"
						/>
						<line
							x1="100"
							y1="0"
							x2="0"
							y2="100"
							stroke="currentColor"
							stroke-width="8"
							opacity="0.9"
						/>
					</svg>
					<!-- Out of Stock Badge -->
					<div
						class="bg-error rotate-12 transform rounded-2xl border-2 border-white px-6 py-3 text-lg font-bold text-white shadow-lg"
					>
						OUT OF STOCK
					</div>
				</div>
			</div>
		{/if}

		<!-- Badges -->
		<div class="absolute top-3 left-3 flex flex-col space-y-2">
			{#if product.featured}
				<span class="bg-primary rounded-lg px-2 py-1 text-base text-xs font-medium">
					Featured
				</span>
			{/if}
			{#if !product.in_stock}
				<span class="bg-error rounded-lg px-2 py-1 text-xs font-medium text-white"> Sold Out </span>
			{:else if product.stock_quantity < 5}
				<span class="bg-warning rounded-lg px-2 py-1 text-base text-xs font-medium">
					Low Stock
				</span>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div
			class="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
		>
			<button
				class="bg-bg-primary/80 border-overlay0 hover:bg-bg-secondary rounded-lg border p-2 backdrop-blur-sm transition-colors"
			>
				<svg
					class="text-text-primary h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					></path>
				</svg>
				<span class="sr-only">Add to Wishlist</span>
			</button>
			<button
				class="bg-bg-primary/80 border-overlay0 hover:bg-bg-secondary rounded-lg border p-2 backdrop-blur-sm transition-colors"
			>
				<svg
					class="text-text-primary h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					></path>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					></path>
				</svg>
				<span class="sr-only">Quick View</span>
			</button>
		</div>
	</div>

	<!-- Product Info -->
	<div class="space-y-3 p-4">
		<!-- Category & Name -->
		<div class="space-y-1">
			{#if showCategory && product.category_name}
				<p class="text-text-muted text-sm font-medium tracking-wide uppercase">
					{product.category_name}
				</p>
			{/if}
			<h3
				class="text-text-primary group-hover:text-primary line-clamp-2 font-semibold transition-colors"
			>
				<a href="/{product.category_slug}/{product.slug}" class="hover:underline">
					{product.name}
				</a>
			</h3>
		</div>

		<!-- Rating -->
		<div class="flex items-center justify-between">
			<StarRating rating={mockRating.rating} size="sm" />
			<span class="text-text-muted text-sm">({mockRating.count})</span>
		</div>

		<!-- Price & Stock -->
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<p class="text-primary text-xl font-bold">
					{formatPrice(product.price)}
				</p>
				<p class="text-sm {stockStatus.color}">
					{stockStatus.text}
				</p>
			</div>

			<!-- Add to Cart -->
			<button
				onclick={handleAddToCart}
				disabled={!product.in_stock || isAddingToCart}
				class="bg-primary hover:bg-secondary disabled:bg-overlay0 disabled:text-text-muted relative overflow-hidden rounded-lg border-2 border-transparent px-4 py-2 text-base text-sm font-medium text-red-600 transition-all duration-200 active:scale-95 hover:enabled:border-violet-800 hover:enabled:font-bold disabled:cursor-not-allowed"
				class:animate-pulse={isAddingToCart}
				class:bg-success={isAddingToCart}
				class:border-success={isAddingToCart}
			>
				{#if isAddingToCart}
					<!-- Success Animation -->
					<span class="flex items-center space-x-2">
						<svg
							class="h-4 w-4 animate-bounce"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
						<span>Added!</span>
					</span>
					<!-- Ripple effect -->
					<div class="absolute inset-0 animate-ping rounded-lg bg-white opacity-20"></div>
				{:else}
					{product.in_stock ? 'Add to Cart' : 'Sold Out'}
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
