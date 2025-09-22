<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let sortBy = $state(data.currentFilters.sort);
	let orderBy = $state(data.currentFilters.order);
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
		if (searchQuery) params.set('search', searchQuery);
		if (sortBy) params.set('sort', sortBy);
		if (orderBy) params.set('order', orderBy);
		
		const newUrl = `/${data.category.slug}${params.toString() ? '?' + params.toString() : ''}`;
		goto(newUrl);
	}

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const option = sortOptions[parseInt(target.value)];
		sortBy = option.value;
		orderBy = option.order;
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
		goto(`/${data.category.slug}?${params.toString()}`);
	}

	const totalPages = $derived(Math.ceil((data.pagination?.total || 0) / 12));
	const currentPage = $derived(data.currentFilters.page || 1);
</script>

<svelte:head>
	<title>{data.category.name} - KeyCraft</title>
	<meta name="description" content="{data.category.description} - Browse our premium selection of {data.category.name.toLowerCase()} for mechanical keyboard enthusiasts." />
</svelte:head>

<!-- Category Navigation -->
<CategoryNav currentCategory={data.category.slug} />

<div class="container mx-auto px-4 py-8">
	<!-- Category Header -->
	<div class="mb-8">
		<div class="flex items-center space-x-4 mb-4">
			<div class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-3xl">
				{data.category.icon}
			</div>
			<div>
				<h1 class="text-4xl font-bold text-text-primary">{data.category.name}</h1>
				<p class="text-lg text-text-muted mt-1">
					{data.category.product_count} {data.category.product_count === 1 ? 'product' : 'products'} available
				</p>
			</div>
		</div>
		<p class="text-xl text-text-secondary max-w-3xl">
			{data.category.description}
		</p>
	</div>

	<!-- Filters and Search -->
	<div class="bg-bg-secondary border border-overlay0 rounded-2xl p-6 mb-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Search -->
			<div class="lg:col-span-2">
				<label for="search" class="block text-sm font-medium text-text-primary mb-2">
					Search {data.category.name}
				</label>
				<input
					id="search"
					type="text"
					placeholder="Search in {data.category.name.toLowerCase()}..."
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
		</div>

		<!-- Results Count -->
		<div class="mt-4 pt-4 border-t border-overlay0">
			<div class="text-text-muted">
				<span class="text-sm">Showing</span>
				<span class="font-semibold text-text-primary">{data.category.products?.length || 0}</span>
				<span class="text-sm">of</span>
				<span class="font-semibold text-text-primary">{data.pagination?.total || 0}</span>
				<span class="text-sm">{data.category.name.toLowerCase()}</span>
			</div>
		</div>
	</div>

	<!-- Products Grid -->
	{#if data.category.products && data.category.products.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
			{#each data.category.products as product}
				<ProductCard {product} showCategory={false} />
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
			<h3 class="text-2xl font-semibold text-text-primary mb-2">No {data.category.name.toLowerCase()} found</h3>
			<p class="text-text-muted mb-6 max-w-md mx-auto">
				{#if searchQuery}
					No {data.category.name.toLowerCase()} match your search for "{searchQuery}". Try adjusting your search terms.
				{:else}
					No {data.category.name.toLowerCase()} available in this category at the moment.
				{/if}
			</p>
			{#if searchQuery}
				<button
					onclick={() => { searchQuery = ''; updateFilters(); }}
					class="px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
				>
					Clear Search
				</button>
			{:else}
				<a
					href="/products"
					class="inline-flex px-6 py-3 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium"
				>
					Browse All Products
				</a>
			{/if}
		</div>
	{/if}
</div>

<!-- Related Categories -->
{#if data.allCategories && data.allCategories.length > 1}
	<section class="bg-bg-secondary border-t border-overlay0 py-16">
		<div class="container mx-auto px-4">
			<h2 class="text-3xl font-bold text-text-primary mb-8 text-center">
				Explore Other Categories
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				{#each data.allCategories.filter(cat => cat.slug !== data.category.slug) as category}
					<a
						href="/{category.slug}"
						class="group bg-bg-card border border-overlay0 rounded-xl p-4 hover:border-primary transition-all duration-300 text-center"
					>
						<div class="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
							{category.icon}
						</div>
						<h3 class="font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">
							{category.name}
						</h3>
						<p class="text-sm text-text-muted">
							{category.product_count} products
						</p>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.container {
		max-width: 1400px;
	}
</style>