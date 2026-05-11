<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import SectionLabel from '$lib/components/ui/SectionLabel.svelte';
	import { projects } from '$lib/data/projects';

	let outerEl: HTMLElement;
	let stickyEl: HTMLElement;
	let trackEl: HTMLElement;
	let cleanup: (() => void) | undefined;

	onMount(async () => {
		if (!browser) return;

		const mq = window.matchMedia('(max-width: 768px)');
		if (mq.matches) return; // vertical layout on mobile

		try {
			const { gsap }          = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const setup = () => {
				ScrollTrigger.getAll()
					.filter((t) => t.vars?.id === 'projects-pin')
					.forEach((t) => t.kill());

				const totalWidth = trackEl.scrollWidth - window.innerWidth;
				if (totalWidth <= 0) return;

				gsap.to(trackEl, {
					x: -totalWidth,
					ease: 'none',
					scrollTrigger: {
						id: 'projects-pin',
						trigger: stickyEl,
						start: 'top top',
						end: `+=${totalWidth}`,
						pin: true,
						scrub: 1.2,
						invalidateOnRefresh: true,
						anticipatePin: 1
					}
				});
			};

			setup();
			ScrollTrigger.addEventListener('refreshInit', setup);

			cleanup = () => {
				ScrollTrigger.removeEventListener('refreshInit', setup);
				ScrollTrigger.getAll()
					.filter((t) => t.vars?.id === 'projects-pin')
					.forEach((t) => t.kill());
			};
		} catch { /* no-op */ }
	});

	onDestroy(() => cleanup?.());
</script>

