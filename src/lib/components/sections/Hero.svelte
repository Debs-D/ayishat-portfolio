<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import MagneticButton from '$lib/components/ui/MagneticButton.svelte';

	let canvasEl: HTMLCanvasElement;
	let glitchActive = $state(false);
	let typedText = $state('');
	let showCaret = $state(true);
	let cleanup: (() => void) | undefined;

	const subtitles = [
		'React Developer.',
		'Next.js Engineer.',
		'Fintech Specialist.',
		'SvelteKit Builder.'
	];
	let subtitleIndex = 0;

	async function typeSubtitle() {
		while (true) {
			const text = subtitles[subtitleIndex % subtitles.length];
			for (let i = 0; i <= text.length; i++) {
				typedText = text.slice(0, i);
				await delay(70);
			}
			await delay(1800);
			for (let i = text.length; i >= 0; i--) {
				typedText = text.slice(0, i);
				await delay(40);
			}
			await delay(300);
			subtitleIndex++;
		}
	}

	function delay(ms: number) {
		return new Promise<void>((r) => setTimeout(r, ms));
	}

	onMount(async () => {
		if (!browser) return;

		glitchActive = true;
		setTimeout(() => { glitchActive = false; }, 1200);

		const caretInterval = setInterval(() => { showCaret = !showCaret; }, 530);

		typeSubtitle();

		try {
			const THREE = await import('three');
			const scene    = new THREE.Scene();
			const w = window.innerWidth;
			const h = window.innerHeight;
			const camera   = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
			const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: false });

			renderer.setSize(w, h);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			camera.position.z = 4;

			const count = 1200;
			const positions  = new Float32Array(count * 3);
			const velocities = new Float32Array(count * 3);
			for (let i = 0; i < count; i++) {
				positions[i * 3]     = (Math.random() - 0.5) * 18;
				positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
				positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
				velocities[i * 3]     = (Math.random() - 0.5) * 0.002;
				velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
				velocities[i * 3 + 2] = 0;
			}

			const geo = new THREE.BufferGeometry();
			geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

			const mat = new THREE.PointsMaterial({
				color: 0xC16E3D,
				size: 0.028,
				transparent: true,
				opacity: 0.7,
				sizeAttenuation: true
			});

			const points = new THREE.Points(geo, mat);
			scene.add(points);

			let mx = 0, my = 0;
			const onMouseMove = (e: MouseEvent) => {
				mx = (e.clientX / window.innerWidth  - 0.5) * 0.3;
				my = (e.clientY / window.innerHeight - 0.5) * 0.2;
			};
			window.addEventListener('mousemove', onMouseMove);

			const onResize = () => {
				const rw = window.innerWidth;
				const rh = window.innerHeight;
				camera.aspect = rw / rh;
				camera.updateProjectionMatrix();
				renderer.setSize(rw, rh);
			};
			window.addEventListener('resize', onResize);

			let rafId: number;
			const tick = () => {
				rafId = requestAnimationFrame(tick);

				const pos = geo.attributes.position.array as Float32Array;
				for (let i = 0; i < count; i++) {
					pos[i * 3]     += velocities[i * 3];
					pos[i * 3 + 1] += velocities[i * 3 + 1];
					if (pos[i * 3] > 9)       pos[i * 3] = -9;
					if (pos[i * 3] < -9)      pos[i * 3] = 9;
					if (pos[i * 3 + 1] > 6)   pos[i * 3 + 1] = -6;
					if (pos[i * 3 + 1] < -6)  pos[i * 3 + 1] = 6;
				}
				geo.attributes.position.needsUpdate = true;

				scene.rotation.x += (my - scene.rotation.x) * 0.04;
				scene.rotation.y += (mx - scene.rotation.y) * 0.04;

				renderer.render(scene, camera);
			};
			tick();

			cleanup = () => {
				cancelAnimationFrame(rafId);
				clearInterval(caretInterval);
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('resize', onResize);
				renderer.dispose();
			};
		} catch {
			cleanup = () => clearInterval(caretInterval);
		}
	});

	onDestroy(() => cleanup?.());
</script>

