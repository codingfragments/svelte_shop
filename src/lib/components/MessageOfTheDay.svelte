<script lang="ts">
	import { onMount } from 'svelte';

	let message = '';
	let category = '';
	let timestamp = '';
	let loading = true;
	let error = false;

	const CATEGORY_ICONS: Record<string, string> = {
		wisdom: '🧠',
		affirmation: '✨',
		humor: '😄',
		tip: '💡'
	};

	async function fetchMotd() {
		loading = true;
		error = false;
		try {
			const res = await fetch('/api/motd');
			const data = await res.json();
			message = data.message;
			category = data.category;
			timestamp = new Date(data.timestamp).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			error = true;
		} finally {
			loading = false;
		}
	}

	onMount(fetchMotd);
</script>

<div class="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 px-8 py-6 shadow-sm">
	<div class="mb-3 flex items-center justify-between">
		<span class="text-xs font-semibold uppercase tracking-widest text-primary">
			Message of the Day
		</span>
		{#if timestamp && !loading}
			<span class="text-xs text-text-muted">{timestamp}</span>
		{/if}
	</div>

	{#if loading}
		<div class="animate-pulse space-y-2">
			<div class="h-5 w-3/4 rounded bg-overlay0"></div>
			<div class="h-5 w-1/2 rounded bg-overlay0"></div>
		</div>
	{:else if error}
		<p class="text-sm text-text-muted italic">Could not load today's message.</p>
	{:else}
		<div class="flex items-start gap-3">
			<span class="mt-0.5 text-2xl leading-none">{CATEGORY_ICONS[category] ?? '⌨️'}</span>
			<p class="text-base leading-relaxed text-text-primary italic">"{message}"</p>
		</div>
	{/if}

	<div class="mt-4 flex justify-end">
		<button
			onclick={fetchMotd}
			class="text-xs text-text-muted transition-colors hover:text-primary disabled:opacity-50"
			disabled={loading}
			aria-label="Refresh message"
		>
			↻ another one
		</button>
	</div>
</div>
