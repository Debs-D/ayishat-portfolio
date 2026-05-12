<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { terminalOpen } from '$lib/stores/terminal';
	import { handleCommand, allCommandNames, type TerminalLine } from '$lib/utils/terminal-commands';
	import { fly } from 'svelte/transition';

	interface OutputEntry {
		prompt?: string;
		lines: TerminalLine[];
	}

	let inputEl: HTMLInputElement = $state() as HTMLInputElement;
	let outputEl: HTMLDivElement = $state() as HTMLDivElement;
	let input = $state('');
	let history: string[] = $state([]);
	let historyIndex = $state(-1);
	let output: OutputEntry[] = $state([
		{
			lines: [
				{ type: 'success', text: 'SIGNAL://AYISHAT — Interactive Terminal v1.0' },
				{ type: 'output',  text: 'type  help  to see available commands' },
				{ type: 'output',  text: '' }
			]
		}
	]);
	let showMatrix = $state(false);

	function scrollToBottom() {
		if (outputEl) {
			outputEl.scrollTop = outputEl.scrollHeight;
		}
	}

	async function submit() {
		const cmd = input.trim();
		if (!cmd) return;

		history = [cmd, ...history.slice(0, 49)];
		historyIndex = -1;

		const result = handleCommand(cmd);

		if (cmd.toLowerCase() === 'clear') {
			output = [];
			input = '';
			await tick();
			return;
		}

		if (cmd.toLowerCase() === 'exit' || cmd.toLowerCase() === 'q') {
			output = [...output, { prompt: cmd, lines: result ?? [] }];
			input = '';
			setTimeout(() => terminalOpen.close(), 400);
			return;
		}

		if (cmd.toLowerCase() === 'github') {
			window.open('https://github.com/Debs-D', '_blank', 'noopener,noreferrer');
		} else if (cmd.toLowerCase() === 'linkedin') {
			window.open('https://www.linkedin.com/in/ayishat-odekunle-a7146527a/', '_blank', 'noopener,noreferrer');
		} else if (cmd.toLowerCase() === 'twitter') {
			window.open('https://x.com/Doa_debbie', '_blank', 'noopener,noreferrer');
		} else if (cmd.toLowerCase() === 'resume') {
			window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
		} else if (cmd.toLowerCase() === 'matrix') {
			showMatrix = true;
			setTimeout(() => { showMatrix = false; }, 3500);
		}

		output = [...output, { prompt: cmd, lines: result ?? [] }];
		input = '';
		await tick();
		scrollToBottom();
	}

	function tabComplete() {
		if (!input) return;
		const matches = allCommandNames.filter((c) => c.startsWith(input.toLowerCase()));
		if (matches.length === 1) input = matches[0];
	}

	function navigateHistory(dir: 1 | -1) {
		historyIndex = Math.max(-1, Math.min(history.length - 1, historyIndex + dir));
		input = historyIndex >= 0 ? history[historyIndex] : '';
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter')     { e.preventDefault(); submit(); }
		if (e.key === 'Tab')       { e.preventDefault(); tabComplete(); }
		if (e.key === 'ArrowUp')   { e.preventDefault(); navigateHistory(1); }
		if (e.key === 'ArrowDown') { e.preventDefault(); navigateHistory(-1); }
		if (e.key === 'Escape')    { terminalOpen.close(); }
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) terminalOpen.close();
	}

	// Focus input on open
	$effect(() => {
		if ($terminalOpen && inputEl) {
			tick().then(() => inputEl?.focus());
		}
	});

	// Focus trap
	function trapFocus(e: KeyboardEvent) {
		if (!$terminalOpen) return;
		if (e.key === 'Tab' && inputEl) {
			e.preventDefault();
			inputEl.focus();
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', trapFocus);
		}
	});
	onDestroy(() => {
		if (browser) window.removeEventListener('keydown', trapFocus);
	});
</script>

