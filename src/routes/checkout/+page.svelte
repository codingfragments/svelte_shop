<script lang="ts">
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart.js';
	import { checkout } from '$lib/stores/checkout.js';
	import CheckoutStep1 from '$lib/components/checkout/CheckoutStep1.svelte';
	import CheckoutStep2 from '$lib/components/checkout/CheckoutStep2.svelte';
	import CheckoutStep3 from '$lib/components/checkout/CheckoutStep3.svelte';

	// Redirect if cart is empty
	if ($cart.items.length === 0) {
		goto('/cart');
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	const steps = [
		{ number: 1, title: 'Shipping Info', description: 'Enter your address details' },
		{ number: 2, title: 'Review Order', description: 'Confirm your items and shipping' },
		{ number: 3, title: 'Payment', description: 'Enter payment information' }
	];
</script>

<svelte:head>
	<title>Checkout - KeyCraft</title>
	<meta name="description" content="Complete your mechanical keyboard purchase with secure checkout." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-text-primary mb-2">Checkout</h1>
			<p class="text-text-muted">Complete your order in a few simple steps</p>
		</div>

		<!-- Progress Steps -->
		<div class="mb-12">
			<div class="flex items-center justify-between relative">
				<!-- Progress Line -->
				<div class="absolute top-4 left-0 right-0 h-0.5 bg-overlay0">
					<div 
						class="h-full bg-primary transition-all duration-500"
						style="width: {(($checkout.currentStep - 1) / (steps.length - 1)) * 100}%"
					></div>
				</div>

				{#each steps as step}
					<div class="relative bg-bg-primary">
						<div 
							class="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300"
							class:border-primary={$checkout.currentStep >= step.number}
							class:bg-primary={$checkout.currentStep >= step.number}
							class:text-base={$checkout.currentStep >= step.number}
							class:border-overlay0={$checkout.currentStep < step.number}
							class:text-text-muted={$checkout.currentStep < step.number}
						>
							{#if $checkout.currentStep > step.number}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							{:else}
								{step.number}
							{/if}
						</div>
						<div class="absolute top-10 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
							<div 
								class="font-medium text-sm mb-1"
								class:text-primary={$checkout.currentStep >= step.number}
								class:text-text-muted={$checkout.currentStep < step.number}
							>
								{step.title}
							</div>
							<div class="text-xs text-text-muted max-w-24 leading-tight">
								{step.description}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Step Content -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Main Content -->
			<div class="lg:col-span-2">
				<div class="bg-bg-card border border-overlay0 rounded-2xl p-8">
					{#if $checkout.currentStep === 1}
						<CheckoutStep1 />
					{:else if $checkout.currentStep === 2}
						<CheckoutStep2 />
					{:else if $checkout.currentStep === 3}
						<CheckoutStep3 />
					{/if}
				</div>
			</div>

			<!-- Order Summary Sidebar -->
			<div class="lg:col-span-1">
				<div class="bg-bg-elevated border border-overlay0 rounded-2xl p-6 sticky top-8">
					<h3 class="text-lg font-bold text-text-primary mb-6">Order Summary</h3>
					
					<!-- Items -->
					<div class="space-y-4 mb-6">
						{#each $cart.items as item}
							<div class="flex items-center space-x-3">
								<div class="w-12 h-12 bg-bg-card border border-overlay0 rounded-lg overflow-hidden flex-shrink-0">
									{#if item.image_path}
										<img
											src={item.image_path}
											alt={item.name}
											class="w-full h-full object-cover"
										/>
									{:else}
										<div class="w-full h-full flex items-center justify-center text-text-muted">
											📦
										</div>
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<div class="font-medium text-text-primary text-sm truncate">{item.name}</div>
									<div class="text-xs text-text-muted">Qty: {item.quantity}</div>
								</div>
								<div class="text-sm font-semibold text-text-primary">
									{formatPrice(item.price * item.quantity)}
								</div>
							</div>
						{/each}
					</div>

					<!-- Totals -->
					<div class="space-y-3 pt-4 border-t border-overlay0">
						<div class="flex justify-between text-text-secondary">
							<span>Subtotal</span>
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
						<div class="border-t border-overlay0 pt-3">
							<div class="flex justify-between text-lg font-bold text-text-primary">
								<span>Total</span>
								<span>{formatPrice($cart.total * 1.08)}</span>
							</div>
						</div>
					</div>

					<!-- Security Badge -->
					<div class="mt-6 pt-6 border-t border-overlay0">
						<div class="flex items-center space-x-2 text-text-muted text-sm">
							<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
							</svg>
							<span>Secure 256-bit SSL encryption</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1400px;
	}
</style>