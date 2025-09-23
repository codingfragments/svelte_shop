<script lang="ts">
	import type { PageData } from './$types.js';

	interface FAQProduct {
		id: number;
		faq_id: number;
		product_id: number;
		sort_order: number;
		created_at: string;
		name: string;
		slug: string;
		price: number;
		category_slug: string;
	}

	interface FAQ {
		id: number;
		question: string;
		answer: string;
		category: string;
		sort_order: number;
		is_featured: boolean;
		created_at: string;
		updated_at: string;
		related_products: FAQProduct[];
	}

	let { data }: { data: PageData } = $props();

	let expandedItems = $state(new Set<string>());

	function toggleExpanded(itemId: string) {
		if (expandedItems.has(itemId)) {
			expandedItems.delete(itemId);
		} else {
			expandedItems.add(itemId);
		}
		// Force reactivity update
		expandedItems = new Set(expandedItems);
	}

	// Define category metadata
	const categoryMetadata: Record<string, { name: string; icon: string }> = {
		keyboards: { name: 'Keyboards', icon: '⌨️' },
		keycaps: { name: 'Keycaps', icon: '🔤' },
		switches: { name: 'Switches', icon: '🔧' },
		cables: { name: 'Cables', icon: '🔌' },
		accessories: { name: 'Accessories', icon: '🎯' },
		general: { name: 'General', icon: '❓' }
	};

	// Get category info with fallback
	function getCategoryInfo(categorySlug: string) {
		return (
			categoryMetadata[categorySlug] || {
				name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
				icon: '📝'
			}
		);
	}
</script>

<svelte:head>
	<title>FAQ - KeyCraft</title>
	<meta
		name="description"
		content="Frequently asked questions about mechanical keyboards, keycaps, switches and accessories. Get expert answers to help you choose the perfect keyboard setup."
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-text-primary">Frequently Asked Questions</h1>
			<p class="mx-auto max-w-2xl text-lg text-text-muted">
				Get answers to common questions about mechanical keyboards, switches, keycaps, and
				accessories. Click any question to expand and see recommended products.
			</p>
		</div>

		<!-- FAQ Categories -->
		<div class="space-y-8">
			{#each Object.entries(data.faqsByCategory) as [categorySlug, faqs]}
				{@const categoryInfo = getCategoryInfo(categorySlug)}
				<div class="overflow-hidden rounded-2xl border border-overlay0 bg-bg-elevated">
					<!-- Category Header -->
					<div class="border-b border-overlay0 bg-bg-secondary px-6 py-4">
						<div class="flex items-center space-x-3">
							<span class="text-2xl">{categoryInfo.icon}</span>
							<h2 class="text-xl font-semibold text-text-primary">{categoryInfo.name}</h2>
							<span class="text-sm text-text-muted">({faqs.length} questions)</span>
						</div>
					</div>

					<!-- FAQ Items -->
					<div class="divide-y divide-overlay0">
						{#each faqs as faq}
							<div class="p-6">
								<!-- Question -->
								<button
									onclick={() => toggleExpanded(faq.id.toString())}
									class="group flex w-full items-center justify-between text-left transition-colors hover:text-primary"
								>
									<h3 class="pr-4 text-lg font-medium text-text-primary group-hover:text-primary">
										{faq.question}
									</h3>
									<svg
										class="h-5 w-5 flex-shrink-0 text-text-muted transition-transform group-hover:text-primary"
										class:rotate-180={expandedItems.has(faq.id.toString())}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										></path>
									</svg>
								</button>

								<!-- Answer (Expandable) -->
								{#if expandedItems.has(faq.id.toString())}
									<div class="mt-4 space-y-4">
										<p class="leading-relaxed text-text-secondary">
											{faq.answer}
										</p>

										<!-- Related Products -->
										{#if faq.related_products && faq.related_products.length > 0}
											<div class="rounded-xl border border-overlay0 bg-bg-secondary p-4">
												<h4
													class="mb-3 text-sm font-medium tracking-wider text-text-muted uppercase"
												>
													{faq.related_products.length > 1
														? 'Recommended Products'
														: 'Recommended Product'}
												</h4>
												<div class="space-y-3">
													{#each faq.related_products as product}
														<div class="flex items-center space-x-4">
															<div
																class="flex h-16 w-16 items-center justify-center rounded-lg bg-bg-hover"
															>
																<span class="text-2xl">📦</span>
															</div>
															<div class="flex-1">
																<h5 class="font-medium text-text-primary">
																	{product.name}
																</h5>
																<p class="text-sm text-text-muted">
																	${product.price.toFixed(2)}
																</p>
															</div>
															<a
																href="/{product.category_slug}/{product.slug}"
																class="rounded-lg bg-primary px-4 py-2 font-medium text-crust transition-colors hover:bg-primary/90"
															>
																<span class="text-crust">View Product</span>
															</a>
														</div>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Contact Section -->
		<div class="mt-12 rounded-2xl border border-overlay0 bg-bg-elevated p-8 text-center">
			<h2 class="mb-4 text-2xl font-semibold text-text-primary">Still Have Questions?</h2>
			<p class="mb-6 text-text-muted">
				Can't find what you're looking for? Our keyboard experts are here to help.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="mailto:support@keycraft.com"
					class="rounded-lg bg-primary px-6 py-3 font-medium text-base transition-colors hover:bg-primary/90"
				>
					Email Support
				</a>
				<a
					href="/contact"
					class="rounded-lg border border-overlay0 bg-bg-secondary px-6 py-3 font-medium text-text-primary transition-colors hover:bg-bg-hover"
				>
					Contact Form
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
	}
</style>

