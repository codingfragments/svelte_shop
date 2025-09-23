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
		return categoryMetadata[categorySlug] || { name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1), icon: '📝' };
	}
</script>

<svelte:head>
	<title>FAQ - KeyCraft</title>
	<meta name="description" content="Frequently asked questions about mechanical keyboards, keycaps, switches and accessories. Get expert answers to help you choose the perfect keyboard setup." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-text-primary mb-4">Frequently Asked Questions</h1>
			<p class="text-lg text-text-muted max-w-2xl mx-auto">
				Get answers to common questions about mechanical keyboards, switches, keycaps, and accessories. 
				Click any question to expand and see recommended products.
			</p>
		</div>

		<!-- FAQ Categories -->
		<div class="space-y-8">
			{#each Object.entries(data.faqsByCategory) as [categorySlug, faqs]}
				{@const categoryInfo = getCategoryInfo(categorySlug)}
				<div class="bg-bg-elevated rounded-2xl border border-overlay0 overflow-hidden">
					<!-- Category Header -->
					<div class="bg-bg-secondary px-6 py-4 border-b border-overlay0">
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
									class="w-full text-left flex items-center justify-between hover:text-primary transition-colors group"
								>
									<h3 class="text-lg font-medium text-text-primary pr-4 group-hover:text-primary">
										{faq.question}
									</h3>
									<svg 
										class="w-5 h-5 text-text-muted flex-shrink-0 transition-transform group-hover:text-primary"
										class:rotate-180={expandedItems.has(faq.id.toString())}
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
									</svg>
								</button>

								<!-- Answer (Expandable) -->
								{#if expandedItems.has(faq.id.toString())}
									<div class="mt-4 space-y-4">
										<p class="text-text-secondary leading-relaxed">
											{faq.answer}
										</p>

										<!-- Related Products -->
										{#if faq.related_products && faq.related_products.length > 0}
											<div class="bg-bg-secondary rounded-xl p-4 border border-overlay0">
												<h4 class="text-sm font-medium text-text-muted mb-3 uppercase tracking-wider">
													{faq.related_products.length > 1 ? 'Recommended Products' : 'Recommended Product'}
												</h4>
												<div class="space-y-3">
													{#each faq.related_products as product}
														<div class="flex items-center space-x-4">
															<div class="w-16 h-16 bg-bg-hover rounded-lg flex items-center justify-center">
																<span class="text-2xl">📦</span>
															</div>
															<div class="flex-1">
																<h5 class="font-medium text-text-primary">
																	{product.name}
																</h5>
																<p class="text-text-muted text-sm">
																	${product.price.toFixed(2)}
																</p>
															</div>
															<a 
																href="/{product.category_slug}/{product.slug}"
																class="bg-primary text-base px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
															>
																View Product
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
		<div class="mt-12 text-center bg-bg-elevated rounded-2xl border border-overlay0 p-8">
			<h2 class="text-2xl font-semibold text-text-primary mb-4">Still Have Questions?</h2>
			<p class="text-text-muted mb-6">
				Can't find what you're looking for? Our keyboard experts are here to help.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a 
					href="mailto:support@keycraft.com" 
					class="bg-primary text-base px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
				>
					Email Support
				</a>
				<a 
					href="/contact" 
					class="bg-bg-secondary text-text-primary px-6 py-3 rounded-lg hover:bg-bg-hover transition-colors font-medium border border-overlay0"
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