<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		href?: string;
		variant?: 'primary' | 'outline' | 'ghost';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		ariaLabel?: string;
		onclick?: (e: MouseEvent) => void;
		children?: import('svelte').Snippet;
	}

	let {
		href,
		variant = 'primary',
		type = 'button',
		disabled = false,
		ariaLabel,
		onclick,
		children
	}: Props = $props();

	let el: HTMLElement = $state() as HTMLElement;
	let tx = $state(0);
	let ty = $state(0);

	function onMouseMove(e: MouseEvent) {
		if (!browser || !el) return;
		const rect = el.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		const dist = Math.sqrt(dx * dx + dy * dy);
		const maxDist = Math.max(rect.width, rect.height) * 1.2;
		if (dist < maxDist) {
			tx = (dx / maxDist) * 12;
			ty = (dy / maxDist) * 10;
		}
	}

	function onMouseLeave() {
		tx = 0;
		ty = 0;
	}
</script>

{#if href}
	<a
		bind:this={el}
		{href}
		class="mag-btn {variant}"
		aria-label={ariaLabel}
		onmousemove={onMouseMove}
		onmouseleave={onMouseLeave}
		style="transform: translate({tx}px, {ty}px)"
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={el}
		{type}
		{disabled}
		class="mag-btn {variant}"
		aria-label={ariaLabel}
		onmousemove={onMouseMove}
		onmouseleave={onMouseLeave}
		onclick={onclick}
		style="transform: translate({tx}px, {ty}px)"
	>
		{@render children?.()}
	</button>
{/if}

<style>
	.mag-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 14px 32px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
		border-radius: var(--radius-sm);
		cursor: none;
		border: 1px solid transparent;
		transition:
			background var(--transition-base),
			color var(--transition-base),
			border-color var(--transition-base),
			box-shadow var(--transition-base);
		will-change: transform;
	}

	.mag-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Primary */
	.primary {
		background: var(--accent);
		color: var(--bg-primary);
		border-color: var(--accent);
	}
	.primary:hover:not(:disabled) {
		background: var(--accent-dim);
		border-color: var(--accent-dim);
		box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 30%, transparent);
	}

	/* Outline */
	.outline {
		background: transparent;
		color: var(--text-primary);
		border-color: var(--border-light);
	}
	.outline:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
		box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 15%, transparent);
	}

	/* Ghost */
	.ghost {
		background: transparent;
		color: var(--text-muted);
		border-color: transparent;
		padding: 8px 16px;
		font-size: 0.75rem;
	}
	.ghost:hover:not(:disabled) {
		color: var(--accent);
	}
</style>
