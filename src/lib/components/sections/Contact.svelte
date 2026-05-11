<script lang="ts">
	import { browser } from '$app/environment';
	import { PUBLIC_FORMSPREE_ENDPOINT } from '$env/static/public';
	import SectionLabel from '$lib/components/ui/SectionLabel.svelte';
	import MagneticButton from '$lib/components/ui/MagneticButton.svelte';

	let name     = $state('');
	let email    = $state('');
	let subject  = $state('');
	let message  = $state('');
	let status   = $state<'idle' | 'sending' | 'success' | 'error'>('idle');
	let errors   = $state<Record<string, string>>({});

	function validate() {
		const e: Record<string, string> = {};
		if (!name.trim())                     e.name    = 'Name is required';
		if (!email.trim())                    e.email   = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Invalid email address';
		if (!subject.trim())                  e.subject = 'Subject is required';
		if (!message.trim())                  e.message = 'Message is required';
		else if (message.trim().length < 10)  e.message = 'Message must be at least 10 characters';
		return e;
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errors = validate();
		if (Object.keys(errors).length > 0) return;

		status = 'sending';

		try {
			const endpoint = PUBLIC_FORMSPREE_ENDPOINT;
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
				body: JSON.stringify({
					name:    name.trim(),
					email:   email.trim(),
					subject: subject.trim(),
					message: message.trim()
				})
			});

			if (res.ok) {
				status = 'success';
				name = email = subject = message = '';
			} else {
				status = 'error';
			}
		} catch {
			status = 'error';
		}
	}

	function resetStatus() {
		if (status !== 'idle') status = 'idle';
	}
</script>