<section id="projects" class="projects-outer" aria-label="Projects" bind:this={outerEl}>
	<!-- Section header (before pin) -->
	<div class="projects-header section">
		<SectionLabel number="02" title="Projects" />
		<h2 class="projects-title">
			<span class="solid">SELECTED</span><br/>
			<span class="stroke">WORK</span>
		</h2>
		<p class="scroll-hint" aria-hidden="true">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
			Scroll to explore
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
		</p>
	</div>

	<!-- Pinned horizontal track -->
	<div class="sticky-wrap" bind:this={stickyEl}>
		<div class="projects-track" bind:this={trackEl}>
			{#each projects as project, i}
				<article
					class="project-card"
					style="--card-accent: {project.accent}"
					aria-label="Project: {project.title}"
				>
					<!-- Background number -->
					<span class="card-num-bg" aria-hidden="true">{project.number}</span>

					<div class="card-content">
						<!-- Left: text -->
						<div class="card-left">
							<span class="card-num" aria-hidden="true">{project.number}</span>
							<h3 class="card-title">{project.title}</h3>
							<p class="card-tagline">{project.tagline}</p>
							<p class="card-desc">{project.description}</p>

							<div class="card-tech" aria-label="Technologies used">
								{#each project.tech as t}
									<span class="tech-tag">{t}</span>
								{/each}
							</div>

							<div class="card-links">
								{#if project.live}
									<a
										href={project.live}
										target="_blank"
										rel="noopener noreferrer"
										class="card-link primary"
										aria-label="View live demo of {project.title}"
									>
										LIVE →
									</a>
								{/if}
								{#if project.github}
									<a
										href={project.github}
										target="_blank"
										rel="noopener noreferrer"
										class="card-link ghost"
										aria-label="View source code for {project.title}"
									>
										GITHUB
									</a>
								{/if}
							</div>
						</div>

						<!-- Right: visual -->
						<div class="card-right" aria-hidden="true">
							<div
								class="card-visual"
								style="
									background: linear-gradient(135deg,
										color-mix(in srgb, {project.accent} 12%, #0A0A0F),
										color-mix(in srgb, {project.accent} 4%, #111118)
									);
									border-color: color-mix(in srgb, {project.accent} 20%, transparent);
								"
							>
								<!-- Abstract code visualization -->
								<div class="code-lines">
									{#each Array(8) as _, li}
										<div
											class="code-line"
											style="
												width: {40 + Math.sin(li * 1.3 + i) * 30}%;
												opacity: {0.15 + (li % 3) * 0.1};
												background: {project.accent};
											"
										></div>
									{/each}
								</div>
								<div class="visual-label">
									<span class="tech-primary">{project.tech[0]}</span>
									<span class="plus" aria-hidden="true">+</span>
									<span class="tech-count">{project.tech.length - 1} more</span>
								</div>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>

	<!-- Mobile: vertical stack -->
	<div class="mobile-projects section">
		<div class="projects-header">
			<SectionLabel number="02" title="Projects" />
			<h2 class="projects-title">
				<span class="solid">SELECTED</span><br/>
				<span class="stroke">WORK</span>
			</h2>
		</div>
		{#each projects as project}
			<article
				class="mobile-card"
				style="--card-accent: {project.accent}"
				aria-label="Project: {project.title}"
			>
				<div class="mc-header">
					<span class="mc-num">{project.number}</span>
					<div class="mc-links">
						{#if project.live}
							<a href={project.live} target="_blank" rel="noopener noreferrer" class="card-link primary" aria-label="Live demo">LIVE →</a>
						{/if}
						{#if project.github}
							<a href={project.github} target="_blank" rel="noopener noreferrer" class="card-link ghost" aria-label="GitHub">GITHUB</a>
						{/if}
					</div>
				</div>
				<h3 class="mc-title">{project.title}</h3>
				<p class="mc-tagline">{project.tagline}</p>
				<p class="mc-desc">{project.description}</p>
				<div class="card-tech">
					{#each project.tech as t}
						<span class="tech-tag">{t}</span>
					{/each}
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	/* ── Outer ── */
	.projects-outer {
		background: var(--bg-primary);
		position: relative;
	}

	.projects-header {
		padding-bottom: 0;
	}

	.projects-title {
		font-family: var(--font-display);
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
		margin-bottom: 16px;
	}
	.projects-title .solid { color: var(--text-primary); }
	.projects-title .stroke {
		-webkit-text-stroke: 1px var(--text-primary);
		color: transparent;
	}

	.scroll-hint {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-dim);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 8px;
	}

	/* ── Sticky / Track ── */
	.sticky-wrap {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		align-items: stretch;
	}

	.projects-track {
		display: flex;
		flex-direction: row;
		height: 100%;
		will-change: transform;
	}

	/* ── Card ── */
	.project-card {
		flex-shrink: 0;
		width: min(85vw, 680px);
		height: 100%;
		padding: clamp(32px, 4vw, 60px);
		border-right: 1px solid var(--border);
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: background var(--transition-slow);
	}

	.project-card:hover {
		background: color-mix(in srgb, var(--card-accent) 3%, transparent);
	}

	.card-num-bg {
		position: absolute;
		bottom: -0.1em;
		right: -0.05em;
		font-family: var(--font-display);
		font-size: clamp(10rem, 22vw, 18rem);
		font-weight: 800;
		color: var(--card-accent);
		opacity: 0.04;
		line-height: 1;
		pointer-events: none;
		user-select: none;
		letter-spacing: -0.05em;
	}

	.card-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
		align-items: center;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	/* Left text */
	.card-num {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--card-accent);
		letter-spacing: 0.12em;
		margin-bottom: 12px;
		display: block;
	}

	.card-title {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
		margin-bottom: 8px;
		letter-spacing: -0.02em;
	}

	.card-tagline {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--card-accent);
		margin-bottom: 16px;
		line-height: 1.5;
	}

	.card-desc {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.7;
		margin-bottom: 20px;
	}

	.card-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 24px;
	}

	.tech-tag {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		padding: 3px 10px;
		background: color-mix(in srgb, var(--card-accent) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--card-accent) 25%, transparent);
		border-radius: 100px;
		color: var(--card-accent);
	}

	.card-links {
		display: flex;
		gap: 10px;
	}

	.card-link {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
		padding: 8px 16px;
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
		transition: all var(--transition-base);
	}
	.card-link.primary {
		background: var(--card-accent);
		color: var(--bg-primary);
	}
	.card-link.primary:hover { opacity: 0.85; }
	.card-link.ghost {
		border-color: var(--border-light);
		color: var(--text-muted);
	}
	.card-link.ghost:hover { border-color: var(--card-accent); color: var(--card-accent); }

	/* Right visual */
	.card-visual {
		width: 100%;
		aspect-ratio: 4/3;
		border-radius: var(--radius-lg);
		border: 1px solid;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 24px;
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}

	.project-card:hover .card-visual {
		transform: perspective(800px) rotateY(-4deg) rotateX(2deg);
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
	}

	.code-lines {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.code-line {
		height: 3px;
		border-radius: 2px;
		transition: width 0.6s ease;
	}

	.visual-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}
	.tech-primary { color: var(--text-primary); font-weight: 600; }
	.plus         { color: var(--text-dim); }
	.tech-count   { color: var(--text-muted); }

	/* ── Mobile ── */
	.sticky-wrap,
	.projects-header:first-of-type { display: none; }

	.mobile-projects { display: block; }

	.mobile-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 24px;
		margin-bottom: 16px;
		position: relative;
		overflow: hidden;
		transition: border-color var(--transition-base);
	}
	.mobile-card:hover { border-color: color-mix(in srgb, var(--card-accent) 40%, transparent); }

	.mc-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}
	.mc-num {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--card-accent);
		letter-spacing: 0.12em;
	}
	.mc-links { display: flex; gap: 8px; }
	.mc-title {
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 4px;
	}
	.mc-tagline { font-family: var(--font-mono); font-size: 0.75rem; color: var(--card-accent); margin-bottom: 10px; }
	.mc-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }

	@media (min-width: 769px) {
		.sticky-wrap   { display: flex; }
		.projects-header:first-of-type { display: block; }
		.mobile-projects { display: none; }
	}
</style>
