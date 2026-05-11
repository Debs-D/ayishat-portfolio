<script lang="ts">
	import BootScreen  from '$lib/components/sections/BootScreen.svelte';
	import Hero        from '$lib/components/sections/Hero.svelte';
	import About       from '$lib/components/sections/About.svelte';
	import Projects    from '$lib/components/sections/Projects.svelte';
	import Skills      from '$lib/components/sections/Skills.svelte';
	import Experience  from '$lib/components/sections/Experience.svelte';
	import Contact     from '$lib/components/sections/Contact.svelte';
</script>

<svelte:head>
	<title>Ayishat Odekunle — Frontend Developer</title>
</svelte:head>

<BootScreen />

<main id="main-content">
	<Hero />
	<About />
	<Projects />
	<Skills />
	<Experience />
	<Contact />
	<footer class="footer">
		<div class="footer-inner">
			<span class="footer-name">AYISHAT ODEKUNLE</span>
			<span class="footer-copy" aria-label="Copyright 2025">© 2025</span>
			<span class="footer-built">
				BUILT WITH
				<a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer" aria-label="SvelteKit website">SVELTEKIT</a>
				&
				<a href="https://gsap.com" target="_blank" rel="noopener noreferrer" aria-label="GSAP website">GSAP</a>
			</span>
		</div>
	</footer>
</main>

<style>
	.footer {
		background: var(--bg-primary);
		border-top: 1px solid var(--border);
		padding: 24px clamp(24px, 6vw, 120px);
	}

	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		max-width: 1400px;
		margin: 0 auto;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-dim);
		letter-spacing: 0.08em;
	}

	.footer-name { color: var(--text-muted); }

	.footer-built a {
		color: var(--text-muted);
		text-decoration: none;
		transition: color 200ms ease;
	}
	.footer-built a:hover { color: var(--accent); }
</style>
