<script lang="ts">
	import { afterUpdate, onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import type { BotResponse, ChatMessage, ProductSuggestion } from '$lib/chat/eliza';
	import { respond } from '$lib/chat/eliza';

	const panelId = 'eliza-chat-panel';
	let isOpen = false;
	let draft = '';

	function createId() {
		return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
	}

	let messages: ChatMessage[] = [
		{
			id: createId(),
			from: 'bot',
			text: 'Hi! I’m Eliza, your sales concierge. Tell me what you’re hoping to level up and I’ll scout the perfect picks.'
		}
	];
	let chatWindow: HTMLDivElement | null = null;

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	function toggle() {
		isOpen = !isOpen;
	}

	async function sendMessage() {
		const text = draft.trim();
		if (!text) return;

		messages = [...messages, { id: createId(), from: 'user', text }];
		draft = '';

		await tick();

		const reply: BotResponse = respond(text);

		messages = [
			...messages,
			{
				id: createId(),
				from: 'bot',
				text: reply.text
			}
		];

		if (reply.suggestion) {
			appendSuggestion(reply.suggestion);
		}
	}

	function appendSuggestion(suggestion: ProductSuggestion) {
		const suggestionMessage: ChatMessage = {
			id: createId(),
			from: 'bot',
			suggestion
		};

		messages = [...messages, suggestionMessage];

		if (suggestion.autoNavigate && suggestion.navigateTo) {
			setTimeout(() => {
				goto(suggestion.navigateTo!, { keepFocus: true });
			}, 650);
		}
	}

	afterUpdate(() => {
		if (chatWindow) {
			chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
		}
	});

	onMount(() => {
		const handler = (event: KeyboardEvent) => {
			if (isOpen && event.key === 'Escape') {
				isOpen = false;
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});
</script>

<div class="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 sm:bottom-4 sm:right-4">
	<button
		type="button"
		class={`group relative flex items-center gap-2 overflow-visible rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_35px_rgba(12,12,13,0.35)] transition-transform duration-150 focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent pointer-events-auto ${
			isOpen
				? 'bg-secondary text-crust'
				: 'bg-primary text-crust motion-safe:animate-[pulse_2.5s_ease-in-out_infinite]'
		}`}
		on:click={toggle}
		aria-expanded={isOpen}
		aria-controls={panelId}
	>
		<span
			class={`pointer-events-none absolute -inset-1 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(198,160,246,0.45),transparent_70%)] transition duration-200 ease-out ${
				isOpen
					? 'opacity-100 scale-105'
					: 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-110 group-focus-visible:opacity-100 group-focus-visible:scale-110'
			}`}
			aria-hidden="true"
		></span>
		<div
			class={`relative grid size-10 place-items-center overflow-hidden rounded-full bg-bg-tertiary shadow-md transition-all duration-200 ${
				isOpen
					? 'size-20 shadow-xl'
					: 'group-hover:size-20 group-hover:shadow-xl group-focus-visible:size-20 group-focus-visible:shadow-xl'
			}`}
		>
			<img
				src="/images/chatbot/eliza-avatar.svg"
				alt="Eliza assistant avatar"
				class={`size-full transition-transform duration-200 ${
					isOpen
						? 'scale-[1.9]'
						: 'group-hover:scale-[1.9] group-focus-visible:scale-[1.9]'
				}`}
			/>
		</div>
		<span class="relative">{isOpen ? 'Close chat' : 'Need a hand?'}</span>
	</button>

	{#if isOpen}
		<section
			id={panelId}
			class="pointer-events-auto flex w-80 flex-col overflow-hidden rounded-xl border border-overlay0 bg-bg-elevated text-text-primary shadow-[0_20px_45px_rgba(8,8,12,0.45)]"
			aria-live="polite"
		>
			<header class="bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-crust">
				Virtual Customer Coach
			</header>
			<div
				bind:this={chatWindow}
				class="flex max-h-96 flex-col gap-3 overflow-y-auto bg-bg-secondary px-4 py-3 text-sm"
			>
				{#each messages as message (message.id)}
					<div class={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
						{#if message.suggestion}
							{#if message.suggestion.style === 'card'}
								<div class="max-w-[90%] rounded-3xl bg-bg-card p-4 text-left shadow-[0_4px_18px_rgba(0,0,0,0.2)]">
									<p class="mb-3 text-sm text-text-primary/90">{message.suggestion.blurb}</p>
									<div class="overflow-hidden rounded-2xl border border-overlay0 bg-bg-elevated">
										<img
											src={message.suggestion.product.image}
											alt={message.suggestion.product.name}
											class="h-36 w-full object-cover"
										/>
										<div class="space-y-2 p-4">
											<h4 class="text-base font-semibold text-text-primary">{message.suggestion.product.name}</h4>
											<p class="text-sm text-text-secondary">{message.suggestion.product.tagline}</p>
											<p class="text-sm font-semibold text-primary">{formatPrice(message.suggestion.product.price)}</p>
											<a
												href={`/${message.suggestion.product.categorySlug}/${message.suggestion.product.slug}`}
												class="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-crust transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
											>
												{message.suggestion.ctaLabel ?? 'View product'}
											</a>
										</div>
									</div>
								</div>
							{:else}
								<p class="max-w-[85%] rounded-3xl bg-bg-card px-3 py-2 text-sm text-text-primary shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
									{@html message.suggestion.blurb}
								</p>
							{/if}
						{:else if message.text}
							<p
								class={`max-w-[85%] rounded-3xl px-3 py-2 text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
									message.from === 'user'
										? 'bg-primary text-crust'
										: 'bg-bg-card text-text-primary'
								}`}
							>
								{message.text}
							</p>
						{/if}
					</div>
				{/each}
			</div>
			<form
				on:submit|preventDefault={sendMessage}
				class="flex items-center gap-2 border-t border-overlay0 bg-bg-elevated px-3 py-2"
			>
				<input
					type="text"
					class="h-10 flex-1 rounded-full border border-overlay1 bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					placeholder="Ask about products, orders, shipping…"
					bind:value={draft}
					autocomplete="off"
				/>
				<button
					type="submit"
					class="h-10 rounded-full bg-secondary px-4 text-sm font-semibold text-crust transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
				>
					Send
				</button>
			</form>
		</section>
	{/if}
</div>
