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

<header class="sticky top-0 z-50 border-b border-overlay0 bg-bg-primary backdrop-blur-sm">
	<div class="container mx-auto px-4 py-4">
		<nav class="flex items-center justify-between">
			<!-- Logo & Brand -->
			<div class="flex items-center space-x-4">
				<a href="/" class="flex items-center space-x-3 transition-colors hover:text-primary">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<span class="font-bold text-base">⌨️</span>
					</div>
					<div class="hidden sm:block">
						<h1 class="text-xl font-bold text-primary">{APP_CONFIG.name}</h1>
						<p class="text-xs leading-none text-text-muted">Next Century Keyboards</p>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center space-x-8 lg:flex">
				<a
					href="/"
					class="font-medium text-text-primary transition-colors hover:text-primary"
					class:text-base={$page.url.pathname === '/'}
				>
					Home
				</a>

				<a
					href="/products"
					class="font-medium text-primary transition-colors hover:text-primary"
					class:text-base={$page.url.pathname === '/products'}
				>
					All Products
				</a>

				<a
					href="/faq"
					class="font-medium text-text-primary transition-colors hover:text-primary"
					class:text-base={$page.url.pathname === '/faq'}
				>
					FAQ
				</a>

				<!-- Categories Dropdown -->
				<div class="relative">
					<button
						onclick={toggleCategory}
						class="flex items-center space-x-1 font-medium text-text-primary transition-colors hover:text-primary"
						class:text-base={$page.url.pathname.startsWith('/categories')}
					>
						<span>Categories</span>
						<svg
							class="h-4 w-4 transition-transform"
							class:rotate-180={isCategoryOpen}
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

					{#if isCategoryOpen}
						<div
							class="absolute top-full left-0 z-50 mt-2 w-64 rounded-2xl border border-overlay0 bg-bg-elevated py-2 shadow-xl"
						>
							{#each APP_CONFIG.categories as category}
								<a
									href="/{category.slug}"
									class="flex items-center space-x-3 px-4 py-3 transition-colors hover:bg-bg-hover"
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
			<div class="mx-8 hidden max-w-md flex-1 md:flex">
				<SearchBar />
			</div>

			<!-- Actions -->
			<div class="flex items-center space-x-4">
				<!-- Cart -->
				<a
					href="/cart"
					class="relative p-2 text-text-primary transition-colors hover:text-primary"
					class:text-base={$page.url.pathname === '/cart'}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8v6a2 2 0 002 2h10a2 2 0 002-2V9M7 13v6a2 2 0 002 2h10a2 2 0 002-2V9"
						></path>
					</svg>
					{#if $cart.itemCount > 0}
						<span
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-base"
						>
							{$cart.itemCount > 99 ? '99+' : $cart.itemCount}
						</span>
					{/if}
					<span class="sr-only">Shopping Cart ({$cart.itemCount} items)</span>
				</a>

				<!-- User -->
				<button class="p-2 text-text-primary transition-colors hover:text-primary">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						></path>
					</svg>
				</button>

				<!-- Mobile Menu Toggle -->
				<button
					onclick={toggleMenu}
					class="p-2 text-text-primary transition-colors hover:text-primary lg:hidden"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</button>
			</div>
		</nav>

		<!-- Mobile Search -->
		<div class="mt-4 md:hidden">
			<SearchBar />
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="border-t border-overlay0 bg-bg-secondary lg:hidden">
			<div class="container mx-auto space-y-4 px-4 py-4">
				<a
					href="/"
					class="block py-2 font-medium text-text-primary transition-colors hover:text-primary"
					onclick={closeMenus}
				>
					Home
				</a>

				<a
					href="/products"
					class="block py-2 font-medium text-text-primary transition-colors hover:text-primary"
					onclick={closeMenus}
				>
					All Products
				</a>

				<a
					href="/faq"
					class="block py-2 font-medium text-text-primary transition-colors hover:text-primary"
					onclick={closeMenus}
				>
					FAQ
				</a>

				<div class="border-t border-overlay0 pt-4">
					<h3 class="mb-3 text-sm font-medium tracking-wider text-text-muted uppercase">
						Categories
					</h3>
					{#each APP_CONFIG.categories as category}
						<a
							href="/{category.slug}"
							class="flex items-center space-x-3 py-3 transition-colors hover:text-primary"
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

