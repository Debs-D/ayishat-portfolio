<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import SectionLabel from '$lib/components/ui/SectionLabel.svelte';
	import MagneticButton from '$lib/components/ui/MagneticButton.svelte';

	let sectionEl: HTMLElement;
	let statsEl: HTMLElement;
	let counters = $state([
		{ label: 'Years\nExperience', target: 3, display: 0, suffix: '+' },
		{ label: 'Projects\nBuilt',    target: 6, display: 0, suffix: '+' },
		{ label: 'Companies\nWorked',  target: 5, display: 0, suffix: '' }
	]);
	let cleanup: (() => void) | undefined;

	onMount(async () => {
		if (!browser) return;

		try {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const h2 = sectionEl?.querySelector('.about-headline');
			if (h2) {
				const text  = h2.textContent ?? '';
				const words = text.split(' ');
				h2.innerHTML = words
					.map((w) => `<span class="word"><span class="word-inner">${w}</span></span>`)
					.join(' ');

				gsap.from(h2.querySelectorAll('.word-inner'), {
					y: '100%',
					opacity: 0,
					stagger: 0.06,
					duration: 0.7,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: h2,
						start: 'top 85%',
						toggleActions: 'play none none none'
					}
				});
			}

			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						observer.disconnect();
						counters.forEach((c, i) => {
							gsap.to({}, {
								duration: 1.4,
								ease: 'power2.out',
								delay: i * 0.15,
								onUpdate: function () {
									counters[i] = { ...counters[i], display: Math.round(c.target * this.progress()) };
								},
								onComplete: () => {
									counters[i] = { ...counters[i], display: c.target };
								}
							});
						});
					}
				},
				{ threshold: 0.5 }
			);
			if (statsEl) observer.observe(statsEl);

			const tags = sectionEl?.querySelectorAll('.skill-tag');
			if (tags?.length) {
				gsap.from(tags, {
					y: 20,
					opacity: 0,
					stagger: 0.04,
					duration: 0.5,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: sectionEl?.querySelector('.skill-tags'),
						start: 'top 85%'
					}
				});
			}

			cleanup = () => ScrollTrigger.getAll().forEach((t) => {
				if (t.trigger === h2 || t.trigger === sectionEl?.querySelector('.skill-tags')) t.kill();
			});
		} catch {
			// fallback
		}
	});

	onDestroy(() => cleanup?.());

	const skills = [
		'React', 'Next.js', 'TypeScript', 'SvelteKit',
		'Tailwind CSS', 'JavaScript', 'REST APIs', 'GraphQL',
		'Zustand', 'Figma', 'Git', 'Node.js',
		'Jest', 'Cypress', 'Docker', 'CI/CD'
	];
</script>

