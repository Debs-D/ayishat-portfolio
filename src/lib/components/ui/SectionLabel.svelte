<script lang="ts">
	interface Props {
		number: string;
		title: string;
	}
	let { number, title }: Props = $props();
</script>

<div class="section-label" aria-label="Section {number}: {title}">
	<span class="num">{number}</span>
	<span class="slash" aria-hidden="true">/</span>
	<span class="title">{title}</span>
</div>

<style>
	.section-label {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-bottom: 24px;
	}

	.num {
		color: var(--accent);
	}

	.slash {
		color: var(--text-dim);
	}

	.title {
		color: var(--text-muted);
	}
</style>
