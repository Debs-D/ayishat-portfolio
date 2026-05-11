<script lang="ts">
	// Film grain via SVG feTurbulence — zero performance cost
</script>

<div class="noise" aria-hidden="true">
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
		<filter id="noise-filter">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.65"
				numOctaves="3"
				stitchTiles="stitch"
			/>
			<feColorMatrix type="saturate" values="0" />
		</filter>
		<rect width="100%" height="100%" filter="url(#noise-filter)" />
	</svg>
</div>

<style>
	.noise {
		position: fixed;
		inset: -50%;
		width: 200%;
		height: 200%;
		pointer-events: none;
		z-index: 9998;
		opacity: 0.032;
		animation: noise-shift 8s steps(10) infinite;
	}

	@keyframes noise-shift {
		0%   { transform: translate(0, 0); }
		10%  { transform: translate(-2%, -3%); }
		20%  { transform: translate(3%, 1%); }
		30%  { transform: translate(-1%, 4%); }
		40%  { transform: translate(4%, -2%); }
		50%  { transform: translate(-3%, 3%); }
		60%  { transform: translate(2%, -4%); }
		70%  { transform: translate(-4%, 1%); }
		80%  { transform: translate(1%, 3%); }
		90%  { transform: translate(3%, -1%); }
		100% { transform: translate(0, 0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.noise { display: none; }
	}
</style>
