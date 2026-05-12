<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { terminalOpen } from '$lib/stores/terminal';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';

	let scrolled = $state(false);
	let menuOpen = $state(false);
	let activeSection = $state('hero');
	let cleanup: (() => void) | undefined;

	const navLinks = [
		{ id: 'about',      label: '01 About' },
		{ id: 'projects',   label: '02 Projects' },
		{ id: 'skills',     label: '03 Skills' },
		{ id: 'experience', label: '04 Experience' },
		{ id: 'contact',    label: '05 Contact' }
	];

	onMount(() => {
		if (!browser) return;

		const onScroll = () => { scrolled = window.scrollY > 60; };
		window.addEventListener('scroll', onScroll, { passive: true });

		const sections = document.querySelectorAll('section[id]');
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) activeSection = e.target.id;
				});
			},
			{ threshold: 0.3 }
		);
		sections.forEach((s) => observer.observe(s));

		cleanup = () => {
			window.removeEventListener('scroll', onScroll);
			observer.disconnect();
		};
	});

	onDestroy(() => cleanup?.());

	function scrollTo(id: string) {
		if (!browser) return;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
		menuOpen = false;
	}

	function onMenuKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window onkeydown={onMenuKeydown} />

<header class="navbar" class:scrolled>
	<nav aria-label="Main navigation">
		<button
			class="logo"
			onclick={() => scrollTo('hero')}
			aria-label="Go to top"
		>
			<span>AO</span>
		</button>

		<ul class="nav-links" role="list">
			{#each navLinks as link}
				<li>
					<button
						class="nav-link"
						class:active={activeSection === link.id}
						onclick={() => scrollTo(link.id)}
						aria-current={activeSection === link.id ? 'true' : undefined}
					>
						{link.label}
					</button>
				</li>
			{/each}
		</ul>

		<div class="nav-actions">
			<button
				class="term-btn"
				onclick={() => terminalOpen.open()}
				aria-label="Open interactive terminal (Ctrl+K)"
				title="Terminal (Ctrl+K)"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="4 17 10 11 4 5"/>
					<line x1="12" y1="19" x2="20" y2="19"/>
				</svg>
				<span class="term-label" aria-hidden="true">⌃K</span>
			</button>

			<ThemeToggle />

			<button
				class="hamburger"
				onclick={() => { menuOpen = !menuOpen; }}
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
			>
				<span class="bar" class:open={menuOpen}></span>
				<span class="bar" class:open={menuOpen}></span>
				<span class="bar" class:open={menuOpen}></span>
			</button>
		</div>
	</nav>
</header>

{#if menuOpen}
	<div
		id="mobile-menu"
		class="mobile-menu"
		role="dialog"
		aria-label="Mobile navigation"
		aria-modal="true"
	>
		<ul role="list">
			{#each navLinks as link}
				<li>
					<button
						class="mobile-link"
						class:active={activeSection === link.id}
						onclick={() => scrollTo(link.id)}
					>
						{link.label}
					</button>
				</li>
			{/each}
		</ul>

		<div class="mobile-footer">
			<button
				class="term-btn"
				onclick={() => { menuOpen = false; terminalOpen.open(); }}
				aria-label="Open terminal"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="4 17 10 11 4 5"/>
					<line x1="12" y1="19" x2="20" y2="19"/>
				</svg>
				Terminal
			</button>
		</div>
	</div>
{/if}

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: background var(--transition-base), border-color var(--transition-base), backdrop-filter var(--transition-base);
		border-bottom: 1px solid transparent;
	}

	.navbar.scrolled {
		background: rgba(11, 18, 16, 0.88);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-color: var(--border);
	}

	:global([data-theme="light"]) .navbar.scrolled {
		background: rgba(246, 243, 238, 0.88);
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px clamp(24px, 5vw, 80px);
		max-width: 1400px;
		margin: 0 auto;
	}

	.logo {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		background: none;
		border: none;
		cursor: none;
		letter-spacing: -0.02em;
		transition: color var(--transition-base);
	}
	.logo span { color: var(--accent); }
	.logo:hover { opacity: 0.8; }

	.nav-links {
		display: flex;
		align-items: center;
		gap: 4px;
		list-style: none;
	}

	.nav-link {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		background: none;
		border: none;
		cursor: none;
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		transition: color var(--transition-base), background var(--transition-base);
	}

	.nav-link:hover { color: var(--text-primary); }
	.nav-link.active { color: var(--accent); }

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.term-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		padding: 8px 12px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		cursor: none;
		transition: color var(--transition-base), border-color var(--transition-base);
	}
	.term-btn:hover { color: var(--accent); border-color: var(--accent); }
	.term-label { letter-spacing: 0.05em; }

	.hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: none;
		padding: 6px;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
	}

	.bar {
		display: block;
		width: 22px;
		height: 1.5px;
		background: var(--text-muted);
		border-radius: 2px;
		transition: transform 250ms ease, opacity 250ms ease;
	}

	.bar.open:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
	.bar.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
	.bar.open:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

	.mobile-menu {
		position: fixed;
		inset: 0;
		background: var(--bg-primary);
		z-index: 999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.mobile-menu ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		width: 100%;
	}

	.mobile-link {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 6vw, 2.8rem);
		font-weight: 600;
		color: var(--text-muted);
		background: none;
		border: none;
		cursor: none;
		letter-spacing: -0.02em;
		padding: 8px 24px;
		transition: color var(--transition-base);
		width: 100%;
		text-align: center;
	}
	.mobile-link:hover,
	.mobile-link.active { color: var(--accent); }

	.mobile-footer {
		margin-top: 40px;
	}

	@media (max-width: 768px) {
		.nav-links  { display: none; }
		.term-btn   .term-label { display: none; }
		.hamburger  { display: flex; }
	}

	@media (min-width: 769px) {
		.mobile-menu { display: none !important; }
	}
</style>
