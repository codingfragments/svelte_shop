<script lang="ts">
	import { APP_CONFIG } from '$lib/config.js';

	const communityLinks = {
		'Forums & Communities': [
			{ name: 'r/MechanicalKeyboards', url: 'https://reddit.com/r/MechanicalKeyboards', description: 'Reddit community' },
			{ name: 'GeekHack', url: 'https://geekhack.org', description: 'Enthusiast forum' },
			{ name: 'Keebtalk', url: 'https://keebtalk.com', description: 'Community discussions' },
			{ name: 'MechGroupBuys', url: 'https://www.reddit.com/r/MechGroupBuys', description: 'Group buy updates' },
			{ name: 'MK Discord', url: 'https://discord.gg/mechanical-keyboards', description: 'Real-time chat' }
		],
		'Educational Resources': [
			{ name: 'Switch Database', url: 'https://www.theremingoat.com', description: 'Comprehensive switch reviews' },
			{ name: 'Keyboard University', url: 'https://keyboard.university', description: 'Learn about keyboards' },
			{ name: 'Keycap Profiles Guide', url: 'https://www.keycaps.info', description: 'Profile comparisons' },
			{ name: 'Kailh Switch Guide', url: 'https://www.kailhswitch.com', description: 'Switch specifications' },
			{ name: 'GMK Keycaps', url: 'https://www.gmk-electronic-design.de', description: 'Premium keycap sets' }
		],
		'Popular Creators': [
			{ name: 'Taeha Types', url: 'https://www.youtube.com/c/TaehaTypes', description: 'Keyboard builds & reviews' },
			{ name: 'Glarses', url: 'https://www.youtube.com/c/Glarses', description: 'Enthusiast content' },
			{ name: 'ThereminGoat', url: 'https://www.theremingoat.com', description: 'In-depth switch reviews' },
			{ name: 'Thomas Baart', url: 'https://thomasbaart.nl', description: 'Split keyboard expert' },
			{ name: 'MechMerlin', url: 'https://www.youtube.com/c/MechMerlin', description: 'Reviews & tutorials' }
		],
		'Vendors & Brands': [
			{ name: 'Drop', url: 'https://drop.com/mechanical-keyboards', description: 'Popular marketplace' },
			{ name: 'KBDfans', url: 'https://kbdfans.com', description: 'Enthusiast parts' },
			{ name: 'Novel Keys', url: 'https://novelkeys.com', description: 'Switches & boards' },
			{ name: 'ZSA Technology', url: 'https://www.zsa.io', description: 'Ergonomic keyboards' },
			{ name: 'Keychron', url: 'https://www.keychron.com', description: 'Wireless mechanical' }
		]
	};

	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-bg-secondary border-t border-overlay0 mt-16">
	<!-- Main Footer Content -->
	<div class="container mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
			
			<!-- Brand & Newsletter -->
			<div class="lg:col-span-1 space-y-6">
				<div>
					<div class="flex items-center space-x-3 mb-4">
						<div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
							<span class="text-lg font-bold">⌨️</span>
						</div>
						<div>
							<h3 class="text-lg font-bold text-primary">{APP_CONFIG.name}</h3>
							<p class="text-sm text-text-muted">Next Century Keyboards</p>
						</div>
					</div>
					<p class="text-text-muted text-sm leading-relaxed mb-6">
						Premium mechanical keyboards and accessories for enthusiasts who demand the best quality and performance.
					</p>
				</div>

				<!-- Newsletter Signup -->
				<div>
					<h4 class="font-semibold text-text-primary mb-3">Stay Updated</h4>
					<div class="flex space-x-2">
						<input 
							type="email" 
							placeholder="Enter your email"
							class="flex-1 px-3 py-2 bg-bg-elevated border border-overlay0 rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
						/>
						<button class="px-4 py-2 bg-primary text-base rounded-lg hover:bg-secondary transition-colors font-medium text-sm">
							Join
						</button>
					</div>
					<p class="text-xs text-text-muted mt-2">Get notified about new products and group buys</p>
				</div>

				<!-- Social Links -->
				<div class="flex space-x-4">
					<a href="#" class="text-text-muted hover:text-primary transition-colors">
						<span class="sr-only">Twitter</span>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
						</svg>
					</a>
					<a href="#" class="text-text-muted hover:text-primary transition-colors">
						<span class="sr-only">Discord</span>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"></path>
						</svg>
					</a>
					<a href="#" class="text-text-muted hover:text-primary transition-colors">
						<span class="sr-only">YouTube</span>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
						</svg>
					</a>
				</div>
			</div>

			<!-- Community Links Grid -->
			{#each Object.entries(communityLinks) as [category, links]}
				<div>
					<h4 class="font-semibold text-text-primary mb-6">{category}</h4>
					<ul class="space-y-4">
						{#each links as link}
							<li>
								<a 
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									class="group flex flex-col space-y-1 hover:text-primary transition-colors"
								>
									<span class="font-medium text-text-primary group-hover:text-primary">{link.name}</span>
									<span class="text-sm text-text-muted">{link.description}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<!-- Bottom Bar -->
	<div class="border-t border-overlay0 bg-bg-tertiary">
		<div class="container mx-auto px-4 py-6">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
				<!-- Copyright -->
				<div class="text-sm text-text-muted">
					© {currentYear} {APP_CONFIG.name}. All rights reserved. Built with ❤️ for the mechanical keyboard community.
				</div>

				<!-- Legal Links -->
				<div class="flex flex-wrap items-center space-x-6 text-sm">
					<a href="/privacy" class="text-text-muted hover:text-primary transition-colors">Privacy Policy</a>
					<a href="/terms" class="text-text-muted hover:text-primary transition-colors">Terms of Service</a>
					<a href="/doc" class="text-text-muted hover:text-primary transition-colors">Help &amp; Documentation</a>
					<a href="/contact" class="text-text-muted hover:text-primary transition-colors">Contact</a>
				</div>
			</div>

			<!-- Tech Stack Credits -->
			<div class="mt-4 pt-4 border-t border-overlay0">
				<div class="text-xs text-text-muted text-center">
					Powered by <span class="text-primary font-medium">SvelteKit</span> • 
					Styled with <span class="text-primary font-medium">TailwindCSS</span> • 
					Theme: <span class="text-primary font-medium">Catppuccin Macchiato</span>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.container {
		max-width: 1200px;
	}
</style>
