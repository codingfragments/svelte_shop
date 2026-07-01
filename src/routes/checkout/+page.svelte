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
	<meta
		name="description"
		content="Complete your mechanical keyboard purchase with secure checkout."
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-text-primary mb-2 text-3xl font-bold">Checkout</h1>
			<p class="text-text-muted">Complete your order in a few simple steps</p>
		</div>

		<!-- Progress Steps -->
		<div class="mb-12 pb-5">
			<div class="relative flex items-center justify-between">
				<!-- Progress Line -->
				<div class="bg-overlay0 absolute top-4 right-0 left-0 h-0.5">
					<div
						class="bg-primary h-full transition-all duration-500"
						style="width: {(($checkout.currentStep - 1) / (steps.length - 1)) * 100}%"
					></div>
				</div>

				{#each steps as step}
					<div class="bg-bg-primary relative">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300"
							class:border-primary={$checkout.currentStep >= step.number}
							class:bg-primary={$checkout.currentStep >= step.number}
							class:text-base={$checkout.currentStep >= step.number}
							class:border-overlay0={$checkout.currentStep < step.number}
							class:text-text-muted={$checkout.currentStep < step.number}
						>
							{#if $checkout.currentStep > step.number}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							{:else}
								{step.number}
							{/if}
						</div>
						<div
							class="absolute top-10 left-1/2 -translate-x-1/2 transform text-center whitespace-nowrap"
						>
							<div
								class="mb-1 text-sm font-medium"
								class:text-primary={$checkout.currentStep >= step.number}
								class:text-text-muted={$checkout.currentStep < step.number}
							>
								{step.title}
							</div>
							<div class="text-text-muted max-w-24 text-xs leading-tight">
								{step.description}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Step Content -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="lg:col-span-2">
				<div class="bg-bg-card border-overlay0 rounded-2xl border p-8">
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
				<div class="bg-bg-elevated border-overlay0 sticky top-8 rounded-2xl border p-6">
					<h3 class="text-text-primary mb-6 text-lg font-bold">Order Summary</h3>

					<!-- Items -->
					<div class="mb-6 space-y-4">
						{#each $cart.items as item}
							<div class="flex items-center space-x-3">
								<div
									class="bg-bg-card border-overlay0 h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border"
								>
									{#if item.image_path}
										<img src={item.image_path} alt={item.name} class="h-full w-full object-cover" />
									{:else}
										<div class="text-text-muted flex h-full w-full items-center justify-center">
											📦
										</div>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<div class="text-text-primary truncate text-sm font-medium">{item.name}</div>
									<div class="text-text-muted text-xs">Qty: {item.quantity}</div>
								</div>
								<div class="text-text-primary text-sm font-semibold">
									{formatPrice(item.price * item.quantity)}
								</div>
							</div>
						{/each}
					</div>

					<!-- Totals -->
					<div class="border-overlay0 space-y-3 border-t pt-4">
						<div class="text-text-secondary flex justify-between">
							<span>Subtotal</span>
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
						<div class="border-overlay0 border-t pt-3">
							<div class="text-text-primary flex justify-between text-lg font-bold">
								<span>Total</span>
								<span>{formatPrice($cart.total * 1.08)}</span>
							</div>
						</div>
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

