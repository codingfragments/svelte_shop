<script lang="ts">
	import { cart } from '$lib/stores/cart.js';
	import { goto } from '$app/navigation';

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	function updateQuantity(productId: number, newQuantity: number) {
		cart.updateQuantity(productId, newQuantity);
	}

	function removeItem(productId: number) {
		cart.removeItem(productId);
	}

	function clearCart() {
		cart.clearCart();
	}

	function continueShopping() {
		goto('/products');
	}

	function proceedToCheckout() {
		goto('/checkout');
	}
</script>

<svelte:head>
	<title>Shopping Cart - KeyCraft</title>
	<meta
		name="description"
		content="Review your mechanical keyboard selections and proceed to checkout."
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-text-primary text-3xl font-bold">Shopping Cart</h1>
			{#if $cart.items.length > 0}
				<button
					onclick={clearCart}
					class="text-text-muted hover:text-error text-sm transition-colors"
				>
					Clear Cart
				</button>
			{/if}
		</div>

		{#if $cart.items.length === 0}
			<!-- Empty Cart -->
			<div class="py-16 text-center">
				<div class="text-text-muted mx-auto mb-6 h-24 w-24">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"
						></path>
					</svg>
				</div>
				<h2 class="text-text-primary mb-2 text-2xl font-semibold">Your cart is empty</h2>
				<p class="text-text-muted mb-8">
					Discover our amazing mechanical keyboards and accessories
				</p>
				<button
					onclick={continueShopping}
					class="bg-primary hover:bg-secondary rounded-2xl px-8 py-3 text-base font-semibold transition-colors"
				>
					Start Shopping
				</button>
			</div>
		{:else}
			<!-- Cart Items -->
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Items List -->
				<div class="space-y-4 lg:col-span-2">
					{#each $cart.items as item}
						<div
							class="bg-bg-card border-overlay0 hover:border-primary/30 rounded-2xl border p-6 transition-colors"
						>
							<div class="flex items-center space-x-4">
								<!-- Product Image -->
								<div
									class="bg-bg-elevated border-overlay0 h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border"
								>
									{#if item.image_path}
										<img src={item.image_path} alt={item.name} class="h-full w-full object-cover" />
									{:else}
										<div class="text-text-muted flex h-full w-full items-center justify-center">
											<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
												></path>
											</svg>
										</div>
									{/if}
								</div>

								<!-- Product Info -->
								<div class="min-w-0 flex-1">
									<h3 class="text-text-primary mb-1 truncate font-semibold">
										<a
											href="/{item.category_slug}/{item.slug}"
											class="hover:text-primary transition-colors"
										>
											{item.name}
										</a>
									</h3>
									<p class="text-text-muted text-sm capitalize">
										{item.category_slug?.replace('-', ' ')}
									</p>
									<div class="mt-2 flex items-center space-x-4">
										<span class="text-primary text-lg font-bold">
											{formatPrice(item.price)}
										</span>
										{#if !item.in_stock}
											<span class="text-error text-sm">Out of Stock</span>
										{:else if item.stock_quantity < 5}
											<span class="text-warning text-sm">Low Stock</span>
										{/if}
									</div>
								</div>

								<!-- Quantity Controls -->
								<div class="flex items-center space-x-3">
									<div class="border-overlay0 flex items-center rounded-lg border">
										<button
											disabled={item.quantity <= 1}
											onclick={() => updateQuantity(item.id, item.quantity - 1)}
											class="text-text-primary hover:bg-bg-hover px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
										>
											−
										</button>
										<span class="text-text-primary min-w-[3rem] px-3 py-2 text-center">
											{item.quantity}
										</span>
										<button
											disabled={item.quantity >= item.stock_quantity || !item.in_stock}
											onclick={() => updateQuantity(item.id, item.quantity + 1)}
											class="text-text-primary hover:bg-bg-hover px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
										>
											+
										</button>
									</div>

									<!-- Remove Button -->
									<button
										onclick={() => removeItem(item.id)}
										class="text-text-muted hover:text-error p-2 transition-colors"
										title="Remove from cart"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											></path>
										</svg>
									</button>
								</div>
							</div>

							<!-- Item Total -->
							<div class="border-overlay0 mt-4 flex justify-end border-t pt-4">
								<div class="text-right">
									<span class="text-text-muted text-sm">Subtotal: </span>
									<span class="text-text-primary text-lg font-semibold">
										{formatPrice(item.price * item.quantity)}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Cart Summary -->
				<div class="lg:col-span-1">
					<div class="bg-bg-elevated border-overlay0 sticky top-8 rounded-2xl border p-6">
						<h2 class="text-text-primary mb-6 text-xl font-bold">Order Summary</h2>

						<!-- Summary Details -->
						<div class="mb-6 space-y-4">
							<div class="text-text-secondary flex justify-between">
								<span>Items ({$cart.itemCount})</span>
								<span>{formatPrice($cart.total)}</span>
							</div>
							<div class="text-text-secondary flex justify-between">
								<span>Shipping</span>
								<span class="text-success">Free</span>
							</div>
							<div class="text-text-secondary flex justify-between">
								<span>Tax</span>
								<span>{formatPrice($cart.total * 0.08)}</span>
							</div>
							<div class="border-overlay0 border-t pt-4">
								<div class="text-text-primary flex justify-between text-lg font-bold">
									<span>Total</span>
									<span>{formatPrice($cart.total * 1.08)}</span>
								</div>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="space-y-3">
							<button
								onclick={proceedToCheckout}
								class="bg-primary hover:bg-secondary hover:enabled:border-yellow border-primary w-full rounded-2xl border border-2 px-6 py-4 text-base text-lg font-semibold transition-all duration-300 hover:enabled:font-bold"
							>
								Proceed to Checkout
							</button>
							<button
								onclick={continueShopping}
								class="border-primary text-primary hover:bg-primary w-full rounded-2xl border px-6 py-3 font-medium transition-colors hover:text-base"
							>
								Continue Shopping
							</button>
						</div>

						<!-- Security Badge -->
						<div class="border-overlay0 mt-6 border-t pt-6">
							<div class="text-text-muted flex items-center space-x-2 text-sm">
								<svg
									class="text-success h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									></path>
								</svg>
								<span>Secure checkout guaranteed</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 1400px;
	}
</style>