<section id="contact" class="section contact" aria-label="Contact">
	<div class="contact-inner">
		<div class="contact-header">
			<SectionLabel number="05" title="Contact" />
			<h2 class="contact-title">
				LET'S BUILD<br/>
				<span class="stroke">SOMETHING.</span>
			</h2>
			<p class="contact-sub">
				Available for remote roles, freelance projects, and interesting problems.
			</p>
		</div>

		<div class="contact-body">
			<!-- Form -->
			<div class="form-wrap">
				{#if status === 'success'}
					<div class="terminal-feedback success" role="status" aria-live="polite">
						<p><span class="fb-prompt">$</span> <span class="fb-cmd">send --message</span></p>
						<p class="fb-output success-text">&gt; MESSAGE_SENT: true ✓</p>
						<p class="fb-output muted">&gt; Thank you! I'll get back to you soon.</p>
						<button class="fb-reset" onclick={() => { status = 'idle'; }}>
							Send another message →
						</button>
					</div>
				{:else if status === 'error'}
					<div class="terminal-feedback error" role="alert" aria-live="assertive">
						<p><span class="fb-prompt">$</span> <span class="fb-cmd">send --message</span></p>
						<p class="fb-output error-text">&gt; ERROR: TRANSMISSION_FAILED</p>
						<p class="fb-output muted">&gt; Please try again or email directly.</p>
						<a href="mailto:aishat.odekunley@gmail.com" class="fb-reset">
							Email directly →
						</a>
					</div>
				{:else}
					<form onsubmit={submit} novalidate aria-label="Contact form">
						<!-- Name -->
						<div class="field" class:has-error={errors.name}>
							<label for="contact-name" class="label">Name</label>
							<input
								id="contact-name"
								type="text"
								bind:value={name}
								oninput={resetStatus}
								placeholder="Your name"
								autocomplete="name"
								aria-describedby={errors.name ? 'name-error' : undefined}
								aria-invalid={!!errors.name}
								required
							/>
							{#if errors.name}
								<span id="name-error" class="field-error" role="alert">{errors.name}</span>
							{/if}
						</div>

						<!-- Email -->
						<div class="field" class:has-error={errors.email}>
							<label for="contact-email" class="label">Email</label>
							<input
								id="contact-email"
								type="email"
								bind:value={email}
								oninput={resetStatus}
								placeholder="your@email.com"
								autocomplete="email"
								aria-describedby={errors.email ? 'email-error' : undefined}
								aria-invalid={!!errors.email}
								required
							/>
							{#if errors.email}
								<span id="email-error" class="field-error" role="alert">{errors.email}</span>
							{/if}
						</div>

						<!-- Subject -->
						<div class="field" class:has-error={errors.subject}>
							<label for="contact-subject" class="label">Subject</label>
							<input
								id="contact-subject"
								type="text"
								bind:value={subject}
								oninput={resetStatus}
								placeholder="What's this about?"
								aria-describedby={errors.subject ? 'subject-error' : undefined}
								aria-invalid={!!errors.subject}
								required
							/>
							{#if errors.subject}
								<span id="subject-error" class="field-error" role="alert">{errors.subject}</span>
							{/if}
						</div>

						<!-- Message -->
						<div class="field" class:has-error={errors.message}>
							<label for="contact-message" class="label">Message</label>
							<textarea
								id="contact-message"
								bind:value={message}
								oninput={resetStatus}
								placeholder="Tell me about your project..."
								rows="5"
								aria-describedby={errors.message ? 'message-error' : undefined}
								aria-invalid={!!errors.message}
								required
							></textarea>
							{#if errors.message}
								<span id="message-error" class="field-error" role="alert">{errors.message}</span>
							{/if}
						</div>

						<MagneticButton
							type="submit"
							variant="primary"
							disabled={status === 'sending'}
							ariaLabel={status === 'sending' ? 'Sending message...' : 'Send message'}
						>
							{#if status === 'sending'}
								<span class="spinner" aria-hidden="true"></span>
								SENDING...
							{:else}
								SEND MESSAGE →
							{/if}
						</MagneticButton>
					</form>
				{/if}
			</div>

			<!-- Right info -->
			<div class="contact-info">
				<div class="info-item">
					<span class="info-label">EMAIL</span>
					<a href="mailto:aishat.odekunley@gmail.com" class="info-link">
						aishat.odekunley@gmail.com
					</a>
				</div>

				<div class="info-divider" aria-hidden="true"></div>

				<div class="info-item">
					<span class="info-label">ELSEWHERE</span>
					<div class="social-links">
						<a href="https://github.com/Debs-D" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
							GitHub
						</a>
						<a href="https://www.linkedin.com/in/ayishat-odekunle-a7146527a/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
							LinkedIn
						</a>
						<a href="https://x.com/Doa_debbie" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter/X">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
							Twitter/X
						</a>
					</div>
				</div>

				<div class="info-divider" aria-hidden="true"></div>

				<div class="info-item">
					<span class="info-label">RESUME</span>
					<a href="/resume.pdf" target="_blank" rel="noopener noreferrer" class="resume-dl" aria-label="Download resume PDF">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
						Download PDF
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.contact { background: var(--bg-secondary); }

	.contact-inner { max-width: 1100px; margin: 0 auto; }

	.contact-header { margin-bottom: clamp(40px, 5vw, 64px); }

	.contact-title {
		font-family: var(--font-display);
		font-size: clamp(2.8rem, 7vw, 5.5rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--text-primary);
		margin-bottom: 16px;
	}

	.stroke {
		-webkit-text-stroke: 1px var(--text-primary);
		color: transparent;
	}

	.contact-sub {
		font-size: 1rem;
		color: var(--text-muted);
		max-width: 400px;
		line-height: 1.7;
	}

	.contact-body {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 64px;
		align-items: start;
	}

	/* Form */
	form { display: flex; flex-direction: column; gap: 20px; }

	.field { display: flex; flex-direction: column; gap: 6px; }

	.label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	input, textarea {
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 12px 16px;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-primary);
		outline: none;
		transition: border-color var(--transition-base), box-shadow var(--transition-base);
		resize: none;
		width: 100%;
	}

	input::placeholder, textarea::placeholder { color: var(--text-dim); }

	input:focus, textarea:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent);
	}

	.has-error input,
	.has-error textarea {
		border-color: #EF4444;
	}

	.field-error {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: #EF4444;
	}

	/* Terminal feedback */
	.terminal-feedback {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		background: var(--bg-tertiary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		line-height: 1.6;
	}

	.terminal-feedback.success { border-color: color-mix(in srgb, var(--accent-green) 30%, transparent); }
	.terminal-feedback.error   { border-color: color-mix(in srgb, #EF4444 30%, transparent); }

	.fb-prompt  { color: var(--accent); }
	.fb-cmd     { color: var(--text-primary); }
	.fb-output  { color: var(--text-muted); padding-left: 4px; }
	.success-text { color: var(--accent-green); }
	.error-text   { color: #EF4444; }
	.muted        { color: var(--text-dim); }

	.fb-reset {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--accent);
		background: none;
		border: none;
		cursor: none;
		padding: 0;
		margin-top: 8px;
		text-decoration: none;
		transition: opacity var(--transition-base);
	}
	.fb-reset:hover { opacity: 0.7; }

	/* Spinner */
	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid color-mix(in srgb, var(--bg-primary) 40%, transparent);
		border-top-color: var(--bg-primary);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		display: inline-block;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	/* Right info */
	.contact-info { display: flex; flex-direction: column; gap: 24px; padding-top: 8px; }

	.info-item { display: flex; flex-direction: column; gap: 10px; }

	.info-label {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		color: var(--text-dim);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.info-link, .social-link, .resume-dl {
		color: var(--text-muted);
		text-decoration: none;
		transition: color var(--transition-base);
		font-size: 0.875rem;
	}
	.info-link:hover, .social-link:hover, .resume-dl:hover { color: var(--accent); }

	.social-links { display: flex; flex-direction: column; gap: 8px; }

	.social-link {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.resume-dl {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.info-divider {
		width: 40px;
		height: 1px;
		background: var(--border);
	}

	@media (max-width: 768px) {
		.contact-body { grid-template-columns: 1fr; }
		.contact-info { order: -1; flex-direction: row; flex-wrap: wrap; gap: 24px; }
		.info-divider { display: none; }
	}
</style>
