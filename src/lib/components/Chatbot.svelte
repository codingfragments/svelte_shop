<script lang="ts">
	import { afterUpdate, onMount, tick } from 'svelte';
	import type { ChatMessage } from '$lib/chat/eliza';
	import { respond } from '$lib/chat/eliza';

	const panelId = 'eliza-chat-panel';
	let isOpen = false;
	let draft = '';
	let messages: ChatMessage[] = [
		{
			from: 'bot',
			text: 'Hi! I am Eliza, your shopping companion. What brings you in today?'
		}
	];
	let chatWindow: HTMLDivElement | null = null;

	function toggle() {
		isOpen = !isOpen;
	}

	async function sendMessage() {
		const text = draft.trim();
		if (!text) return;

		messages = [...messages, { from: 'user', text }];
		draft = '';

		await tick();

		const reply = respond(text);
		messages = [...messages, { from: 'bot', text: reply }];
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

<div class="chat-shell">
	<button
		type="button"
		class={`chat-toggle ${isOpen ? 'chat-toggle--active' : 'chat-toggle--attention'}`}
		on:click={toggle}
		aria-expanded={isOpen}
		aria-controls={panelId}
	>
		<div class="chat-toggle__avatar-wrap">
			<img src="/images/chatbot/eliza-avatar.svg" alt="Eliza assistant avatar" class="chat-toggle__avatar" />
		</div>
		{#if isOpen}
			<span>Close chat</span>
		{:else}
			<span>Need a hand?</span>
		{/if}
	</button>

	{#if isOpen}
		<section id={panelId} class="chat-panel" aria-live="polite">
			<header class="chat-panel__header">Virtual Customer Coach</header>
			<div bind:this={chatWindow} class="chat-panel__messages">
				{#each messages as message}
					<div class={`chat-row chat-row--${message.from}`}>
						<p class={`chat-bubble chat-bubble--${message.from}`}>{message.text}</p>
					</div>
				{/each}
			</div>
			<form class="chat-panel__composer" on:submit|preventDefault={sendMessage}>
				<input
					type="text"
					class="chat-input"
					placeholder="Ask about products, orders, shipping…"
					bind:value={draft}
					autocomplete="off"
				/>
				<button type="submit" class="chat-send">Send</button>
			</form>
		</section>
	{/if}
</div>

<style>
	.chat-shell {
		pointer-events: none;
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.chat-toggle {
		position: relative;
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: none;
		border-radius: 9999px;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		background-color: var(--color-primary, #c6a0f6);
		color: var(--color-bg-tertiary, #181926);
		box-shadow: 0 10px 35px rgba(12, 12, 13, 0.35);
		transition: transform 0.15s ease, filter 0.15s ease;
	}

	.chat-toggle::after {
		content: '';
		position: absolute;
		inset: -0.4rem;
		border-radius: inherit;
		background: radial-gradient(circle at center, rgba(198, 160, 246, 0.45), transparent 70%);
		opacity: 0;
		transform: scale(0.9);
		transition: opacity 0.2s ease, transform 0.2s ease;
		z-index: -1;
	}

	.chat-toggle:hover,
	.chat-toggle:focus-visible {
		transform: scale(1.03);
		filter: brightness(1.05);
	}

	.chat-toggle:hover::after,
	.chat-toggle:focus-visible::after {
		opacity: 1;
		transform: scale(1.1);
	}

	.chat-toggle--active {
		background-color: var(--color-secondary, #b7bdf8);
	}

	.chat-toggle--attention {
		animation: chat-pulse 2.5s ease-in-out infinite;
	}

	.chat-toggle--attention::after {
		opacity: 0.75;
		animation: chat-glow 2.5s ease-in-out infinite;
	}

	.chat-toggle__avatar-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		width: 2.5rem;
		border-radius: 9999px;
		background-color: var(--color-bg-tertiary, #181926);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
		overflow: hidden;
		transition: width 0.25s ease, height 0.25s ease, transform 0.25s ease;
	}

	.chat-toggle__avatar {
		height: 100%;
		width: 100%;
		transition: transform 0.25s ease;
		transform-origin: center;
	}

	.chat-toggle:hover .chat-toggle__avatar-wrap,
	.chat-toggle:focus-visible .chat-toggle__avatar-wrap,
	.chat-toggle--active .chat-toggle__avatar-wrap {
		height: 4.5rem;
		width: 4.5rem;
	}

	.chat-toggle:hover .chat-toggle__avatar,
	.chat-toggle:focus-visible .chat-toggle__avatar,
	.chat-toggle--active .chat-toggle__avatar {
		transform: scale(1.9);
	}

	.chat-panel {
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		width: 20rem;
		overflow: hidden;
		border-radius: 0.75rem;
		border: 1px solid var(--color-overlay0, #6e738d);
		background-color: var(--color-bg-elevated, #363a4f);
		color: var(--color-text-primary, #cad3f5);
		box-shadow: 0 20px 45px rgba(8, 8, 12, 0.45);
	}

	.chat-panel__header {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		background: linear-gradient(
			135deg,
			var(--color-primary, #c6a0f6) 0%,
			var(--color-accent, #f5bde6) 100%
		);
		color: var(--color-bg-tertiary, #181926);
	}

	.chat-panel__messages {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-height: 24rem;
		overflow-y: auto;
		padding: 0.75rem 1rem;
		background-color: var(--color-bg-secondary, #1e2030);
	}

	.chat-row {
		display: flex;
	}

	.chat-row--user {
		justify-content: flex-end;
	}

	.chat-row--bot {
		justify-content: flex-start;
	}

	.chat-bubble {
		max-width: 85%;
		padding: 0.5rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.875rem;
		line-height: 1.4;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.chat-bubble--user {
		background-color: var(--color-primary, #c6a0f6);
		color: var(--color-bg-tertiary, #181926);
	}

	.chat-bubble--bot {
		background-color: var(--color-bg-card, #494d64);
		color: var(--color-text-primary, #cad3f5);
	}

	.chat-panel__composer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border-top: 1px solid var(--color-overlay0, #6e738d);
		background-color: var(--color-bg-elevated, #363a4f);
	}

	.chat-input {
		flex: 1;
		height: 2.5rem;
		padding: 0 0.75rem;
		border-radius: 9999px;
		border: 1px solid var(--color-overlay1, #8087a2);
		background-color: var(--color-bg-secondary, #1e2030);
		color: var(--color-text-primary, #cad3f5);
		font-size: 0.875rem;
	}

	.chat-input:focus-visible {
		outline: 2px solid var(--color-primary, #c6a0f6);
		outline-offset: 2px;
	}

	.chat-send {
		height: 2.5rem;
		padding: 0 1.25rem;
		border-radius: 9999px;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		background-color: var(--color-secondary, #b7bdf8);
		color: var(--color-bg-tertiary, #181926);
		transition: filter 0.15s ease, transform 0.15s ease;
	}

	.chat-send:hover,
	.chat-send:focus-visible {
		transform: translateY(-1px);
		filter: brightness(1.05);
	}

	@keyframes chat-pulse {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-2px) scale(1.02);
		}
	}

	@keyframes chat-glow {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(1);
		}
		50% {
			opacity: 0.6;
			transform: scale(1.15);
		}
	}

	@media (max-width: 640px) {
		.chat-shell {
			right: 1rem;
			left: 1rem;
			align-items: stretch;
		}

		.chat-panel {
			width: auto;
		}
	}
</style>
