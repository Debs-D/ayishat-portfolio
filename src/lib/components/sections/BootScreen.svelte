<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { bootComplete } from '$lib/stores/boot';
	import { fade } from 'svelte/transition';

	let visible = $state(true);
	let lines: string[] = $state([]);
	let bars: { label: string; pct: number }[] = $state([]);
	let showGranted = $state(false);
	let done = $state(false);

	const loadItems = [
		{ label: 'REACT     ', final: 100 },
		{ label: 'NEXT.JS   ', final: 100 },
		{ label: 'SVELTE    ', final: 100 },
		{ label: 'TAILWIND  ', final: 100 }
	];

	function skip() {
		if (done) return;
		done = true;
		visible = false;
		bootComplete.complete();
	}

	onMount(async () => {
		if (!browser) return;
		if ($bootComplete) {
			visible = false;
			return;
		}

		window.addEventListener('keydown', skip, { once: true });
		window.addEventListener('click', skip, { once: true });

		// Phase 1: typing intro
		const intro = '> CONNECTING TO AYISHAT.DEV...';
		for (let i = 0; i <= intro.length; i++) {
			lines = [intro.slice(0, i)];
			await delay(30);
		}
		await delay(200);
		lines = [...lines, ''];

		// Phase 2: loading bars
		for (const item of loadItems) {
			bars = [...bars, { label: item.label, pct: 0 }];
			for (let p = 0; p <= item.final; p += 4) {
				bars = bars.map((b, i) =>
					i === bars.length - 1 ? { ...b, pct: Math.min(p, item.final) } : b
				);
				await delay(18);
			}
			bars = bars.map((b, i) =>
				i === bars.length - 1 ? { ...b, pct: item.final } : b
			);
			await delay(60);
		}

		await delay(300);

		// Phase 3: granted
		showGranted = true;
		await delay(600);

		// Fade out
		done = true;
		visible = false;
		bootComplete.complete();
	});

	function delay(ms: number) {
		return new Promise<void>((r) => setTimeout(r, ms));
	}

	function barFill(pct: number) {
		const len = 20;
		const filled = Math.round((pct / 100) * len);
		return '█'.repeat(filled) + '░'.repeat(len - filled);
	}
</script>

{#if visible}
	<div
		class="boot scanlines"
		role="status"
		aria-label="Loading portfolio"
		aria-live="polite"
		transition:fade={{ duration: 500 }}
	>
		<div class="content">
			{#each lines as line}
				<div class="line">{line}</div>
			{/each}

			{#if bars.length > 0}
				<div class="bars">
					{#each bars as bar}
						<div class="bar-row">
							<span class="bar-label">[{bar.label}]</span>
							<span class="bar-fill">{barFill(bar.pct)}</span>
							<span class="bar-pct">{bar.pct}%</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if showGranted}
				<div class="granted"> ACCESS GRANTED &gt;</div>
			{/if}

			<p class="skip-hint" aria-label="Press any key to skip">
				<span>press any key to skip</span>
			</p>
		</div>
	</div>
{/if}

<style>
	.boot {
		position: fixed;
		inset: 0;
		background: var(--bg-primary);
		z-index: 9000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
	}

	.content {
		width: min(600px, 90vw);
	}

	.line {
		font-size: clamp(0.85rem, 2vw, 1rem);
		color: var(--accent);
		margin-bottom: 4px;
		min-height: 1.5em;
	}

	.bars {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: clamp(0.75rem, 1.8vw, 0.875rem);
		color: var(--text-muted);
	}

	.bar-label {
		color: var(--text-muted);
		min-width: 120px;
	}

	.bar-fill {
		color: var(--accent);
		letter-spacing: -1px;
		flex: 1;
	}

	.bar-pct {
		color: var(--text-muted);
		min-width: 38px;
		text-align: right;
	}

	.granted {
		margin-top: 24px;
		font-size: clamp(1rem, 2.5vw, 1.2rem);
		color: var(--accent-green);
		font-weight: 700;
		letter-spacing: 0.1em;
		animation: blink 0.4s step-end 2;
	}

	.skip-hint {
		margin-top: 48px;
		font-size: 0.7rem;
		color: var(--text-dim);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0; }
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50%       { opacity: 1; }
	}
</style>
