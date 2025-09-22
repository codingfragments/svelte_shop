<script lang="ts">
	import { page } from '$app/stores';
	import { APP_CONFIG } from '$lib/config.js';
	import { cart } from '$lib/stores/cart.js';
	import SearchBar from './SearchBar.svelte';
	
	let isMenuOpen = false;
	let isCategoryOpen = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	function toggleCategory() {
		isCategoryOpen = !isCategoryOpen;
	}
	
	function closeMenus() {
		isMenuOpen = false;
		isCategoryOpen = false;
	}
</script>

<header class="bg-bg-primary border-b border-overlay0 sticky top-0 z-50 backdrop-blur-sm">
	<div class="container mx-auto px-4 py-4">
		<nav class="flex items-center justify-between">
			<!-- Logo & Brand -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-3 hover:text-primary transition-colors">
					<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
						<span class="text-base font-bold">⌨️</span>
					</div>
					<div class="hidden sm:block">
						<h1 class="text-xl font-bold text-primary">{APP_CONFIG.name}</h1>
						<p class="text-xs text-text-muted leading-none">Next Century Keyboards</p>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center space-x-8">
				<a 
					href="/" 
					class="text-text-primary hover:text-primary transition-colors font-medium"
					class:text-primary={$page.url.pathname === '/'}
				>
					Home
				</a>
				
				<a 
					href="/products" 
					class="text-text-primary hover:text-primary transition-colors font-medium"
					class:text-primary={$page.url.pathname === '/products'}
				>
					All Products
				</a>

				<!-- Categories Dropdown -->
				<div class="relative">
					<button
						onclick={toggleCategory}
						class="flex items-center space-x-1 text-text-primary hover:text-primary transition-colors font-medium"
						class:text-primary={$page.url.pathname.startsWith('/categories')}
					>
						<span>Categories</span>
						<svg 
							class="w-4 h-4 transition-transform"
							class:rotate-180={isCategoryOpen}
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>

					{#if isCategoryOpen}
						<div class="absolute top-full left-0 mt-2 w-64 bg-bg-elevated border border-overlay0 rounded-2xl shadow-xl py-2 z-50">
							{#each APP_CONFIG.categories as category}
								<a
									href="/{category.slug}"
									class="flex items-center space-x-3 px-4 py-3 hover:bg-bg-hover transition-colors"
									onclick={closeMenus}
								>
									<span class="text-lg">{category.icon}</span>
									<div>
										<div class="font-medium text-text-primary">{category.name}</div>
										<div class="text-sm text-text-muted">{category.description}</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Search Bar -->
			<div class="hidden md:flex flex-1 max-w-md mx-8">
				<SearchBar />
			</div>

			<!-- Actions -->
			<div class="flex items-center space-x-4">
				<!-- Cart -->
				<a 
					href="/cart" 
					class="relative p-2 text-text-primary hover:text-primary transition-colors"
					class:text-primary={$page.url.pathname === '/cart'}
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"></path>
					</svg>
					{#if $cart.itemCount > 0}
						<span class="absolute -top-1 -right-1 bg-primary text-base text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
							{$cart.itemCount > 99 ? '99+' : $cart.itemCount}
						</span>
					{/if}
					<span class="sr-only">Shopping Cart ({$cart.itemCount} items)</span>
				</a>

				<!-- User -->
				<button class="p-2 text-text-primary hover:text-primary transition-colors">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
					</svg>
				</button>

				<!-- Mobile Menu Toggle -->
				<button 
					onclick={toggleMenu}
					class="lg:hidden p-2 text-text-primary hover:text-primary transition-colors"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
			</div>
		</nav>

		<!-- Mobile Search -->
		<div class="md:hidden mt-4">
			<SearchBar />
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="lg:hidden bg-bg-secondary border-t border-overlay0">
			<div class="container mx-auto px-4 py-4 space-y-4">
				<a 
					href="/" 
					class="block py-2 text-text-primary hover:text-primary transition-colors font-medium"
					onclick={closeMenus}
				>
					Home
				</a>
				
				<a 
					href="/products" 
					class="block py-2 text-text-primary hover:text-primary transition-colors font-medium"
					onclick={closeMenus}
				>
					All Products
				</a>

				<div class="border-t border-overlay0 pt-4">
					<h3 class="text-text-muted text-sm font-medium uppercase tracking-wider mb-3">Categories</h3>
					{#each APP_CONFIG.categories as category}
						<a
							href="/{category.slug}"
							class="flex items-center space-x-3 py-3 hover:text-primary transition-colors"
							onclick={closeMenus}
						>
							<span class="text-lg">{category.icon}</span>
							<div>
								<div class="font-medium text-text-primary">{category.name}</div>
								<div class="text-sm text-text-muted">{category.description}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</header>

<style>
	.container {
		max-width: 1200px;
	}
</style>