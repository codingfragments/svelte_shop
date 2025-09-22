<script lang="ts">
	import { checkout } from '$lib/stores/checkout.js';

	let form = {
		firstName: $checkout.shippingAddress.firstName || '',
		lastName: $checkout.shippingAddress.lastName || '',
		email: $checkout.shippingAddress.email || '',
		phone: $checkout.shippingAddress.phone || '',
		address1: $checkout.shippingAddress.address1 || '',
		address2: $checkout.shippingAddress.address2 || '',
		city: $checkout.shippingAddress.city || '',
		state: $checkout.shippingAddress.state || '',
		zipCode: $checkout.shippingAddress.zipCode || '',
		country: $checkout.shippingAddress.country || 'US'
	};

	let errors: Record<string, string> = {};

	function validateForm(): boolean {
		errors = {};

		if (!form.firstName.trim()) errors.firstName = 'First name is required';
		if (!form.lastName.trim()) errors.lastName = 'Last name is required';
		if (!form.email.trim()) errors.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
		if (!form.phone.trim()) errors.phone = 'Phone number is required';
		if (!form.address1.trim()) errors.address1 = 'Address is required';
		if (!form.city.trim()) errors.city = 'City is required';
		if (!form.state.trim()) errors.state = 'State is required';
		if (!form.zipCode.trim()) errors.zipCode = 'ZIP code is required';

		return Object.keys(errors).length === 0;
	}

	function handleContinue() {
		if (validateForm()) {
			checkout.updateShippingAddress(form);
			checkout.setStep(2);
		}
	}

	// Update store on input changes
	$: {
		checkout.updateShippingAddress(form);
	}

	const states = [
		'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
		'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
		'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
		'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
		'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
	];
</script>

<div>
	<h2 class="text-2xl font-bold text-text-primary mb-6">Shipping Information</h2>
	<p class="text-text-muted mb-8">Please provide your shipping address details.</p>

	<form class="space-y-6">
		<!-- Contact Information -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-text-primary">Contact Information</h3>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-text-primary mb-2">
						First Name *
					</label>
					<input
						id="firstName"
						bind:value={form.firstName}
						type="text"
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.firstName}
					/>
					{#if errors.firstName}
						<p class="text-error text-xs mt-1">{errors.firstName}</p>
					{/if}
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-text-primary mb-2">
						Last Name *
					</label>
					<input
						id="lastName"
						bind:value={form.lastName}
						type="text"
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.lastName}
					/>
					{#if errors.lastName}
						<p class="text-error text-xs mt-1">{errors.lastName}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="email" class="block text-sm font-medium text-text-primary mb-2">
						Email Address *
					</label>
					<input
						id="email"
						bind:value={form.email}
						type="email"
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.email}
					/>
					{#if errors.email}
						<p class="text-error text-xs mt-1">{errors.email}</p>
					{/if}
				</div>

				<div>
					<label for="phone" class="block text-sm font-medium text-text-primary mb-2">
						Phone Number *
					</label>
					<input
						id="phone"
						bind:value={form.phone}
						type="tel"
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.phone}
					/>
					{#if errors.phone}
						<p class="text-error text-xs mt-1">{errors.phone}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Shipping Address -->
		<div class="space-y-4">
			<h3 class="text-lg font-semibold text-text-primary">Shipping Address</h3>
			
			<div>
				<label for="address1" class="block text-sm font-medium text-text-primary mb-2">
					Street Address *
				</label>
				<input
					id="address1"
					bind:value={form.address1}
					type="text"
					placeholder="123 Main Street"
					class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
					class:border-error={errors.address1}
				/>
				{#if errors.address1}
					<p class="text-error text-xs mt-1">{errors.address1}</p>
				{/if}
			</div>

			<div>
				<label for="address2" class="block text-sm font-medium text-text-primary mb-2">
					Apartment, Suite, etc. (Optional)
				</label>
				<input
					id="address2"
					bind:value={form.address2}
					type="text"
					placeholder="Unit 4B"
					class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label for="city" class="block text-sm font-medium text-text-primary mb-2">
						City *
					</label>
					<input
						id="city"
						bind:value={form.city}
						type="text"
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.city}
					/>
					{#if errors.city}
						<p class="text-error text-xs mt-1">{errors.city}</p>
					{/if}
				</div>

				<div>
					<label for="state" class="block text-sm font-medium text-text-primary mb-2">
						State *
					</label>
					<select
						id="state"
						bind:value={form.state}
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.state}
					>
						<option value="">Select State</option>
						{#each states as state}
							<option value={state}>{state}</option>
						{/each}
					</select>
					{#if errors.state}
						<p class="text-error text-xs mt-1">{errors.state}</p>
					{/if}
				</div>

				<div>
					<label for="zipCode" class="block text-sm font-medium text-text-primary mb-2">
						ZIP Code *
					</label>
					<input
						id="zipCode"
						bind:value={form.zipCode}
						type="text"
						class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						class:border-error={errors.zipCode}
					/>
					{#if errors.zipCode}
						<p class="text-error text-xs mt-1">{errors.zipCode}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Continue Button -->
		<div class="flex justify-end pt-6">
			<button
				type="button"
				onclick={handleContinue}
				class="px-8 py-3 bg-primary text-base rounded-2xl font-semibold border-4 border-primary"
			>
				Continue to Review
			</button>
		</div>
	</form>
</div>