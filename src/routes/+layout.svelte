<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores/theme';
	import { terminalOpen } from '$lib/stores/terminal';
	import Cursor from '$lib/components/ui/Cursor.svelte';
	import NoiseOverlay from '$lib/components/ui/NoiseOverlay.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}
	let { children }: Props = $props();

	let cleanup: (() => void) | undefined;

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', $theme);
		}
	});

	onMount(async () => {
		if (!browser) return;

		theme.init();

		try {
			const { default: Lenis } = await import('lenis');
			const { gsap } = await import('gsap');

			const lenis = new Lenis({
				duration: 1.2,
				easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: 'vertical',
				gestureOrientation: 'vertical',
				smoothWheel: true
			});

			const ticker = (time: number) => { lenis.raf(time * 1000); };
			gsap.ticker.add(ticker);
			gsap.ticker.lagSmoothing(0);

			cleanup = () => {
				gsap.ticker.remove(ticker);
				lenis.destroy();
			};
		} catch {
			// native scroll fallback
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'k') {
				e.preventDefault();
				terminalOpen.toggle();
			}
			if (e.key === 'Escape') {
				terminalOpen.close();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		const prevCleanup = cleanup;
		cleanup = () => {
			prevCleanup?.();
			window.removeEventListener('keydown', onKeyDown);
		};
	});

	onDestroy(() => cleanup?.());
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
	<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<a href="#main-content" class="skip-link">Skip to main content</a>

<Cursor />
<NoiseOverlay />
<ScrollProgress />
<Terminal />
<Navbar />

{@render children()}
