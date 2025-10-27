<svelte:head>
	<title>Checkout Guide | Next Century Keyboards Docs</title>
	<meta
		name="description"
		content="Step-by-step walkthrough of checkout, including validations, failure scenarios, and shipment tracking."
	/>
</svelte:head>

<article class="space-y-12">
	<header
		class="rounded-3xl border border-overlay0 bg-bg-elevated/80 px-8 py-10 shadow-xl shadow-black/10 backdrop-blur"
	>
		<h1 class="text-3xl font-semibold text-text-primary">Checkout Guide</h1>
		<p class="mt-4 leading-relaxed text-base text-text-muted">
			Checkout translates your curated cart into a confirmed order. The flow is linear and
			transparent, but it includes guard rails that catch address issues, payment failures, and
			split-shipment nuances. Follow the sequence below, and reference the bailout tips whenever
			something unexpected happens.
		</p>
	</header>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Before You Begin</h2>
		<ul class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				Confirm the cart subtotal, taxes, and shipping estimate in `/cart`. Pay attention to
				preorder badges so you understand what will ship later.
			</li>
			<li>
				Log into your account to auto-fill shipping addresses, stored payment methods, and saved
				delivery preferences.
			</li>
			<li>
				If you plan to use a promo code or gift card, keep the code ready. Promo codes are validated
				in Step 3 and cannot be added after payment capture.
			</li>
		</ul>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Step 1 — Shipping Details</h2>
		<ol class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Address entry:</span> Provide full name, street,
				unit, city, postal code, and country. An address autocomplete dropdown appears after you type
				the first few characters.
			</li>
			<li>
				<span class="font-medium text-text-primary">Validation:</span> The platform checks the postal
				code and street combination. If the API detects a mismatch, you can accept the suggested correction
				or proceed with your original entry.
			</li>
			<li>
				<span class="font-medium text-text-primary">Contact details:</span> Email and optional phone
				number drive tracking notifications. Enable SMS if you want text alerts when the shipment leaves
				the warehouse.
			</li>
		</ol>
		<div class="mt-6 rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
			<h3 class="text-lg font-semibold text-text-primary">Common blockers &amp; bailouts</h3>
			<ul class="mt-3 space-y-3 text-sm leading-relaxed text-text-muted">
				<li>
					<span class="font-medium text-text-primary">Address not recognized:</span> Choose “Use entered
					address” to bypass, but expect a manual review by support. If you are shipping to a PO box,
					confirm that every cart item supports PO box delivery—heavy desk mats may not.
				</li>
				<li>
					<span class="font-medium text-text-primary">International duties:</span> Duty estimates appear
					in-line for cross-border orders. If the amount is higher than expected, move optional accessories
					to “Saved for later” and refresh the duty calculation before continuing.
				</li>
			</ul>
		</div>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/checkout-step-shipping.png"
				alt="Placeholder highlighting the shipping address step"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 screenshot of the checkout Step 1 shipping form and validation
				callouts.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Step 2 — Delivery Preferences</h2>
		<ol class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				Select from the available carrier options (Standard, Expedited, Express). Each option
				displays cost, estimated arrival window, and fulfillment status (Ready to ship vs.
				Preorder).
			</li>
			<li>
				For split carts (in-stock + preorder), the UI displays a toggle to “Ship available items
				now.” Selecting it shows two date ranges and cost adjustments. Declining keeps the order
				consolidated.
			</li>
			<li>
				Add delivery notes if your building requires special access. Notes are passed to the carrier
				label.
			</li>
		</ol>
		<div class="mt-6 rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
			<h3 class="text-lg font-semibold text-text-primary">If you cannot proceed</h3>
			<ul class="mt-3 space-y-3 text-sm leading-relaxed text-text-muted">
				<li>
					<span class="font-medium text-text-primary">Carrier unavailable:</span> Rarely, certain addresses
					cannot receive Express shipping. Switch to Standard or contact support via the inline link
					to request a manual quote.
				</li>
				<li>
					<span class="font-medium text-text-primary">Preorder timing conflicts:</span> If the preorder
					ETA is unacceptable, move that item to “Saved for later” and refresh the delivery step. The
					page recalculates without forcing you to restart checkout.
				</li>
			</ul>
		</div>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/checkout-step-delivery.png"
				alt="Placeholder showing delivery options"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 capture of the delivery options step including split shipment
				toggle.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Step 3 — Payment &amp; Promotions</h2>
		<ol class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				Choose your payment method: major credit cards, Shop Pay, Apple Pay/Google Pay, or PayPal.
				Digital wallets redirect to their respective modals and return you to the review screen
				after authorization.
			</li>
			<li>
				Enter promo codes or gift card numbers. The system validates eligibility instantly and
				displays the discount along with any remaining gift card balance.
			</li>
			<li>
				Store payment details by checking “Save for next time.” Saved methods live in your encrypted
				wallet and can be removed from the account settings page.
			</li>
		</ol>
		<div class="mt-6 rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
			<h3 class="text-lg font-semibold text-text-primary">Troubleshooting payments</h3>
			<ul class="mt-3 space-y-3 text-sm leading-relaxed text-text-muted">
				<li>
					<span class="font-medium text-text-primary">Card declined:</span> Hover over the error badge
					to read the processor response (insufficient funds, postal mismatch, suspected fraud). Update
					the address or try another card. The cart remains intact so you can retry without losing your
					selections.
				</li>
				<li>
					<span class="font-medium text-text-primary">Wallet timeout:</span> If an Apple Pay or PayPal
					modal is closed prematurely, the page shows a “Payment not captured” alert. Click “Retry authorization”
					to reopen the modal or switch to a manual card entry.
				</li>
				<li>
					<span class="font-medium text-text-primary">Promo conflict:</span> Some promos cannot stack
					with bundles. Remove the bundle or the promo and refresh the totals to see which option provides
					the better price.
				</li>
			</ul>
		</div>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/checkout-step-payment.png"
				alt="Placeholder showing payment and promo step"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 screenshot of the payment step with promo code entry and wallet
				options.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Step 4 — Review &amp; Confirmation</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			The final review screen presents a detailed summary: shipping method, address, payment
			reference, itemized list with taxes, discounts, and expected delivery windows. Read the
			preorder disclosure one more time if applicable.
		</p>
		<ul class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				Use the “Edit” links beside each section to jump backward without abandoning the session.
				Edits return you directly to the review screen afterward.
			</li>
			<li>
				Agree to terms and submit. A spinner indicates payment capture; do not refresh the page
				until confirmation appears.
			</li>
		</ul>
		<div class="mt-6 rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
			<h3 class="text-lg font-semibold text-text-primary">If submission stalls</h3>
			<p class="mt-3 text-sm leading-relaxed text-text-muted">
				In the rare case of a prolonged spinner (>30 seconds), open the chatbot and ask “Check order
				status for my pending checkout.” The bot queries the order service to determine whether
				payment succeeded. If it did, you receive a confirmation number without double-charging. If
				not, the bot prompts you to retry safely.
			</p>
		</div>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/checkout-step-review.png"
				alt="Placeholder showing the review and confirmation step"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 screenshot of the review step showing order summary and submit
				button.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">Step 5 — After Confirmation</h2>
		<ul class="mt-4 space-y-4 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Order confirmation page:</span> Displays your order
				number, item breakdown, fulfillment status, and shipment expectations. Use the “Add to calendar”
				button to remind yourself of preorder ship dates.
			</li>
			<li>
				<span class="font-medium text-text-primary">Track-order route:</span> Access `/track-order` from
				the confirmation screen or footer. Enter your email and order ID to monitor carrier scans, in-transit
				updates, and delivery confirmations.
			</li>
			<li>
				<span class="font-medium text-text-primary">Shipment tracker:</span> Once a label is created,
				the tracker shows carrier, tracking ID, and a progress bar from “Packed” through “Delivered.”
				Enable SMS or push notifications directly from the tracker panel.
			</li>
			<li>
				<span class="font-medium text-text-primary">Invoice &amp; receipts:</span> Download the invoice
				in PDF format. The system also emails you the receipt with tax breakdowns for expense reporting.
			</li>
		</ul>
		<p class="mt-4 text-sm leading-relaxed text-text-muted">
			Need to amend the order? Use the “Modify order” link within 60 minutes to change the shipping
			address or swap an item if it has not hit the packing queue. After that window, contact
			support via chat or email with your order number.
		</p>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/checkout-shipment-tracker.png"
				alt="Placeholder showing the shipment tracker timeline"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 capture of the post-purchase tracker with status timeline.
			</figcaption>
		</figure>
	</section>
</article>