<section id="hero" class="hero" aria-label="Hero">
	<div class="hero-content">
		<div class="status-badge" aria-label="Availability status">
			<span class="pulse-dot" aria-hidden="true"></span>
			Available for work
		</div>

		<div class="headline" aria-label="Frontend Developer">
			<div class="line-wrap">
				<span class="h-line solid">FRONTEND</span>
			</div>
			<div class="line-wrap">
				<span class="h-line stroke">DEVELOPER</span>
			</div>
		</div>

		<div class="name-wrapper" aria-label="Ayishat Odekunle">
			<h1
				class="name"
				class:glitch={glitchActive}
				data-text="AYISHAT ODEKUNLE"
			>
				AYISHAT ODEKUNLE
			</h1>
		</div>

		<p class="subtitle" aria-live="polite">
			<span>{typedText}</span><span class="caret" class:visible={showCaret} aria-hidden="true">|</span>
		</p>

		<p class="bio">
			Frontend developer building fast, accessible fintech experiences — from Lagos to the world.
		</p>

		<div class="ctas">
			<MagneticButton href="#projects" variant="primary" ariaLabel="View my work">
				VIEW MY WORK →
			</MagneticButton>
			<MagneticButton href="#contact" variant="outline" ariaLabel="Get in touch">
				GET IN TOUCH
			</MagneticButton>
		</div>

		<div class="socials" aria-label="Social links">
			<a href="https://github.com/Debs-D" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
				<span class="visually-hidden">GitHub</span>
			</a>
			<a href="https://www.linkedin.com/in/ayishat-odekunle-a7146527a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
				<span class="visually-hidden">LinkedIn</span>
			</a>
			<a href="https://x.com/Doa_debbie" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X profile">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
				<span class="visually-hidden">Twitter/X</span>
			</a>
		</div>

		<p class="location" aria-label="Location: Lagos, Nigeria">
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
			Lagos, Nigeria
		</p>
	</div>

	<div class="canvas-wrapper" aria-hidden="true">
		<canvas bind:this={canvasEl}></canvas>
	</div>

	<div class="scroll-hint" aria-hidden="true">
		<span>SCROLL</span>
		<div class="scroll-line"></div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 120px clamp(24px, 6vw, 120px) 80px;
		overflow: hidden;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		max-width: 680px;
		flex-shrink: 0;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: color-mix(in srgb, var(--accent-green) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent-green) 30%, transparent);
		color: var(--accent-green);
		padding: 6px 14px;
		border-radius: 100px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 28px;
	}

	.pulse-dot {
		width: 7px;
		height: 7px;
		background: var(--accent-green);
		border-radius: 50%;
		animation: pulse-ring 2s ease-in-out infinite;
	}

	@keyframes pulse-ring {
		0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-green) 40%, transparent); }
		50%       { box-shadow: 0 0 0 5px transparent; }
	}

	.headline {
		margin-bottom: 16px;
		overflow: hidden;
	}

	.line-wrap {
		overflow: hidden;
		animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	.line-wrap:nth-child(2) { animation-delay: 0.1s; }

	@keyframes reveal-up {
		from { transform: translateY(100%); opacity: 0; }
		to   { transform: translateY(0);    opacity: 1; }
	}

	.h-line {
		display: block;
		font-family: var(--font-display);
		font-size: clamp(4rem, 10vw, 8.5rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.solid  { color: var(--text-primary); }
	.stroke {
		-webkit-text-stroke: 1.5px var(--text-primary);
		color: transparent;
	}

	.name-wrapper { position: relative; margin-bottom: 20px; }

	.name {
		font-family: var(--font-mono);
		font-size: clamp(0.9rem, 2.5vw, 1.1rem);
		font-weight: 400;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.name.glitch { position: relative; }
	.name.glitch::before,
	.name.glitch::after {
		content: attr(data-text);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		color: var(--accent);
	}
	.name.glitch::before {
		animation: glitch-1 0.3s steps(1) 3;
		color: #E87A40;
	}
	.name.glitch::after {
		animation: glitch-2 0.3s steps(1) 3;
		color: #2A8B68;
	}

	.subtitle {
		font-family: var(--font-mono);
		font-size: clamp(1rem, 2.5vw, 1.3rem);
		color: var(--text-muted);
		margin-bottom: 16px;
		min-height: 1.6em;
	}

	.caret {
		opacity: 0;
		color: var(--accent);
		transition: opacity 0.1s;
	}
	.caret.visible { opacity: 1; }

	.bio {
		font-size: clamp(0.95rem, 1.8vw, 1.05rem);
		color: var(--text-muted);
		line-height: 1.7;
		margin-bottom: 36px;
		max-width: 480px;
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 36px;
	}

	.socials {
		display: flex;
		gap: 16px;
		margin-bottom: 20px;
	}

	.socials a {
		color: var(--text-dim);
		transition: color var(--transition-base), transform var(--transition-base);
		display: flex;
		align-items: center;
	}
	.socials a:hover {
		color: var(--accent);
		transform: translateY(-2px);
	}

	.location {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-dim);
		letter-spacing: 0.04em;
	}

	.canvas-wrapper {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		z-index: 1;
		opacity: 0.7;
	}
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.scroll-hint {
		position: absolute;
		bottom: 36px;
		right: clamp(24px, 5vw, 80px);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		z-index: 2;
	}

	.scroll-hint span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--text-dim);
		letter-spacing: 0.12em;
		writing-mode: vertical-rl;
		text-transform: uppercase;
	}

	.scroll-line {
		width: 1px;
		height: 50px;
		background: linear-gradient(to bottom, var(--text-dim), transparent);
		animation: scroll-line 2s ease-in-out infinite;
	}

	@keyframes scroll-line {
		0%   { transform: scaleY(0); transform-origin: top; }
		50%  { transform: scaleY(1); transform-origin: top; }
		51%  { transform: scaleY(1); transform-origin: bottom; }
		100% { transform: scaleY(0); transform-origin: bottom; }
	}

	@media (max-width: 768px) {
		.canvas-wrapper { display: none; }
		.hero { padding-top: 100px; }
	}
</style>
