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

	// Apply theme on mount
	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', $theme);
		}
	});

	onMount(async () => {
		if (!browser) return;

		// Init theme from localStorage
		theme.init();

		// Lenis smooth scroll + GSAP ticker
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
			// Lenis not available — native scroll still works
		}

		// Global keyboard shortcuts
		const onKeyDown = (e: KeyboardEvent) => {
			// Ctrl+K — open terminal
			if (e.ctrlKey && e.key === 'k') {
				e.preventDefault();
				terminalOpen.toggle();
			}
			// Escape — close terminal
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

<!-- Skip to main content -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Fixed UI layer -->
<Cursor />
<NoiseOverlay />
<ScrollProgress />
<Terminal />
<Navbar />

<!-- Page content -->
{@render children()}
