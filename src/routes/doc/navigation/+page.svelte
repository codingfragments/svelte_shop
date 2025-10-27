<svelte:head>
	<title>Navigation Playbook | Next Century Keyboards Docs</title>
	<meta
		name="description"
		content="Learn all discovery paths across search, categories, FAQs, recommendations, and chatbot-driven guidance."
	/>
</svelte:head>

<article class="space-y-12">
	<header
		class="rounded-3xl border border-overlay0 bg-bg-elevated/80 px-8 py-10 shadow-xl shadow-black/10 backdrop-blur"
	>
		<h1 class="text-3xl font-semibold text-text-primary">Navigation Playbook</h1>
		<p class="mt-4 leading-relaxed text-base text-text-muted">
			The shop offers multiple discovery surfaces so you can move from inspiration to the exact
			component you need. Combine these tools—the global search bar, category hubs, FAQ-driven
			branching, recommendation rails, and the chatbot—to shorten the path to checkout.
		</p>
	</header>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">1. Global Search</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			The global search input lives in the header and accepts product names, switch families, layout
			keywords, and accessory types. Suggestions stream in as you type. Press <kbd
				class="rounded border border-overlay0 bg-bg-elevated px-2 py-1 text-xs">Enter</kbd
			> to view the full `/search` results page or use the arrow keys to open a highlighted suggestion
			immediately.
		</p>
		<ul class="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Smart synonyms:</span> Typing “silent linear” returns
				both switch models and pre-built boards tagged with silent linears.
			</li>
			<li>
				<span class="font-medium text-text-primary">Pinned quick filters:</span> After landing on `/search`,
				refine the grid with vendor, price, stock, and rating toggles. Changes apply instantly.
			</li>
			<li>
				<span class="font-medium text-text-primary">Keyboard shortcuts:</span> On desktop press
				<kbd class="rounded border border-overlay0 bg-bg-elevated px-2 py-1 text-xs">/</kbd> to focus
				search without leaving the page you are on.
			</li>
		</ul>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/navigation-global-search.png"
				alt="Placeholder showing the search results page with filters"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 screenshot of the global search results grid and quick filters.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">2. Category Hubs</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			Visit `/products` or any `/[category]` route to browse curated collections. Each hub groups
			filters by intent: layout, profile, acoustics, finish, backlighting, and more. When you toggle
			a filter, the product grid reflows without a page refresh, making it easy to narrow the
			selection.
		</p>
		<div class="mt-6 grid gap-4 lg:grid-cols-2">
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Keyboard Workflow</h3>
				<ol class="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
					<li>
						Choose a size (60%, 65%, TKL, full-size) to surface compatible plate and case options.
					</li>
					<li>
						Toggle “Hot-swappable” if you want to test multiple switch packs before soldering.
					</li>
					<li>
						Open a product to review technical specs, sound profiles, available finishes, and the
						“Pairs Well With” rail.
					</li>
				</ol>
			</div>
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Switch Workflow</h3>
				<ol class="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
					<li>Filter by actuation force or factory lube level to match your touch preference.</li>
					<li>
						Use the sound profile tags (tactile, linear, clicky, silent) to compare with in-stock
						switches.
					</li>
					<li>
						Read the FAQ callouts embedded on product pages for lube tips and break-in advice.
					</li>
				</ol>
			</div>
		</div>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/navigation-category-grid.png"
				alt="Placeholder showing category grid with filters"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 screenshot of the category hub filters and product tiles.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">3. FAQ-Driven Discovery</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			The `/faq` route is more than a static knowledge base. Each answer embeds contextual shortcuts
			that open relevant categories or pre-filtered search views. If you read “What switches pair
			with the Aurora65?”, click the embedded “View recommended switches” button to jump directly to
			those products.
		</p>
		<ul class="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Dynamic recommendations:</span> FAQ entries query
				the same recommendation service powering the product detail “Related Items” rail, ensuring up-to-date
				suggestions.
			</li>
			<li>
				<span class="font-medium text-text-primary">Troubleshooting breadcrumbs:</span> Complex answers
				include a mini journey (e.g., “1. Inspect stabilizers → 2. Order tune kit → 3. Watch tune tutorial”)
				with direct links.
			</li>
			<li>
				<span class="font-medium text-text-primary">Cross-launch with the chatbot:</span> Stuck between
				two FAQ answers? Ping the chatbot using the “Ask follow-up in chat” link present under each article.
			</li>
		</ul>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/navigation-faq-recommendations.png"
				alt="Placeholder showing FAQ answer with linked recommendations"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 capture of an FAQ article that links into recommended products.
			</figcaption>
		</figure>
	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">4. Recommendation Surfaces</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			Recommendation rails adapt based on browsing history and cart contents. Pay attention to the
			following surfaces when you want accelerated suggestions:
		</p>
		<ul class="mt-5 space-y-3 text-sm leading-relaxed text-text-muted">
			<li>
				<span class="font-medium text-text-primary">Home hero &amp; feature rows:</span> Highlight the
				newest collaborations, restocks, and bundles.
			</li>
			<li>
				<span class="font-medium text-text-primary">Product detail sidebars:</span> Surfaces compatible
				switches, keycaps, and tools tied to the item you are viewing.
			</li>
			<li>
				<span class="font-medium text-text-primary">Cart drawer recommendations:</span> When the cart
				contains a barebones kit, expect prompts to add stabilizers, lube, or matching cables before
				you check out.
			</li>
		</ul>

	</section>

	<section class="rounded-3xl border border-overlay0 bg-bg-tertiary/60 px-8 py-10">
		<h2 class="text-2xl font-semibold text-text-primary">5. Chatbot Collaboration</h2>
		<p class="mt-3 text-sm leading-relaxed text-text-muted">
			The floating chatbot is available across every route. Use it to accelerate decisions without
			leaving the page you are on.
		</p>
		<div class="mt-5 grid gap-4 md:grid-cols-2">
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Quick Prompts</h3>
				<ul class="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
					<li>“Suggest a silent tactile switch set under $1 per switch.”</li>
					<li>“Show me keycap sets compatible with the Vega 65 I just viewed.”</li>
					<li>“Remind me where to find the keyboard lube kit mentioned in the FAQ.”</li>
				</ul>
			</div>
			<div class="rounded-2xl border border-overlay0 bg-bg-elevated/80 p-6">
				<h3 class="text-lg font-semibold text-text-primary">Session Awareness</h3>
				<p class="mt-3 text-sm leading-relaxed text-text-muted">
					The bot references your current cart and recent product views. When you ask for a
					recommendation, it filters out incompatible plate or stem formats automatically so you
					only see relevant options.
				</p>
				<p class="mt-3 text-sm leading-relaxed text-text-muted">
					Export any chat reply as a checklist to keep on-screen while you continue browsing.
				</p>
			</div>
		</div>
		<figure
			class="mt-8 overflow-hidden rounded-3xl border border-dashed border-overlay1 bg-bg-elevated/60 p-4"
		>
			<img
				src="/images/docs/navigation-chatbot-session.png"
				alt="Placeholder showing chatbot recommendations"
				width="1280"
				height="720"
				class="h-auto w-full rounded-2xl"
			/>
			<figcaption class="mt-3 text-center text-xs tracking-wide text-text-muted uppercase">
				Replace with a 1280×720 capture of the chatbot session referencing current browsing context.
			</figcaption>
		</figure>
	</section>
</article>
