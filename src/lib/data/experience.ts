export interface Role {
	company: string;
	role: string;
	period: string;
	location: 'Remote' | 'On-site';
	type: 'dev' | 'banking';
	highlights: string[];
	tech?: string[];
	url?: string;
}

export interface Education {
	degree: string;
	institution: string;
	period: string;
}

export interface Certification {
	name: string;
	year: string;
}

export const roles: Role[] = [
	{
		company: 'Baige Wallet',
		role: 'Frontend Developer',
		period: 'Oct 2025 — Present',
		location: 'Remote',
		type: 'dev',
		highlights: [
			'Built fintech platforms from scratch — agency banking dashboards, merchant POS interfaces, and agent portals',
			'Integrated multiple payment gateways with PCI-compliant data handling, achieving 95%+ mobile compatibility',
			'Partnered with backend engineers to architect RESTful APIs, cutting average API response times by 40%'
		],
		tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
	},
	{
		company: 'Carlofty',
		role: 'Frontend Developer',
		period: 'Aug 2025 — Jan 2026',
		location: 'Remote',
		type: 'dev',
		url: 'https://www.carlofty.com/',
		highlights: [
			'Built full user and admin platforms for an automotive e-commerce marketplace (carlofty.com)',
			'Engineered a multi-step KYC onboarding flow, reducing drop-off through clear UX and inline validation',
			'Developed automated invoice generation, eliminating manual processing and cutting turnaround by 70%'
		],
		tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
	},
	{
		company: 'Ufone',
		role: 'Frontend Developer',
		period: 'Nov 2024 — Jul 2025',
		location: 'Remote',
		type: 'dev',
		highlights: [
			'Designed and implemented responsive, accessible UI components for the Ufone main website and Ufone Store',
			'Built 15+ reusable components adopted across multiple product pages, reducing per-feature development time',
			'Collaborated with senior engineers to deliver pixel-perfect Figma implementations'
		],
		tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
	},
	{
		company: 'BITS LIMITED',
		role: 'Frontend Developer',
		period: 'Feb 2025 — Apr 2025',
		location: 'Remote',
		type: 'dev',
		highlights: [
			'Led frontend modernization of the Luminevnt v2 SaaS product using Next.js and Zustand',
			'Architected a reusable component library that standardized UI and measurably improved team delivery speed',
			'Reduced JavaScript bundle size through targeted code-splitting and component restructuring'
		],
		tech: ['Next.js', 'TypeScript', 'Zustand', 'Tailwind CSS']
	},
	{
		company: 'United Bank for Africa (UBA)',
		role: 'Customer Experience & Operations Specialist',
		period: '2022 — 2024',
		location: 'On-site',
		type: 'banking',
		highlights: [
			'Handled 50+ daily customer inquiries, developing deep empathy for financial UX pain points',
			'Identified recurring process bottlenecks and collaborated cross-functionally to reduce resolution time',
			'Maintained strict adherence to banking regulations, data security, and compliance protocols'
		]
	},
	{
		company: 'Access Bank',
		role: 'Customer Service Officer',
		period: '2021 — 2022',
		location: 'On-site',
		type: 'banking',
		highlights: [
			'Served as primary contact for 100+ daily customer inquiries on account and digital banking issues',
			'Onboarded and managed 200+ new accounts with full documentation and regulatory compliance',
			'Guided customers on digital banking platforms, directly improving mobile banking adoption'
		]
	}
];

export const education: Education[] = [
	{
		degree: 'B.Sc. Mass Communication',
		institution: 'National Open University of Nigeria',
		period: 'Graduated April 2024'
	},
	{
		degree: 'National Diploma — Mass Communication',
		institution: 'Yaba College of Technology, Lagos',
		period: 'Jan 2018 — Jul 2020'
	}
];

export const certifications: Certification[] = [
	{ name: 'ALX Frontend Development', year: '2024' },
	{ name: 'HackerRank JavaScript', year: '2024' },
	{ name: 'HackerRank CSS', year: '2024' },
	{ name: 'HackerRank Problem Solving', year: '2024' },
	{ name: 'Principles of Secure Coding', year: '2024' },
	{ name: 'Desktop Publishing — Merit', year: '2017' }
];
