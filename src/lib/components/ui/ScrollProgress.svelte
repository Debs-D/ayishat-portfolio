<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let progress = $state(0);
	let cleanup: (() => void) | undefined;

	onMount(() => {
		if (!browser) return;

		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? window.scrollY / max : 0;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		cleanup = () => window.removeEventListener('scroll', onScroll);
	});

	onDestroy(() => cleanup?.());
</script>

<div
	class="progress-bar"
	role="progressbar"
	aria-valuenow={Math.round(progress * 100)}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-label="Page scroll progress"
	style="transform: scaleX({progress})"
></div>

<style>
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--accent);
		transform-origin: left;
		z-index: 10000;
		pointer-events: none;
		box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 60%, transparent);
	}
</style>