<section id="about" class="section about" aria-label="About" bind:this={sectionEl}>
	<div class="about-inner">
		<div class="left">
			<SectionLabel number="01" title="About" />

			<h2 class="about-headline">
				The developer behind the code.
			</h2>

			<div class="about-text">
				<p>
					I'm a frontend developer with <strong>3 years of combined experience</strong> building
					dynamic, responsive web applications. I transitioned from banking operations at UBA and
					Access Bank into engineering — and that background gives me something rare: I understand
					both the code <em>and</em> the user behind it.
				</p>
				<p>
					I specialize in <strong>fintech and product interfaces</strong> — agency banking dashboards,
					KYC flows, POS systems, and SaaS platforms. I care deeply about performance,
					accessibility, and the small details that make a product feel polished.
				</p>
				<p>
					Currently building at <strong>Baige Wallet</strong>, working remotely from Lagos.
				</p>
			</div>

			<div class="current-badge" aria-label="Current role">
				<span class="badge-dot" aria-hidden="true">⚡</span>
				<span>Baige Wallet — Frontend Developer</span>
			</div>

			<div class="skill-tags" aria-label="Key skills">
				{#each skills as skill}
					<span class="skill-tag">{skill}</span>
				{/each}
			</div>

			<div class="about-ctas">
				<MagneticButton href="/resume.pdf" variant="outline" ariaLabel="Download resume">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
					RESUME
				</MagneticButton>
			</div>
		</div>

		<div class="right">
			<div class="avatar-wrapper" aria-label="Profile illustration">
				<div class="avatar-bg" aria-hidden="true">
					<svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<defs>
							<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stop-color="#C16E3D" stop-opacity="0.18"/>
								<stop offset="100%" stop-color="#183B2D" stop-opacity="0.1"/>
							</linearGradient>
						</defs>
						<circle cx="150" cy="150" r="148" fill="url(#grad1)" stroke="#C16E3D" stroke-width="1" stroke-opacity="0.3"/>
						<circle cx="150" cy="120" r="50" fill="#1A2320" stroke="#C16E3D" stroke-width="1" stroke-opacity="0.4"/>
						<ellipse cx="150" cy="210" rx="75" ry="50" fill="#1A2320" stroke="#C16E3D" stroke-width="1" stroke-opacity="0.3"/>
						<line x1="30"  y1="80"  x2="100" y2="50"  stroke="#C16E3D" stroke-width="0.5" stroke-opacity="0.25"/>
						<line x1="200" y1="40"  x2="270" y2="90"  stroke="#183B2D" stroke-width="0.5" stroke-opacity="0.3"/>
						<line x1="20"  y1="200" x2="80"  y2="260" stroke="#C16E3D" stroke-width="0.5" stroke-opacity="0.25"/>
						<line x1="220" y1="240" x2="280" y2="190" stroke="#183B2D" stroke-width="0.5" stroke-opacity="0.3"/>
						<text x="150" y="128" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="36" fill="#C16E3D" fill-opacity="0.9" font-weight="700">AO</text>
						<text x="150" y="220" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#7A8E85" letter-spacing="3">FRONTEND DEV</text>
					</svg>
				</div>
			</div>

			<div class="stats" bind:this={statsEl} aria-label="Career statistics">
				{#each counters as counter}
					<div class="stat">
						<span class="stat-num" aria-live="polite">
							{counter.display}{counter.suffix}
						</span>
						<span class="stat-label">{counter.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.about { background: var(--bg-secondary); }

	.about-inner {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: clamp(48px, 6vw, 80px);
		align-items: start;
		max-width: 1200px;
		margin: 0 auto;
	}

	.about-headline {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 3.2rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.025em;
		color: var(--text-primary);
		margin-bottom: 28px;
		overflow: hidden;
	}

	:global(.word) {
		display: inline-block;
		overflow: hidden;
	}
	:global(.word-inner) {
		display: inline-block;
	}

	.about-text {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 28px;
	}

	.about-text p {
		font-size: clamp(0.95rem, 1.6vw, 1.05rem);
		color: var(--text-muted);
		line-height: 1.8;
	}

	.about-text strong { color: var(--text-primary); font-weight: 600; }
	.about-text em     { color: var(--accent); font-style: normal; }

	.current-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
		padding: 8px 16px;
		border-radius: var(--radius-sm);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--accent);
		margin-bottom: 28px;
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.skill-tag {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 5px 12px;
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: 100px;
		color: var(--text-muted);
		transition: color var(--transition-base), border-color var(--transition-base);
	}
	.skill-tag:hover {
		color: var(--accent);
		border-color: color-mix(in srgb, var(--accent) 30%, transparent);
	}

	.avatar-wrapper { margin-bottom: 32px; }

	.avatar-bg {
		width: 100%;
		max-width: 300px;
		aspect-ratio: 1;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 auto;
		border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
		box-shadow:
			0 0 40px color-mix(in srgb, var(--accent) 8%, transparent),
			inset 0 0 40px rgba(0,0,0,0.3);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.stat {
		text-align: center;
		padding: 16px 8px;
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
	}

	.stat-num {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		font-weight: 700;
		color: var(--accent);
		line-height: 1;
		margin-bottom: 6px;
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--text-muted);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: pre-line;
		line-height: 1.4;
	}

	@media (max-width: 900px) {
		.about-inner { grid-template-columns: 1fr; }
		.right { order: -1; }
		.avatar-bg { max-width: 200px; }
	}
</style>
