export interface SkillGroup {
	category: string;
	icon: string;
	skills: string[];
	accent: string;
}

export const skillGroups: SkillGroup[] = [
	{
		category: 'Languages & Frameworks',
		icon: '⚡',
		skills: ['React', 'Next.js', 'SvelteKit', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Node.js', 'Ionic'],
		accent: '#00E5FF'
	},
	{
		category: 'Styling & UI',
		icon: '🎨',
		skills: ['Tailwind CSS', 'Responsive Design', 'Mobile-First', 'Figma', 'CSS Animations', 'GSAP', 'SCSS'],
		accent: '#A855F7'
	},
	{
		category: 'State & APIs',
		icon: '🔗',
		skills: ['Zustand', 'REST APIs', 'GraphQL', 'WebSockets', 'React Query', 'Third-Party Integrations'],
		accent: '#10B981'
	},
	{
		category: 'Tools & DevOps',
		icon: '🛠',
		skills: ['Git & GitHub', 'Webpack', 'Docker', 'Azure Functions', 'CI/CD', 'Jira', 'Confluence', 'Vercel', 'Netlify'],
		accent: '#F59E0B'
	},
	{
		category: 'Testing & Quality',
		icon: '✅',
		skills: ['Jest', 'Cypress', 'Karma / Jasmine', 'Unit Testing', 'Cross-Browser Compatibility', 'Performance Optimization'],
		accent: '#EF4444'
	},
	{
		category: 'Domain Expertise',
		icon: '🏦',
		skills: ['Fintech Platforms', 'Banking Operations', 'Payment Gateways', 'KYC Flows', 'PCI Compliance', 'Agency Banking', 'POS Systems'],
		accent: '#3B82F6'
	}
];

export const currentlyLearning = ['Three.js', 'WebGL', 'Advanced Animations', 'SvelteKit SSR', 'Web Performance'];
