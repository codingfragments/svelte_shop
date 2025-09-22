<script lang="ts">
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart.js';
	import { checkout } from '$lib/stores/checkout.js';

	let form = {
		cardNumber: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
		cardholderName: '',
		sameAsBilling: true
	};

	let billingForm = {
		firstName: $checkout.shippingAddress.firstName || '',
		lastName: $checkout.shippingAddress.lastName || '',
		address1: $checkout.shippingAddress.address1 || '',
		address2: $checkout.shippingAddress.address2 || '',
		city: $checkout.shippingAddress.city || '',
		state: $checkout.shippingAddress.state || '',
		zipCode: $checkout.shippingAddress.zipCode || ''
	};

	let agreedToTerms = false;
	let isProcessing = false;
	let errors: Record<string, string> = {};

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
	const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

	function formatCardNumber(value: string): string {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{4})(?=\d)/g, '$1 ')
			.trim();
	}

	function handleCardNumberInput(event: Event) {
		const target = event.target as HTMLInputElement;
		form.cardNumber = formatCardNumber(target.value);
	}

	function validateForm(): boolean {
		errors = {};

		const cardNumber = form.cardNumber.replace(/\s/g, '');
		if (!cardNumber) errors.cardNumber = 'Card number is required';
		else if (cardNumber.length < 13 || cardNumber.length > 19)
			errors.cardNumber = 'Invalid card number';

		if (!form.expiryMonth) errors.expiryMonth = 'Expiry month is required';
		if (!form.expiryYear) errors.expiryYear = 'Expiry year is required';
		if (!form.cvv) errors.cvv = 'CVV is required';
		else if (form.cvv.length < 3 || form.cvv.length > 4) errors.cvv = 'Invalid CVV';
		if (!form.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
		if (!agreedToTerms) errors.terms = 'You must agree to the terms and conditions';

		if (!form.sameAsBilling) {
			if (!billingForm.firstName.trim()) errors.billingFirstName = 'First name is required';
			if (!billingForm.lastName.trim()) errors.billingLastName = 'Last name is required';
			if (!billingForm.address1.trim()) errors.billingAddress1 = 'Address is required';
			if (!billingForm.city.trim()) errors.billingCity = 'City is required';
			if (!billingForm.state.trim()) errors.billingState = 'State is required';
			if (!billingForm.zipCode.trim()) errors.billingZipCode = 'ZIP code is required';
		}

		return Object.keys(errors).length === 0;
	}

	async function handlePlaceOrder() {
		if (!validateForm()) return;

		isProcessing = true;

		try {
			// Save payment info (in real app, this would be securely processed)
			checkout.updatePaymentInfo({
				cardNumber: form.cardNumber.slice(-4), // Only store last 4 digits
				expiryMonth: form.expiryMonth,
				expiryYear: form.expiryYear,
				cardholderName: form.cardholderName
			});

			checkout.setAgreedToTerms(agreedToTerms);
			checkout.completeCheckout();

			// Simulate processing time
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate order ID and redirect to confirmation
			const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
			cart.clearCart();
			checkout.reset();

			goto(`/order-confirmation/${orderId}`);
		} catch (error) {
			console.error('Payment processing error:', error);
			// Handle payment error
		} finally {
			isProcessing = false;
		}
	}

	function handleBack() {
		checkout.setStep(2);
	}

	function getCardType(cardNumber: string): string {
		const number = cardNumber.replace(/\s/g, '');
		if (/^4/.test(number)) return 'visa';
		if (/^5[1-5]/.test(number)) return 'mastercard';
		if (/^3[47]/.test(number)) return 'amex';
		if (/^6/.test(number)) return 'discover';
		return 'card';
	}

	$: cardType = getCardType(form.cardNumber);
</script>

<div>
	<h2 class="text-text-primary mb-6 text-2xl font-bold">Payment Information</h2>
	<p class="text-text-muted mb-8">Enter your payment details to complete your order.</p>

	<form class="space-y-8">
		<!-- Payment Method -->
		<div class="space-y-6">
			<h3 class="text-text-primary text-lg font-semibold">Payment Method</h3>

			<!-- Card Number -->
			<div>
				<label for="cardNumber" class="text-text-primary mb-2 block text-sm font-medium">
					Card Number ( can be fake like 4242 4242 4242 4242 )*
				</label>
				<div class="relative">
					<input
						id="cardNumber"
						bind:value={form.cardNumber}
						oninput={handleCardNumberInput}
						type="text"
						maxlength="23"
						placeholder="1234 5678 9012 3456"
						class="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 pr-12 transition-colors focus:ring-2 focus:outline-none"
						class:border-error={errors.cardNumber}
					/>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3">
						{#if cardType === 'visa'}
							<span class="text-blue text-sm font-bold">VISA</span>
						{:else if cardType === 'mastercard'}
							<span class="text-red text-sm font-bold">MC</span>
						{:else if cardType === 'amex'}
							<span class="text-green text-sm font-bold">AMEX</span>
						{:else if cardType === 'discover'}
							<span class="text-orange text-sm font-bold">DISC</span>
						{:else}
							<svg
								class="text-text-muted h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								></path>
							</svg>
						{/if}
					</div>
				</div>
				{#if errors.cardNumber}
					<p class="text-error mt-1 text-xs">{errors.cardNumber}</p>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label for="expiryMonth" class="text-text-primary mb-2 block text-sm font-medium">
						Expiry Month *
					</label>
					<select
						id="expiryMonth"
						bind:value={form.expiryMonth}
						class="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
						class:border-error={errors.expiryMonth}
					>
						<option value="">Month</option>
						{#each months as month}
							<option value={month}>{month}</option>
						{/each}
					</select>
					{#if errors.expiryMonth}
						<p class="text-error mt-1 text-xs">{errors.expiryMonth}</p>
					{/if}
				</div>

				<div>
					<label for="expiryYear" class="text-text-primary mb-2 block text-sm font-medium">
						Expiry Year *
					</label>
					<select
						id="expiryYear"
						bind:value={form.expiryYear}
						class="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
						class:border-error={errors.expiryYear}
					>
						<option value="">Year</option>
						{#each years as year}
							<option value={year.toString()}>{year}</option>
						{/each}
					</select>
					{#if errors.expiryYear}
						<p class="text-error mt-1 text-xs">{errors.expiryYear}</p>
					{/if}
				</div>

				<div>
					<label for="cvv" class="text-text-primary mb-2 block text-sm font-medium"> CVV * </label>
					<input
						id="cvv"
						bind:value={form.cvv}
						type="text"
						maxlength="4"
						placeholder="123"
						class="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
						class:border-error={errors.cvv}
					/>
					{#if errors.cvv}
						<p class="text-error mt-1 text-xs">{errors.cvv}</p>
					{/if}
				</div>
			</div>

			<div>
				<label for="cardholderName" class="text-text-primary mb-2 block text-sm font-medium">
					Cardholder Name *
				</label>
				<input
					id="cardholderName"
					bind:value={form.cardholderName}
					type="text"
					placeholder="John Doe"
					class="bg-bg-elevated border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
					class:border-error={errors.cardholderName}
				/>
				{#if errors.cardholderName}
					<p class="text-error mt-1 text-xs">{errors.cardholderName}</p>
				{/if}
			</div>
		</div>

		<!-- Billing Address -->
		<div class="space-y-6">
			<h3 class="text-text-primary text-lg font-semibold">Billing Address</h3>

			<label class="flex items-center space-x-3">
				<input
					type="checkbox"
					bind:checked={form.sameAsBilling}
					class="border-overlay0 text-primary focus:ring-primary rounded focus:ring-offset-0"
				/>
				<span class="text-text-primary">Same as shipping address</span>
			</label>

			{#if !form.sameAsBilling}
				<div class="bg-bg-elevated border-overlay0 space-y-4 rounded-xl border p-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label class="text-text-primary mb-2 block text-sm font-medium">First Name *</label>
							<input
								bind:value={billingForm.firstName}
								type="text"
								class="bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
								class:border-error={errors.billingFirstName}
							/>
							{#if errors.billingFirstName}
								<p class="text-error mt-1 text-xs">{errors.billingFirstName}</p>
							{/if}
						</div>

						<div>
							<label class="text-text-primary mb-2 block text-sm font-medium">Last Name *</label>
							<input
								bind:value={billingForm.lastName}
								type="text"
								class="bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
								class:border-error={errors.billingLastName}
							/>
							{#if errors.billingLastName}
								<p class="text-error mt-1 text-xs">{errors.billingLastName}</p>
							{/if}
						</div>
					</div>

					<div>
						<label class="text-text-primary mb-2 block text-sm font-medium">Address *</label>
						<input
							bind:value={billingForm.address1}
							type="text"
							class="bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
							class:border-error={errors.billingAddress1}
						/>
						{#if errors.billingAddress1}
							<p class="text-error mt-1 text-xs">{errors.billingAddress1}</p>
						{/if}
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<label class="text-text-primary mb-2 block text-sm font-medium">City *</label>
							<input
								bind:value={billingForm.city}
								type="text"
								class="bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
								class:border-error={errors.billingCity}
							/>
							{#if errors.billingCity}
								<p class="text-error mt-1 text-xs">{errors.billingCity}</p>
							{/if}
						</div>

						<div>
							<label class="text-text-primary mb-2 block text-sm font-medium">State *</label>
							<input
								bind:value={billingForm.state}
								type="text"
								class="bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
								class:border-error={errors.billingState}
							/>
							{#if errors.billingState}
								<p class="text-error mt-1 text-xs">{errors.billingState}</p>
							{/if}
						</div>

						<div>
							<label class="text-text-primary mb-2 block text-sm font-medium">ZIP Code *</label>
							<input
								bind:value={billingForm.zipCode}
								type="text"
								class="bg-bg-primary border-overlay0 text-text-primary focus:ring-primary focus:border-primary w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
								class:border-error={errors.billingZipCode}
							/>
							{#if errors.billingZipCode}
								<p class="text-error mt-1 text-xs">{errors.billingZipCode}</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Terms and Conditions -->
		<div class="space-y-4">
			<label class="flex items-start space-x-3">
				<input
					type="checkbox"
					bind:checked={agreedToTerms}
					class="border-overlay0 text-primary focus:ring-primary mt-1 rounded focus:ring-offset-0"
					class:border-error={errors.terms}
				/>
				<div class="text-sm">
					<span class="text-text-primary">
						I agree to the
						<a href="/terms" class="text-primary hover:text-secondary underline"
							>Terms and Conditions</a
						>
						and
						<a href="/privacy" class="text-primary hover:text-secondary underline">Privacy Policy</a
						>
					</span>
				</div>
			</label>
			{#if errors.terms}
				<p class="text-error text-xs">{errors.terms}</p>
			{/if}
		</div>

		<!-- Security Notice -->
		<div class="bg-success/10 border-success/20 rounded-xl border p-4">
			<div class="flex items-center space-x-2">
				<svg class="text-success h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					></path>
				</svg>
				<span class="text-success font-medium">Your payment information is secure</span>
			</div>
			<p class="text-success mt-2 text-sm">
				We use industry-standard encryption to protect your payment details. Your card information
				is never stored on our servers.
			</p>
		</div>

		<!-- Navigation -->
		<div class="flex justify-between pt-6">
			<button
				type="button"
				onclick={handleBack}
				class="border-primary text-primary hover:bg-primary rounded-2xl border px-8 py-3 font-semibold transition-all duration-300 hover:text-base"
			>
				← Back to Review
			</button>
			<button
				type="button"
				onclick={handlePlaceOrder}
				disabled={isProcessing}
				class="bg-primary relative overflow-hidden rounded-2xl border-4 border-primary px-8 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isProcessing}
					<span class="flex items-center space-x-2">
						<svg class="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							></path>
						</svg>
						<span>Processing...</span>
					</span>
				{:else}
					Place Order
				{/if}
			</button>
		</div>
	</form>
</div>

