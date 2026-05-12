<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import SectionLabel from '$lib/components/ui/SectionLabel.svelte';
	import { roles, education, certifications } from '$lib/data/experience';

	let lineEl: SVGPathElement;
	let sectionEl: HTMLElement;
	let expandedIndex = $state<number | null>(null);
	let cleanup: (() => void) | undefined;

	onMount(async () => {
		if (!browser || !lineEl) return;
		try {
			const { gsap }          = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const len = lineEl.getTotalLength();
			gsap.set(lineEl, { strokeDasharray: len, strokeDashoffset: len });
			gsap.to(lineEl, {
				strokeDashoffset: 0,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionEl,
					start: 'top 80%',
					end: 'bottom 20%',
					scrub: 1
				}
			});

			const cards = sectionEl?.querySelectorAll('.role-card');
			gsap.from(cards, {
				x: -30,
				opacity: 0,
				stagger: 0.12,
				duration: 0.6,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: sectionEl,
					start: 'top 75%',
					toggleActions: 'play none none none'
				}
			});
		} catch { /* no-op */ }
	});
	onDestroy(() => cleanup?.());
</script>

<section id="experience" class="section experience" aria-label="Experience" bind:this={sectionEl}>
	<div class="exp-inner">
		<div class="exp-header">
			<SectionLabel number="04" title="Experience" />
			<h2 class="exp-title">
				The<br/>
				<span class="stroke">Journey.</span>
			</h2>
		</div>

		<div class="timeline-wrap">
			<svg class="timeline-svg" aria-hidden="true" preserveAspectRatio="none">
				<path
					bind:this={lineEl}
					d="M 24 0 L 24 10000"
					stroke="var(--accent)"
					stroke-width="1"
					fill="none"
					stroke-opacity="0.5"
				/>
			</svg>

			<div class="roles">
				{#each roles as role, i}
					<article
						class="role-card"
						class:expanded={expandedIndex === i}
					>
						<div class="tl-dot" aria-hidden="true">
							<div
								class="dot"
								style="background: {role.type === 'dev' ? 'var(--accent)' : 'var(--text-dim)'}"
							></div>
						</div>

						<button
							class="role-header"
							onclick={() => { expandedIndex = expandedIndex === i ? null : i; }}
							aria-label="Toggle details for {role.company}"
						>
							<div class="role-top">
								<div class="role-meta">
									<span class="role-company">{role.company}</span>
									<div class="role-badges">
										<span class="badge {role.location === 'Remote' ? 'remote' : 'onsite'}">
											{role.location}
										</span>
										{#if role.type === 'dev'}
											<span class="badge dev">Engineering</span>
										{/if}
									</div>
								</div>
								<span class="expand-icon" aria-hidden="true">{expandedIndex === i ? '−' : '+'}</span>
							</div>
							<div class="role-bottom">
								<span class="role-title">{role.role}</span>
								<span class="role-period">{role.period}</span>
							</div>
						</button>

						{#if expandedIndex === i}
							<div class="role-details" role="region" aria-label="Details for {role.company}">
								<ul class="highlights">
									{#each role.highlights as h}
										<li>{h}</li>
									{/each}
								</ul>
								{#if role.tech}
									<div class="role-tech">
										{#each role.tech as t}
											<span class="tech-tag">{t}</span>
										{/each}
									</div>
								{/if}
								{#if role.url}
									<a
										href={role.url}
										target="_blank"
										rel="noopener noreferrer"
										class="role-link"
										aria-label="Visit {role.company} website"
									>
										↗ Visit site
									</a>
								{/if}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		</div>

		<div class="edu-section" aria-labelledby="edu-heading">
			<h3 id="edu-heading" class="sub-heading">Education</h3>
			<div class="edu-grid">
				{#each education as edu}
					<div class="edu-card">
						<span class="edu-degree">{edu.degree}</span>
						<span class="edu-inst">{edu.institution}</span>
						<span class="edu-period">{edu.period}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="cert-section" aria-labelledby="cert-heading">
			<h3 id="cert-heading" class="sub-heading">Certifications</h3>
			<div class="cert-pills">
				{#each certifications as cert}
					<span class="cert-pill">{cert.name} <span class="cert-year">{cert.year}</span></span>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.experience { background: var(--bg-primary); }

	.exp-inner { max-width: 900px; margin: 0 auto; }

	.exp-title {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin-bottom: clamp(40px, 5vw, 64px);
		color: var(--text-primary);
	}

	.stroke {
		-webkit-text-stroke: 1px var(--text-primary);
		color: transparent;
	}

	.timeline-wrap { position: relative; margin-bottom: 64px; }

	.timeline-svg {
		position: absolute;
		top: 0;
		left: 24px;
		width: 2px;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.roles { padding-left: 60px; display: flex; flex-direction: column; gap: 4px; }

	.role-card {
		position: relative;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		overflow: hidden;
		transition: border-color var(--transition-base);
	}

	.role-card:hover,
	.role-card.expanded { border-color: var(--border-light); }

	.tl-dot {
		position: absolute;
		left: -46px;
		top: 24px;
		width: 12px;
		height: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid var(--bg-primary);
		box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent);
	}

	.role-header {
		width: 100%;
		background: none;
		border: none;
		padding: 20px 24px;
		cursor: none;
		text-align: left;
	}

	.role-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 6px;
	}

	.role-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

	.role-company {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.badge {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		padding: 2px 8px;
		border-radius: 100px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.remote { background: color-mix(in srgb, var(--accent-green) 12%, transparent); color: var(--accent-green); }
	.onsite { background: color-mix(in srgb, var(--text-muted) 12%, transparent); color: var(--text-muted); }
	.dev    { background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent); }

	.expand-icon {
		font-family: var(--font-mono);
		font-size: 1.2rem;
		color: var(--text-dim);
		line-height: 1;
		transition: color var(--transition-base);
	}
	.role-card.expanded .expand-icon { color: var(--accent); }

	.role-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.role-title {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-family: var(--font-body);
	}

	.role-period {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-dim);
		white-space: nowrap;
	}

	.role-details {
		padding: 0 24px 20px;
		border-top: 1px solid var(--border);
		padding-top: 16px;
	}

	.highlights {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
	}

	.highlights li {
		position: relative;
		padding-left: 16px;
		font-size: 0.875rem;
		color: var(--text-muted);
		line-height: 1.7;
		font-family: var(--font-body);
	}
	.highlights li::before {
		content: '✦';
		position: absolute;
		left: 0;
		color: var(--accent);
		font-size: 0.5rem;
		top: 5px;
	}

	.role-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }

	.tech-tag {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		padding: 3px 10px;
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
		border-radius: 100px;
		color: var(--accent);
	}

	.role-link {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--accent-dim);
		text-decoration: none;
		transition: color var(--transition-base);
	}
	.role-link:hover { color: var(--accent); }

	.sub-heading {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 16px;
	}

	.edu-section { margin-bottom: 40px; }

	.edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

	.edu-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.edu-degree {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.edu-inst { font-size: 0.875rem; color: var(--text-muted); font-family: var(--font-body); }
	.edu-period { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); }

	.cert-pills { display: flex; flex-wrap: wrap; gap: 8px; }

	.cert-pill {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 6px 14px;
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: 100px;
		color: var(--text-muted);
	}
	.cert-year { color: var(--text-dim); margin-left: 4px; }

	@media (max-width: 580px) {
		.edu-grid { grid-template-columns: 1fr; }
		.roles { padding-left: 40px; }
	}
</style>
