<svelte:head>
	<title>Cart Operations | Next Century Keyboards Docs</title>
	<meta
		name="description"
		content="Manage the cart, bundles, alerts, and save-for-later workflows in detail."
	/>
</svelte:head>

<article class="space-y-12">
	<header
		class="rounded-3xl border border-overlay0 bg-bg-elevated/80 px-8 py-10 shadow-xl shadow-black/10 backdrop-blur"
	>
		<h1 class="text-3xl font-semibold text-text-primary">Cart Operations</h1>
		<p class="mt-4 leading-relaxed text-base text-text-muted">
			The cart is more than a simple list of items. It is a planning workspace that keeps subtotals
			current, reserves inventory, and surfaces finishing touches before you move into checkout.
			This guide explains every control so you can build confidently.
		</p>
	</header>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Access Points</h2>
		<ul class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Header icon:</span> Click the cart icon to open the
				slide-in drawer. It displays item thumbnails, options, quantity selectors, and the running subtotal.
			</li>
			<li>
				<span class="font-medium text-text-primary">Keyboard shortcut:</span> On desktop, press
				<kbd class="rounded border border-overlay0 bg-bg-elevated px-2 py-1 text-xs">Shift</kbd>
				+ <kbd class="rounded border border-overlay0 bg-bg-elevated px-2 py-1 text-xs">C</kbd> to toggle
				the drawer from anywhere.
			</li>
			<li>
				<span class="font-medium text-text-primary">Direct route:</span> Visit `/cart` for an expanded
				view that includes delivery estimates, promo code entry, and bundle summaries.
			</li>
		</ul>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/cart-drawer-overview.png"
				alt="Placeholder showing the cart drawer with bundle banner"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 capture of the cart drawer displaying subtotal, bundle prompt, and
				checkout controls.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Managing Line Items</h2>
		<div class="mt-5 grid gap-6 lg:grid-cols-2">
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Adjust quantities</h3>
				<p class="mt-3 text-sm leading-relaxed text-text-muted">
					Use the plus/minus controls beside each item. When you increase quantity for components
					with limited stock, the cart validates availability and alerts you if the change exceeds
					inventory.
				</p>
			</div>
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Switch variants</h3>
				<p class="mt-3 text-sm leading-relaxed text-text-muted">
					Some products (like keyboard kits) allow variant changes (colorway, layout) directly from
					the cart by opening the inline dropdown. Variants inherit the same price rules and update
					the thumbnail instantly.
				</p>
			</div>
		</div>
		<p class="mt-5 text-sm leading-relaxed text-text-muted">
			Removing items triggers a confirmation if the product unlocks a bundle discount. The drawer
			suggests moving the item to “Saved for later” instead so you can revisit it without losing
			context.
		</p>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Smart Bundling &amp; Recommendations</h2>
		<ul class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Automatic bundles:</span> When your cart contains
				all required components for a bundle (e.g., case + PCB + plate), a banner proposes the bundle
				price. Accepting the offer recalculates the subtotal and labels the group as a bundle set.
			</li>
			<li>
				<span class="font-medium text-text-primary">Accessory prompts:</span> Adds-on appear beneath
				each line item. Expect suggestions for stabilizers, switch lube kits, coiled cables, and desk
				mats tailored to your current selection.
			</li>
			<li>
				<span class="font-medium text-text-primary">Community favorites:</span> The cart displays a “People
				also bought” rail leveraging recent purchase data to guide your finishing touches.
			</li>
		</ul>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Alerts &amp; Safeguards</h2>
		<ul class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Low-stock warnings:</span> Tags appear in orange
				when the cart holds more than 80% of available inventory. Proceed to checkout promptly to reserve
				the quantity.
			</li>
			<li>
				<span class="font-medium text-text-primary">Preorder indicators:</span> Items shipping later
				are marked with estimated ship windows. The checkout guide explains how split shipments are handled.
			</li>
			<li>
				<span class="font-medium text-text-primary">Price updates:</span> If a product price changes
				while the drawer is open, the cart flashes a notification and requires confirmation before you
				proceed.
			</li>
			<li>
				<span class="font-medium text-text-primary">Promo validation:</span> Applying a promo code runs
				eligibility checks (minimum spend, product exclusions) and surfaces inline error messaging if
				the code is invalid.
			</li>
		</ul>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Save for Later &amp; Build Planning</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			Moving an item to “Saved for later” stores it alongside your account profile. Saved items
			retain configuration selections (switch weight, layout, finish), making it easy to re-add them
			later without reselecting variants.
		</p>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			The saved list syncs with the chatbot. Ask “Remind me what I saved last week” and the bot will
			provide a mini-report with direct links back to each item.
		</p>

	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">When Something Goes Wrong</h2>
		<div class="mt-6 grid gap-4 md:grid-cols-2">
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Inventory race conditions</h3>
				<p class="mt-3 text-sm leading-relaxed text-text-muted">
					If another shopper purchases the last unit while you are editing the cart, the item is
					flagged with “No longer available.” You can contact support from the inline link to
					request a restock alert or swap to a recommended alternative without leaving the cart.
				</p>
			</div>
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Bundle conflicts</h3>
				<p class="mt-3 text-sm leading-relaxed text-text-muted">
					Removing one piece of a bundle prompts you to either purchase remaining components at full
					price or replace the missing part. The cart suggests replacements that maintain the
					discount.
				</p>
			</div>
		</div>
	</section>
</article>
