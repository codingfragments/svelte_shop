<script lang="ts">
	import { cart } from '$lib/stores/cart.js';
	import { checkout } from '$lib/stores/checkout.js';

	let shippingMethod = $checkout.shippingMethod || 'standard';
	let orderNotes = $checkout.orderNotes || '';

	const shippingOptions = [
		{
			id: 'standard',
			name: 'Standard Shipping',
			description: '5-7 business days',
			price: 0
		},
		{
			id: 'express',
			name: 'Express Shipping',
			description: '2-3 business days',
			price: 15.99
		},
		{
			id: 'overnight',
			name: 'Overnight Shipping',
			description: 'Next business day',
			price: 29.99
		}
	];

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	function handleBack() {
		checkout.setStep(1);
	}

	function handleContinue() {
		checkout.setShippingMethod(shippingMethod);
		checkout.setOrderNotes(orderNotes);
		checkout.setStep(3);
	}

	$: selectedShipping = shippingOptions.find((option) => option.id === shippingMethod);
	$: shippingCost = selectedShipping?.price || 0;
	$: orderTotal = ($cart.total + shippingCost) * 1.08;
</script>

<div>
	<h2 class="text-text-primary mb-6 text-2xl font-bold">Review Your Order</h2>
	<p class="text-text-muted mb-8">
		Please review your items and shipping details before proceeding to payment.
	</p>

	<!-- Order Items -->
	<div class="mb-8 space-y-6">
		<h3 class="text-text-primary text-lg font-semibold">Order Items</h3>
		<div class="bg-bg-elevated border-overlay0 rounded-xl border p-6">
			<div class="space-y-4">
				{#each $cart.items as item}
					<div
						class="border-overlay0 flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0"
					>
						<div
							class="bg-bg-card border-overlay0 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border"
						>
							{#if item.image_path}
								<img src={item.image_path} alt={item.name} class="h-full w-full object-cover" />
							{:else}
								<div class="text-text-muted flex h-full w-full items-center justify-center">📦</div>
							{/if}
						</div>
						<div class="flex-1">
							<h4 class="text-text-primary font-semibold">{item.name}</h4>
							<p class="text-text-muted text-sm capitalize">
								{item.category_slug?.replace('-', ' ')}
							</p>
							<div class="mt-1 flex items-center space-x-2">
								<span class="text-text-secondary text-sm">Qty: {item.quantity}</span>
								<span class="text-text-secondary text-sm">•</span>
								<span class="text-primary text-sm font-medium">{formatPrice(item.price)}</span>
							</div>
						</div>
						<div class="text-right">
							<div class="text-text-primary font-semibold">
								{formatPrice(item.price * item.quantity)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Shipping Address -->
	<div class="mb-8 space-y-6">
		<h3 class="text-text-primary text-lg font-semibold">Shipping Address</h3>
		<div class="bg-bg-elevated border-overlay0 rounded-xl border p-6">
			<div class="space-y-2">
				<p class="text-text-primary font-medium">
					{$checkout.shippingAddress.firstName}
					{$checkout.shippingAddress.lastName}
				</p>
				<p class="text-text-secondary">{$checkout.shippingAddress.address1}</p>
				{#if $checkout.shippingAddress.address2}
					<p class="text-text-secondary">{$checkout.shippingAddress.address2}</p>
				{/if}
				<p class="text-text-secondary">
					{$checkout.shippingAddress.city}, {$checkout.shippingAddress.state}
					{$checkout.shippingAddress.zipCode}
				</p>
				<div class="border-overlay0 mt-4 border-t pt-2">
					<p class="text-text-secondary text-sm">Contact: {$checkout.shippingAddress.email}</p>
					<p class="text-text-secondary text-sm">Phone: {$checkout.shippingAddress.phone}</p>
				</div>
			</div>
			<button
				onclick={handleBack}
				class="text-primary hover:text-secondary mt-4 text-sm font-medium transition-colors"
			>
				← Edit Address
			</button>
		</div>
	</div>

	<!-- Shipping Options -->
	<div class="mb-8 space-y-6">
		<h3 class="text-text-primary text-lg font-semibold">Shipping Method</h3>
		<div class="space-y-3">
			{#each shippingOptions as option}
				<label class="block">
					<input
						type="radio"
						name="shipping"
						value={option.id}
						bind:group={shippingMethod}
						class="sr-only"
					/>
					<div
						class="flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-all duration-200"
						class:border-violet-500={shippingMethod === option.id}
						class:bg-primary={shippingMethod === option.id && 'bg-opacity-5'}
						class:border-overlay0={shippingMethod !== option.id}
						class:hover:border-overlay1={shippingMethod !== option.id}
						style={shippingMethod === option.id ? 'background-color: rgb(138 173 244 / 0.05);' : ''}
					>
						<div class="flex items-center space-x-4">
							<div
								class="flex h-4 w-4 items-center justify-center rounded-full border-2"
								class:border-primary={shippingMethod === option.id}
								class:bg-violet-500={shippingMethod === option.id}
								class:border-overlay0={shippingMethod !== option.id}
							>
								{#if shippingMethod === option.id}
									<div class="bg-base h-2 w-2 rounded-full"></div>
								{/if}
							</div>
							<div>
								<div class="text-text-primary font-medium">{option.name}</div>
								<div class="text-text-muted text-sm">{option.description}</div>
							</div>
						</div>
						<div class="text-text-primary font-semibold">
							{option.price === 0 ? 'Free' : formatPrice(option.price)}
						</div>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<!-- Order Notes -->
	<div class="mb-8 space-y-4">
		<h3 class="text-text-primary text-lg font-semibold">Order Notes (Optional)</h3>
		<textarea
			bind:value={orderNotes}
			placeholder="Add any special instructions for your order..."
			rows="4"
			class="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full resize-none rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
		></textarea>
	</div>

	<!-- Order Summary -->
	<div class="bg-bg-elevated border-overlay0 mb-8 rounded-xl border p-6">
		<h3 class="text-text-primary mb-4 text-lg font-semibold">Order Summary</h3>
		<div class="space-y-3">
			<div class="text-text-secondary flex justify-between">
				<span>Subtotal ({$cart.itemCount} items)</span>
				<span>{formatPrice($cart.total)}</span>
			</div>
			<div class="text-text-secondary flex justify-between">
				<span>Shipping</span>
				<span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
			</div>
			<div class="text-text-secondary flex justify-between">
				<span>Tax</span>
				<span>{formatPrice(($cart.total + shippingCost) * 0.08)}</span>
			</div>
			<div class="border-overlay0 border-t pt-3">
				<div class="text-text-primary flex justify-between text-xl font-bold">
					<span>Total</span>
					<span>{formatPrice(orderTotal)}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Navigation -->
	<div class="flex justify-between pt-6">
		<button
			onclick={handleBack}
			class="border-primary text-primary hover:bg-primary rounded-2xl border px-8 py-3 font-semibold transition-all duration-300 hover:text-base"
		>
			← Back to Shipping
		</button>
		<button
			onclick={handleContinue}
			class="bg-primary border-primary rounded-2xl border-4 px-8 py-3 text-base font-semibold"
		>
			Continue to Payment
		</button>
	</div>
</div>

