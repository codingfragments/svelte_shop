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
		// Placeholder for checkout functionality
		alert('Checkout functionality would be implemented here!');
	}
</script>

<svelte:head>
	<title>Shopping Cart - KeyCraft</title>
	<meta name="description" content="Review your mechanical keyboard selections and proceed to checkout." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-3xl font-bold text-text-primary">Shopping Cart</h1>
			{#if $cart.items.length > 0}
				<button
					onclick={clearCart}
					class="text-text-muted hover:text-error transition-colors text-sm"
				>
					Clear Cart
				</button>
			{/if}
		</div>

		{#if $cart.items.length === 0}
			<!-- Empty Cart -->
			<div class="text-center py-16">
				<div class="w-24 h-24 mx-auto mb-6 text-text-muted">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
							d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
				<p class="text-text-muted mb-8">Discover our amazing mechanical keyboards and accessories</p>
				<button
					onclick={continueShopping}
					class="px-8 py-3 bg-primary text-base rounded-2xl hover:bg-secondary transition-colors font-semibold"
				>
					Start Shopping
				</button>
			</div>
		{:else}
			<!-- Cart Items -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Items List -->
				<div class="lg:col-span-2 space-y-4">
					{#each $cart.items as item}
						<div class="bg-bg-card border border-overlay0 rounded-2xl p-6 hover:border-primary/30 transition-colors">
							<div class="flex items-center space-x-4">
								<!-- Product Image -->
								<div class="w-20 h-20 bg-bg-elevated border border-overlay0 rounded-xl overflow-hidden flex-shrink-0">
									{#if item.image_path}
										<img
											src={item.image_path}
											alt={item.name}
											class="w-full h-full object-cover"
										/>
									{:else}
										<div class="w-full h-full flex items-center justify-center text-text-muted">
											<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
											</svg>
										</div>
									{/if}
								</div>

								<!-- Product Info -->
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-text-primary mb-1 truncate">
										<a 
											href="/{item.category_slug}/{item.slug}" 
											class="hover:text-primary transition-colors"
										>
											{item.name}
										</a>
									</h3>
									<p class="text-sm text-text-muted capitalize">
										{item.category_slug?.replace('-', ' ')}
									</p>
									<div class="flex items-center space-x-4 mt-2">
										<span class="text-lg font-bold text-primary">
											{formatPrice(item.price)}
										</span>
										{#if !item.in_stock}
											<span class="text-sm text-error">Out of Stock</span>
										{:else if item.stock_quantity < 5}
											<span class="text-sm text-warning">Low Stock</span>
										{/if}
									</div>
								</div>

								<!-- Quantity Controls -->
								<div class="flex items-center space-x-3">
									<div class="flex items-center border border-overlay0 rounded-lg">
										<button
											disabled={item.quantity <= 1}
											onclick={() => updateQuantity(item.id, item.quantity - 1)}
											class="px-3 py-2 text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											−
										</button>
										<span class="px-3 py-2 text-text-primary min-w-[3rem] text-center">
											{item.quantity}
										</span>
										<button
											disabled={item.quantity >= item.stock_quantity || !item.in_stock}
											onclick={() => updateQuantity(item.id, item.quantity + 1)}
											class="px-3 py-2 text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											+
										</button>
									</div>
									
									<!-- Remove Button -->
									<button
										onclick={() => removeItem(item.id)}
										class="p-2 text-text-muted hover:text-error transition-colors"
										title="Remove from cart"
									>
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
										</svg>
									</button>
								</div>
							</div>

							<!-- Item Total -->
							<div class="flex justify-end mt-4 pt-4 border-t border-overlay0">
								<div class="text-right">
									<span class="text-sm text-text-muted">Subtotal: </span>
									<span class="text-lg font-semibold text-text-primary">
										{formatPrice(item.price * item.quantity)}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Cart Summary -->
				<div class="lg:col-span-1">
					<div class="bg-bg-elevated border border-overlay0 rounded-2xl p-6 sticky top-8">
						<h2 class="text-xl font-bold text-text-primary mb-6">Order Summary</h2>
						
						<!-- Summary Details -->
						<div class="space-y-4 mb-6">
							<div class="flex justify-between text-text-secondary">
								<span>Items ({$cart.itemCount})</span>
								<span>{formatPrice($cart.total)}</span>
							</div>
							<div class="flex justify-between text-text-secondary">
								<span>Shipping</span>
								<span class="text-success">Free</span>
							</div>
							<div class="flex justify-between text-text-secondary">
								<span>Tax</span>
								<span>{formatPrice($cart.total * 0.08)}</span>
							</div>
							<div class="border-t border-overlay0 pt-4">
								<div class="flex justify-between text-lg font-bold text-text-primary">
									<span>Total</span>
									<span>{formatPrice($cart.total * 1.08)}</span>
								</div>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="space-y-3">
							<button
								onclick={proceedToCheckout}
								class="w-full px-6 py-4 bg-primary text-base rounded-2xl hover:bg-secondary transition-colors font-semibold text-lg"
							>
								Proceed to Checkout
							</button>
							<button
								onclick={continueShopping}
								class="w-full px-6 py-3 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-base transition-colors font-medium"
							>
								Continue Shopping
							</button>
						</div>

						<!-- Security Badge -->
						<div class="mt-6 pt-6 border-t border-overlay0">
							<div class="flex items-center space-x-2 text-text-muted text-sm">
								<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
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