{#if $terminalOpen}
	<!-- Backdrop -->
	<div
		class="backdrop"
		role="presentation"
		onclick={onBackdropClick}
		transition:fly={{ y: 20, duration: 300 }}
	>
		<!-- Terminal window -->
		<div
			class="terminal"
			role="dialog"
			aria-label="Interactive terminal"
			aria-modal="true"
		>
			<!-- Title bar -->
			<div class="titlebar" aria-hidden="true">
				<div class="dots">
					<button class="dot red"    onclick={() => terminalOpen.close()} aria-label="Close terminal" title="Close"></button>
					<span   class="dot yellow"                                      aria-hidden="true"></span>
					<span   class="dot green"                                       aria-hidden="true"></span>
				</div>
				<span class="title">ayishat@portfolio — bash</span>
				<span class="spacer" aria-hidden="true"></span>
			</div>

			<!-- Output -->
			<div class="output" bind:this={outputEl} aria-live="polite" aria-label="Terminal output">
				{#each output as entry}
					{#if entry.prompt}
						<div class="line prompt-line">
							<span class="prompt-text" aria-label="Command: {entry.prompt}">
								<span class="prompt-host">ayishat@portfolio</span><span class="prompt-sep">:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span>
							</span>
							<span class="user-input">{entry.prompt}</span>
						</div>
					{/if}
					{#each entry.lines as line}
						<div class="line {line.type}">
							{#if line.href}
								<a href={line.href} target="_blank" rel="noopener noreferrer" class="term-link">{line.text}</a>
							{:else}
								{line.text}
							{/if}
						</div>
					{/each}
				{/each}
			</div>

			<!-- Input line -->
			<div class="input-row" aria-label="Command input">
				<span class="prompt-text" aria-hidden="true">
					<span class="prompt-host">ayishat@portfolio</span><span class="prompt-sep">:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span>
				</span>
				<input
					bind:this={inputEl}
					bind:value={input}
					onkeydown={onKeyDown}
					type="text"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					aria-label="Terminal command input"
					placeholder="type a command..."
				/>
			</div>
		</div>
	</div>
{/if}

<!-- Matrix Easter Egg -->
{#if showMatrix}
	<canvas id="matrix-canvas" aria-hidden="true"></canvas>
	<script>
		// Inline matrix rain — runs only when showMatrix triggers
		(function() {
			const canvas = document.getElementById('matrix-canvas');
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			const cols = Math.floor(canvas.width / 16);
			const drops = Array(cols).fill(1);
			const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
			let raf;
			function draw() {
				ctx.fillStyle = 'rgba(10,10,15,0.05)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = '#C16E3D';
				ctx.font = '14px JetBrains Mono, monospace';
				drops.forEach((y, i) => {
					const char = chars[Math.floor(Math.random() * chars.length)];
					ctx.fillText(char, i * 16, y * 16);
					if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
					drops[i]++;
				});
				raf = requestAnimationFrame(draw);
			}
			draw();
			setTimeout(() => { cancelAnimationFrame(raf); canvas.remove(); }, 3500);
		})();
	</script>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(10, 10, 15, 0.88);
		backdrop-filter: blur(8px);
		z-index: 5000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}

	.terminal {
		width: min(680px, 100%);
		height: min(520px, 80vh);
		background: #0D0D14;
		border: 1px solid var(--border-light);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow:
			0 0 0 1px rgba(0, 229, 255, 0.08),
			0 40px 80px rgba(0, 0, 0, 0.6);
	}

	.titlebar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		background: #0A0A12;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}

	.dots {
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
	}
	.dot.red    { background: #FF5F57; }
	.dot.yellow { background: #FFBD2E; }
	.dot.green  { background: #28C840; }
	.dot.yellow,
	.dot.green  { cursor: default; }

	.title {
		flex: 1;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}

	.spacer { width: 54px; }

	.output {
		flex: 1;
		overflow-y: auto;
		padding: 16px 20px 8px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.7;
		scrollbar-width: thin;
		scrollbar-color: var(--border-light) transparent;
	}

	.line {
		white-space: pre-wrap;
		word-break: break-all;
	}

	.line.output  { color: var(--text-primary); }
	.line.success { color: var(--accent); }
	.line.error   { color: #FF5F57; }
	.line.info    { color: var(--accent-purple); }
	.line.link    { color: var(--text-muted); }

	.term-link {
		color: var(--accent-dim);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.term-link:hover { color: var(--accent); }

	.prompt-line {
		display: flex;
		gap: 8px;
		align-items: baseline;
		margin-top: 4px;
	}

	.prompt-text {
		flex-shrink: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.prompt-host   { color: var(--accent); }
	.prompt-sep,
	.prompt-path   { color: var(--text-muted); }
	.prompt-dollar { color: var(--text-muted); margin-left: 2px; }

	.user-input { color: var(--text-primary); }

	.input-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px 14px;
		border-top: 1px solid var(--border);
		flex-shrink: 0;
	}

	.input-row input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-primary);
		caret-color: var(--accent);
	}

	.input-row input::placeholder {
		color: var(--text-dim);
	}

	#matrix-canvas {
		position: fixed;
		inset: 0;
		z-index: 4999;
		pointer-events: none;
	}
</style>
