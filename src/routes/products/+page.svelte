<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let sortBy = $state(data.currentFilters.sort);
	let orderBy = $state(data.currentFilters.order);
	let selectedCategory = $state(data.currentFilters.category);
	let searchQuery = $state(data.currentFilters.search);

	const sortOptions = [
		{ value: 'created_at', label: 'Newest First', order: 'DESC' },
		{ value: 'created_at', label: 'Oldest First', order: 'ASC' },
		{ value: 'name', label: 'Name A-Z', order: 'ASC' },
		{ value: 'name', label: 'Name Z-A', order: 'DESC' },
		{ value: 'price', label: 'Price: Low to High', order: 'ASC' },
		{ value: 'price', label: 'Price: High to Low', order: 'DESC' }
	];

	function updateFilters() {
		const params = new URLSearchParams();
		if (selectedCategory) params.set('category', selectedCategory);
		if (searchQuery) params.set('search', searchQuery);
		if (sortBy) params.set('sort', sortBy);
		if (orderBy) params.set('order', orderBy);
		
		const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
		goto(newUrl);
	}

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const option = sortOptions[parseInt(target.value)];
		sortBy = option.value;
		orderBy = option.order;
		updateFilters();
	}

	function handleCategoryFilter(categorySlug: string) {
		selectedCategory = selectedCategory === categorySlug ? '' : categorySlug;
		updateFilters();
	}

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		
		// Debounce search
		setTimeout(() => {
			if (searchQuery === target.value) {
				updateFilters();
			}
		}, 500);
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`/products?${params.toString()}`);
	}

	const totalPages = $derived(Math.ceil((data.pagination?.total || 0) / 12));
	const currentPage = $derived(data.currentFilters.page || 1);
</script>

<svelte:head>
	<title>All Products - KeyCraft</title>
	<meta name="description" content="Browse our complete collection of premium mechanical keyboards, switches, keycaps, and accessories." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-text-primary mb-4">All Products</h1>
		<p class="text-xl text-text-muted max-w-3xl">
			Discover our complete collection of premium mechanical keyboards, custom switches, artisan keycaps, and accessories
		</p>
	</div>

	<!-- Filters and Search -->
	<div class="bg-bg-secondary border border-overlay0 rounded-2xl p-6 mb-8">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- Search -->
			<div class="lg:col-span-2">
				<label for="search" class="block text-sm font-medium text-text-primary mb-2">Search Products</label>
				<input
					id="search"
					type="text"
					placeholder="Search keyboards, switches, keycaps..."
					value={searchQuery}
					oninput={handleSearch}
					class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
				/>
			</div>

			<!-- Sort -->
			<div>
				<label for="sort" class="block text-sm font-medium text-text-primary mb-2">Sort By</label>
				<select
					id="sort"
					onchange={handleSortChange}
					class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
				>
					{#each sortOptions as option, index}
						<option value={index} selected={option.value === sortBy && option.order === orderBy}>
							{option.label}
						</option>
					{/each}
				</select>
			</div>

			<!-- Results Count -->
			<div class="flex items-end">
				<div class="text-text-muted">
					<span class="text-sm">Showing</span>
					<span class="font-semibold text-text-primary">{data.products.length}</span>
					<span class="text-sm">of</span>
					<span class="font-semibold text-text-primary">{data.pagination?.total || 0}</span>
					<span class="text-sm">products</span>
				</div>
			</div>
		</div>

		<!-- Category Filters -->
		<div class="mt-6 pt-6 border-t border-overlay0">
			<h3 class="text-sm font-medium text-text-primary mb-3">Filter by Category</h3>
			<div class="flex flex-wrap gap-2">
				<button
					onclick={() => handleCategoryFilter('')}
					class="px-4 py-2 rounded-lg border transition-colors text-sm font-medium"
					class:bg-primary={!selectedCategory}
					class:text-base={!selectedCategory}
					class:border-primary={!selectedCategory}
					class:bg-bg-elevated={selectedCategory}
					class:text-text-primary={selectedCategory}
					class:border-overlay0={selectedCategory}
					class:hover:border-primary={selectedCategory}
				>
					All Categories
				</button>
				
				{#each data.categories as category}
					<button
						onclick={() => handleCategoryFilter(category.slug)}
						class="px-4 py-2 rounded-lg border transition-colors text-sm font-medium flex items-center space-x-2"
						class:bg-primary={selectedCategory === category.slug}
						class:text-base={selectedCategory === category.slug}
						class:border-primary={selectedCategory === category.slug}
						class:bg-bg-elevated={selectedCategory !== category.slug}
						class:text-text-primary={selectedCategory !== category.slug}
						class:border-overlay0={selectedCategory !== category.slug}
						class:hover:border-primary={selectedCategory !== category.slug}
					>
						<span>{category.icon}</span>
						<span>{category.name}</span>
						<span class="text-xs opacity-75">({category.product_count})</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Products Grid -->
	{#if data.products.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
			{#each data.products as product}
				<ProductCard {product} showCategory={!selectedCategory} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-center space-x-2">
				<!-- Previous Button -->
				<button
					disabled={currentPage <= 1}
					onclick={() => goToPage(currentPage - 1)}
					class="px-4 py-2 border border-overlay0 rounded-lg text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Previous
				</button>

				<!-- Page Numbers -->
				{#each Array(Math.min(totalPages, 7)) as _, index}
					{@const pageNum = Math.max(1, Math.min(totalPages - 6, currentPage - 3)) + index}
					{#if pageNum <= totalPages}
						<button
							onclick={() => goToPage(pageNum)}
							class="w-10 h-10 border rounded-lg transition-colors"
							class:bg-primary={currentPage === pageNum}
							class:text-base={currentPage === pageNum}
							class:border-primary={currentPage === pageNum}
							class:border-overlay0={currentPage !== pageNum}
							class:text-text-primary={currentPage !== pageNum}
							class:hover:border-primary={currentPage !== pageNum}
						>
							{pageNum}
						</button>
					{/if}
				{/each}

				<!-- Next Button -->
				<button
					disabled={currentPage >= totalPages}
					onclick={() => goToPage(currentPage + 1)}
					class="px-4 py-2 border border-overlay0 rounded-lg text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Next
				</button>
			</div>
		{/if}
	{:else}
		<!-- Empty State -->
		<div class="text-center py-16">
			<div class="w-24 h-24 mx-auto mb-6 text-overlay0">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
			</div>
			<h3 class="text-2xl font-semibold text-text-primary mb-2">No products found</h3>
			<p class="text-text-muted mb-6 max-w-md mx-auto">
				{#if searchQuery}
					No products match your search for "{searchQuery}". Try adjusting your search terms.
				{:else if selectedCategory}
					No products found in this category. Try browsing other categories.
				{:else}
					No products available at the moment. Check back soon!
				{/if}
			</p>
			<button
				onclick={() => { selectedCategory = ''; searchQuery = ''; updateFilters(); }}
				class="px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
			>
				Clear Filters
			</button>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1400px;
	}
</style>