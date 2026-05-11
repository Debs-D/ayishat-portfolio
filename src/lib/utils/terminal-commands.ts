import { projects } from '$lib/data/projects';
import { skillGroups } from '$lib/data/skills';
import { roles } from '$lib/data/experience';

export interface TerminalLine {
	type: 'output' | 'error' | 'success' | 'info' | 'link';
	text: string;
	href?: string;
}

export type CommandResult = TerminalLine[];

const COMMANDS: Record<string, () => CommandResult> = {
	help: () => [
		{ type: 'info',    text: 'Available commands:' },
		{ type: 'output',  text: '' },
		{ type: 'output',  text: '  whoami      — about ayishat' },
		{ type: 'output',  text: '  projects    — list all projects' },
		{ type: 'skills',  text: '  skills      — technical skills' } as TerminalLine,
		{ type: 'output',  text: '  experience  — work history' },
		{ type: 'output',  text: '  contact     — get in touch' },
		{ type: 'output',  text: '  github      — open GitHub profile' },
		{ type: 'output',  text: '  linkedin    — open LinkedIn profile' },
		{ type: 'output',  text: '  twitter     — open Twitter/X profile' },
		{ type: 'output',  text: '  resume      — download resume' },
		{ type: 'output',  text: '  clear        — clear terminal' },
		{ type: 'output',  text: '  matrix      — ???' },
		{ type: 'output',  text: '  exit / q    — close terminal' },
		{ type: 'output',  text: '' },
		{ type: 'info',    text: 'TIP: Use ↑/↓ to navigate command history' }
	],

	whoami: () => [
		{ type: 'success', text: 'AYISHAT ODEKUNLE' },
		{ type: 'output',  text: 'Frontend Developer · React & Next.js · Fintech Specialist' },
		{ type: 'output',  text: 'Lagos, Nigeria 🇳🇬' },
		{ type: 'output',  text: '' },
		{ type: 'output',  text: "I'm a frontend developer with 3 years of combined experience" },
		{ type: 'output',  text: 'building dynamic, accessible web applications. Specialized in' },
		{ type: 'output',  text: 'fintech platforms — from agency banking dashboards to POS systems' },
		{ type: 'output',  text: 'and KYC flows. My banking background at UBA and Access Bank gives' },
		{ type: 'output',  text: 'me a rare ability to translate complex financial workflows into' },
		{ type: 'output',  text: 'interfaces that real users trust.' },
		{ type: 'output',  text: '' },
		{ type: 'info',    text: 'Currently @ Baige Wallet — building fintech from Lagos' }
	],

	projects: () => [
		{ type: 'info',   text: `${projects.length} projects found:` },
		{ type: 'output', text: '' },
		...projects.flatMap((p) => [
			{ type: 'success' as const, text: `${p.number}. ${p.title}` },
			{ type: 'output'  as const, text: `   ${p.tagline}` },
			{ type: 'output'  as const, text: `   Stack: ${p.tech.slice(0, 3).join(', ')}` },
			...(p.live
				? [{ type: 'link' as const, text: `   → Live: ${p.live}`, href: p.live }]
				: []),
			...(p.github
				? [{ type: 'link' as const, text: `   → Code: ${p.github}`, href: p.github }]
				: []),
			{ type: 'output' as const, text: '' }
		])
	],

	skills: () => [
		{ type: 'info',   text: 'Technical skills by category:' },
		{ type: 'output', text: '' },
		...skillGroups.flatMap((g) => [
			{ type: 'success' as const, text: `${g.icon}  ${g.category}` },
			{ type: 'output'  as const, text: `   ${g.skills.join(' · ')}` },
			{ type: 'output'  as const, text: '' }
		])
	],

	experience: () => [
		{ type: 'info',   text: 'Work history:' },
		{ type: 'output', text: '' },
		...roles.map((r) => ({
			type: r.type === 'dev' ? ('success' as const) : ('output' as const),
			text: `${r.period.padEnd(26)} ${r.company} — ${r.role}`
		}))
	],

	contact: () => [
		{ type: 'info',   text: 'Get in touch:' },
		{ type: 'output', text: '' },
		{ type: 'link',   text: '  📧  aishat.odekunley@gmail.com',                                    href: 'mailto:aishat.odekunley@gmail.com' },
		{ type: 'link',   text: '  💼  linkedin.com/in/ayishat-odekunle-a7146527a',                    href: 'https://www.linkedin.com/in/ayishat-odekunle-a7146527a/' },
		{ type: 'link',   text: '  🐙  github.com/Debs-D',                                             href: 'https://github.com/Debs-D' },
		{ type: 'link',   text: '  🐦  x.com/Doa_debbie',                                              href: 'https://x.com/Doa_debbie' },
		{ type: 'output', text: '' },
		{ type: 'info',   text: 'Or scroll to the Contact section and send a message directly.' }
	],

	github:   () => [{ type: 'info', text: 'Opening GitHub...' }],
	linkedin: () => [{ type: 'info', text: 'Opening LinkedIn...' }],
	twitter:  () => [{ type: 'info', text: 'Opening Twitter/X...' }],
	resume:   () => [{ type: 'info', text: 'Downloading resume...' }],
	matrix:   () => [{ type: 'success', text: 'Initiating matrix sequence...' }],
	clear:    () => [],
	exit:     () => [{ type: 'info', text: 'Closing terminal...' }],
	q:        () => [{ type: 'info', text: 'Closing terminal...' }]
};

export function handleCommand(input: string): CommandResult | null {
	const cmd = input.trim().toLowerCase();
	if (!cmd) return null;
	const handler = COMMANDS[cmd];
	if (!handler) {
		return [
			{ type: 'error', text: `command not found: ${cmd}` },
			{ type: 'info',  text: "type 'help' for available commands" }
		];
	}
	return handler();
}

export const allCommandNames = Object.keys(COMMANDS);
