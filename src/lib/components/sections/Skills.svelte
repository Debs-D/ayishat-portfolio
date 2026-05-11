<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import SectionLabel from '$lib/components/ui/SectionLabel.svelte';
	import { skillGroups, currentlyLearning } from '$lib/data/skills';

	let sectionEl: HTMLElement;
	let cleanup: (() => void) | undefined;

	onMount(async () => {
		if (!browser) return;
		try {
			const { gsap }          = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const cards = sectionEl?.querySelectorAll('.skill-card');
			if (cards?.length) {
				gsap.from(cards, {
					y: 50,
					opacity: 0,
					stagger: 0.1,
					duration: 0.6,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				});
			}
		} catch { /* no-op */ }
	});

	onDestroy(() => cleanup?.());
</script>

<section id="skills" class="section skills" aria-label="Skills" bind:this={sectionEl}>
	<div class="skills-inner">
		<div class="skills-header">
			<SectionLabel number="03" title="Skills" />
			<h2 class="skills-title">
				Tools of<br/>
				<span class="stroke">the trade.</span>
			</h2>
			<p class="skills-sub">
				A specialist's toolkit — built across fintech, e-commerce, and SaaS products.
			</p>
		</div>

		<div class="skills-grid" role="list">
			{#each skillGroups as group}
				<div
					class="skill-card"
					style="--group-accent: {group.accent}"
					role="listitem"
					aria-label="{group.category}: {group.skills.join(', ')}"
				>
					<div class="card-top">
						<span class="card-icon" aria-hidden="true">{group.icon}</span>
						<h3 class="card-cat">{group.category}</h3>
					</div>
					<div class="card-pills" aria-hidden="true">
						{#each group.skills as skill}
							<span class="pill">{skill}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Currently learning -->
		<div class="learning" aria-label="Currently learning">
			<span class="learning-label">
				<span class="learning-dot" aria-hidden="true">●</span>
				Currently exploring
			</span>
			<div class="learning-pills">
				{#each currentlyLearning as item}
					<span class="pill learning-pill">{item}</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.skills { background: var(--bg-secondary); }

	.skills-inner {
		max-width: 1200px;
		margin: 0 auto;
	}

	.skills-header {
		margin-bottom: clamp(40px, 5vw, 64px);
	}

	.skills-title {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.03em;
		margin-bottom: 16px;
		color: var(--text-primary);
	}

	.stroke {
		-webkit-text-stroke: 1px var(--text-primary);
		color: transparent;
	}

	.skills-sub {
		font-size: 1rem;
		color: var(--text-muted);
		max-width: 480px;
		line-height: 1.7;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-bottom: 40px;
	}

	.skill-card {
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 24px;
		transition:
			border-color var(--transition-base),
			transform var(--transition-base),
			box-shadow var(--transition-base);
		cursor: default;
	}

	.skill-card:hover {
		border-color: color-mix(in srgb, var(--group-accent) 35%, transparent);
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0,0,0,0.2);
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 16px;
	}

	.card-icon {
		font-size: 1.3rem;
		line-height: 1;
	}

	.card-cat {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--group-accent);
	}

	.card-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.pill {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		padding: 3px 10px;
		background: color-mix(in srgb, var(--group-accent, var(--accent)) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--group-accent, var(--accent)) 20%, transparent);
		border-radius: 100px;
		color: var(--text-muted);
		white-space: nowrap;
	}

	.skill-card:hover .pill { color: var(--text-primary); }

	/* Learning */
	.learning {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		padding-top: 24px;
		border-top: 1px solid var(--border);
	}

	.learning-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.learning-dot {
		color: var(--accent-green);
		font-size: 0.5rem;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.5; }
		50%       { opacity: 1; }
	}

	.learning-pills { display: flex; flex-wrap: wrap; gap: 6px; }

	.learning-pill {
		background: color-mix(in srgb, var(--accent-green) 10%, transparent);
		border-color: color-mix(in srgb, var(--accent-green) 25%, transparent);
		color: var(--accent-green);
	}

	@media (max-width: 900px) {
		.skills-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 580px) {
		.skills-grid { grid-template-columns: 1fr; }
	}
</style>
