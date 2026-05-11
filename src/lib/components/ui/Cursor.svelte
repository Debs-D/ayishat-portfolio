<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let x = $state(0);
	let y = $state(0);
	let ringX = $state(0);
	let ringY = $state(0);
	let visible = $state(false);
	let isHovering = $state(false);
	let isClicking = $state(false);

	let rafId: number;
	let cleanup: (() => void) | undefined;

	onMount(() => {
		if (!browser) return;

		const onMove = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
			visible = true;

			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				ringX += (x - ringX) * 0.12;
				ringY += (y - ringY) * 0.12;
			});
		};

		const lerp = () => {
			ringX += (x - ringX) * 0.12;
			ringY += (y - ringY) * 0.12;
			rafId = requestAnimationFrame(lerp);
		};
		rafId = requestAnimationFrame(lerp);

		const onEnter = (e: MouseEvent) => {
			const t = e.target as HTMLElement;
			if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
				isHovering = true;
			}
		};
		const onLeave = (e: MouseEvent) => {
			const t = e.target as HTMLElement;
			if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
				isHovering = false;
			}
		};
		const onDown  = () => { isClicking = true; };
		const onUp    = () => { isClicking = false; };
		const onOut   = () => { visible = false; };

		window.addEventListener('mousemove',  onMove);
		window.addEventListener('mouseover',  onEnter);
		window.addEventListener('mouseout',   onLeave);
		window.addEventListener('mousedown',  onDown);
		window.addEventListener('mouseup',    onUp);
		document.documentElement.addEventListener('mouseleave', onOut);

		cleanup = () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('mousemove',  onMove);
			window.removeEventListener('mouseover',  onEnter);
			window.removeEventListener('mouseout',   onLeave);
			window.removeEventListener('mousedown',  onDown);
			window.removeEventListener('mouseup',    onUp);
			document.documentElement.removeEventListener('mouseleave', onOut);
		};
	});

	onDestroy(() => cleanup?.());
</script>

{#if visible}
	<!-- Outer ring (lags behind) -->
	<div
		class="cursor-ring"
		class:hovering={isHovering}
		class:clicking={isClicking}
		style="transform: translate({ringX - 20}px, {ringY - 20}px)"
		aria-hidden="true"
	></div>

	<!-- Inner dot (instant) -->
	<div
		class="cursor-dot"
		class:clicking={isClicking}
		style="transform: translate({x - 3}px, {y - 3}px)"
		aria-hidden="true"
	></div>
{/if}

<style>
	.cursor-ring,
	.cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
		will-change: transform;
		border-radius: 50%;
	}

	.cursor-ring {
		width: 40px;
		height: 40px;
		border: 1px solid var(--accent);
		opacity: 0.6;
		transition:
			width  200ms ease,
			height 200ms ease,
			opacity 200ms ease,
			border-color 200ms ease;
	}

	.cursor-dot {
		width: 6px;
		height: 6px;
		background: var(--accent);
		transition: transform 80ms ease, width 150ms ease, height 150ms ease;
	}

	.cursor-ring.hovering {
		width: 56px;
		height: 56px;
		opacity: 0.9;
		border-color: var(--accent);
		mix-blend-mode: difference;
	}

	.cursor-ring.clicking,
	.cursor-dot.clicking {
		transform: scale(0.8) !important;
	}

	@media (hover: none) {
		.cursor-ring,
		.cursor-dot {
			display: none;
		}
	}
</style>
