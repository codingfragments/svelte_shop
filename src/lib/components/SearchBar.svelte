<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let searchQuery = '';
	let searchResults: any[] = [];
	let isSearching = false;
	let showResults = false;
	let searchInput: HTMLInputElement;
	let searchTimeout: NodeJS.Timeout;

	async function performSearch(query: string) {
		if (!query || query.trim().length < 2) {
			searchResults = [];
			showResults = false;
			return;
		}

		isSearching = true;
		
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
			const data = await response.json();
			
			searchResults = data.results || [];
			showResults = true;
		} catch (error) {
			console.error('Search error:', error);
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	function handleInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			performSearch(searchQuery);
		}, 300);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchQuery.trim()) {
			event.preventDefault();
			goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			hideResults();
		} else if (event.key === 'Escape') {
			hideResults();
			searchInput.blur();
		}
	}

	function hideResults() {
		showResults = false;
	}

	function selectResult(product: any) {
		goto(`/${product.category_slug}/${product.slug}`);
		hideResults();
		searchQuery = '';
	}

	onMount(() => {
		// Global keyboard shortcut (Ctrl/Cmd + K)
		function handleGlobalKeydown(event: KeyboardEvent) {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault();
				searchInput.focus();
			}
		}

		document.addEventListener('keydown', handleGlobalKeydown);
		
		return () => {
			document.removeEventListener('keydown', handleGlobalKeydown);
			clearTimeout(searchTimeout);
		};
	});
</script>

<div class="relative w-full">
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<svg class="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
			</svg>
		</div>
		
		<input
			bind:this={searchInput}
			bind:value={searchQuery}
			oninput={handleInput}
			onkeydown={handleKeydown}
			onfocus={() => searchQuery && performSearch(searchQuery)}
			onblur={() => setTimeout(hideResults, 150)}
			type="text"
			placeholder="Search keyboards, switches, keycaps..."
			class="block w-full pl-10 pr-16 py-2 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
		/>
		
		<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
			{#if isSearching}
				<div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
			{:else}
				<kbd class="hidden sm:inline-flex items-center px-2 py-0.5 border border-overlay0 rounded text-xs text-text-muted bg-bg-hover">
					⌘K
				</kbd>
			{/if}
		</div>
	</div>

	<!-- Search Results Dropdown -->
	{#if showResults && (searchResults.length > 0 || searchQuery.length >= 2)}
		<div class="absolute top-full left-0 right-0 mt-2 bg-bg-elevated border border-overlay0 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
			{#if searchResults.length > 0}
				{#each searchResults as product}
					<button
						onclick={() => selectResult(product)}
						class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-bg-hover transition-colors text-left border-b border-overlay0 last:border-b-0"
					>
						{#if product.primary_picture}
							<img 
								src={product.primary_picture.image_path}
								alt={product.primary_picture.alt_text || product.name}
								class="w-10 h-10 object-cover rounded-lg bg-bg-card"
								loading="lazy"
							/>
						{:else}
							<div class="w-10 h-10 bg-bg-card rounded-lg flex items-center justify-center">
								<span class="text-text-muted">📦</span>
							</div>
						{/if}
						
						<div class="flex-1 min-w-0">
							<div class="font-medium text-text-primary truncate">{product.name}</div>
							<div class="text-sm text-text-muted flex items-center space-x-2">
								<span class="capitalize">{product.category_name}</span>
								<span>•</span>
								<span class="font-medium text-primary">${product.price}</span>
							</div>
						</div>
					</button>
				{/each}
				
				{#if searchQuery.trim().length >= 2}
					<div class="px-4 py-3 border-t border-overlay0">
						<button
							onclick={() => { goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`); hideResults(); }}
							class="text-primary hover:text-secondary transition-colors text-sm font-medium"
						>
							View all results for "{searchQuery}"
						</button>
					</div>
				{/if}
			{:else}
				<div class="px-4 py-6 text-center text-text-muted">
					<svg class="mx-auto h-12 w-12 text-overlay0 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					<p class="text-sm">No products found for "{searchQuery}"</p>
					<p class="text-xs mt-1">Try searching for keyboards, switches, or keycaps</p>
				</div>
			{/if}
		</div>
	{/if}
</div>