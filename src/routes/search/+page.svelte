<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let sortBy = $state(data.currentFilters.sort);
	let orderBy = $state(data.currentFilters.order);
	let selectedCategory = $state(data.currentFilters.category);
	let searchQuery = $state(data.currentFilters.query);

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
		if (searchQuery) params.set('q', searchQuery);
		if (selectedCategory) params.set('category', selectedCategory);
		if (sortBy) params.set('sort', sortBy);
		if (orderBy) params.set('order', orderBy);
		
		const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
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
		goto(`/search?${params.toString()}`);
	}

	const totalPages = $derived(Math.ceil((data.pagination?.total || 0) / 12));
	const currentPage = $derived(data.currentFilters.page || 1);
</script>

<svelte:head>
	<title>Search Results{data.query ? ` for "${data.query}"` : ''} - KeyCraft</title>
	<meta name="description" content="Search results for {data.query} - Find premium mechanical keyboards, switches, keycaps, and accessories." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8">
		{#if data.query}
			<h1 class="text-4xl font-bold text-text-primary mb-4">
				Search Results for "{data.query}"
			</h1>
			<p class="text-xl text-text-muted">
				{data.pagination?.total || 0} {(data.pagination?.total || 0) === 1 ? 'result' : 'results'} found
			</p>
		{:else}
			<h1 class="text-4xl font-bold text-text-primary mb-4">Search Products</h1>
			<p class="text-xl text-text-muted">Enter a search term to find products</p>
		{/if}
	</div>

	<!-- Search and Filters -->
	<div class="bg-bg-secondary border border-overlay0 rounded-2xl p-6 mb-8">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- Search Input -->
			<div class="lg:col-span-2">
				<label for="search" class="block text-sm font-medium text-text-primary mb-2">Search</label>
				<input
					id="search"
					type="text"
					placeholder="Search keyboards, switches, keycaps..."
					value={searchQuery}
					on:input={handleSearch}
					class="w-full px-4 py-3 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
				/>
			</div>

			<!-- Sort -->
			<div>
				<label for="sort" class="block text-sm font-medium text-text-primary mb-2">Sort By</label>
				<select
					id="sort"
					on:change={handleSortChange}
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
					<span class="font-semibold text-text-primary">{data.results.length}</span>
					<span class="text-sm">of</span>
					<span class="font-semibold text-text-primary">{data.pagination?.total || 0}</span>
					<span class="text-sm">results</span>
				</div>
			</div>
		</div>

		<!-- Category Filters -->
		{#if data.categories.length > 0}
			<div class="mt-6 pt-6 border-t border-overlay0">
				<h3 class="text-sm font-medium text-text-primary mb-3">Filter by Category</h3>
				<div class="flex flex-wrap gap-2">
					<button
						on:click={() => handleCategoryFilter('')}
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
							on:click={() => handleCategoryFilter(category.slug)}
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
		{/if}
	</div>

	<!-- Search Results -->
	{#if !data.query || data.query.length < 2}
		<!-- Search Prompt -->
		<div class="text-center py-16">
			<div class="w-24 h-24 mx-auto mb-6 text-overlay0">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
			</div>
			<h3 class="text-2xl font-semibold text-text-primary mb-2">Start Your Search</h3>
			<p class="text-text-muted mb-6 max-w-md mx-auto">
				Enter a search term above to find keyboards, switches, keycaps, and accessories
			</p>
		</div>
	{:else if data.results.length > 0}
		<!-- Results Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
			{#each data.results as product}
				<ProductCard {product} showCategory={!selectedCategory} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-center space-x-2">
				<!-- Previous Button -->
				<button
					disabled={currentPage <= 1}
					on:click={() => goToPage(currentPage - 1)}
					class="px-4 py-2 border border-overlay0 rounded-lg text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Previous
				</button>

				<!-- Page Numbers -->
				{#each Array(Math.min(totalPages, 7)) as _, index}
					{@const pageNum = Math.max(1, Math.min(totalPages - 6, currentPage - 3)) + index}
					{#if pageNum <= totalPages}
						<button
							on:click={() => goToPage(pageNum)}
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
					on:click={() => goToPage(currentPage + 1)}
					class="px-4 py-2 border border-overlay0 rounded-lg text-text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Next
				</button>
			</div>
		{/if}
	{:else}
		<!-- No Results -->
		<div class="text-center py-16">
			<div class="w-24 h-24 mx-auto mb-6 text-overlay0">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
			</div>
			<h3 class="text-2xl font-semibold text-text-primary mb-2">No results found</h3>
			<p class="text-text-muted mb-6 max-w-md mx-auto">
				No products match your search for "{data.query}". Try different keywords or browse our categories.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button
					on:click={() => { searchQuery = ''; selectedCategory = ''; updateFilters(); }}
					class="px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
				>
					Clear Search
				</button>
				<a
					href="/products"
					class="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-base transition-colors font-medium"
				>
					Browse All Products
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1400px;
	}
</style>