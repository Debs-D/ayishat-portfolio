export interface Project {
	id: string;
	number: string;
	title: string;
	tagline: string;
	description: string;
	tech: string[];
	live?: string;
	github?: string;
	image?: string;
	accent: string;
	featured: boolean;
}

export const projects: Project[] = [
	{
		id: 'ai-summarizer',
		number: '01',
		title: 'AI Page Summarizer',
		tagline: 'Distill any webpage into its essence.',
		description:
			'A browser-based AI tool that fetches any public URL and returns a clean, structured summary using a large language model. Built to prove that AI utility tools can be fast, lean, and zero-dependency on the frontend.',
		tech: ['JavaScript', 'AI/LLM API', 'HTML5', 'CSS3'],
		live: undefined,
		github: 'https://github.com/Debs-D/ai-page-summarizer',
		accent: '#D4895A',
		featured: true
	},
	{
		id: 'whisperbox',
		number: '02',
		title: 'WhisperBox',
		tagline: 'End-to-end encrypted messaging. Zero trust.',
		description:
			'A secure messaging app where private keys never leave the browser. Built on the Web Crypto API — all encryption and decryption happens client-side. Supports JWT auth, user search, and wrapped key storage so only you can read your messages.',
		tech: ['JavaScript', 'Web Crypto API', 'JWT', 'REST API', 'Vercel'],
		live: 'https://whisperbox-jet.vercel.app',
		github: undefined,
		accent: '#C47A8A',
		featured: true
	},
	{
		id: 'ufuon-store',
		number: '03',
		title: 'Ufuon STEM Store',
		tagline: "E-commerce for Africa's next generation of makers.",
		description:
			'Full storefront for Ufuon — a platform empowering African students with electronics and IoT components. Complete auth flows, shopping cart, Paystack payment integration, product filtering, and dedicated product pages.',
		tech: ['React', 'Tailwind CSS', 'Paystack', 'REST API'],
		live: 'https://store-front-bice.vercel.app',
		github: 'https://github.com/Debs-D/store-front',
		accent: '#7BAE8A',
		featured: true
	},
	{
		id: 'hng-ticket',
		number: '04',
		title: 'HNG Ticket Dashboard',
		tagline: 'Support ticket management, done right.',
		description:
			'A responsive ticket management system letting users create, view, and filter support tickets. Features complete auth flow, real-time state management, and a clean UX that works seamlessly across desktop and mobile.',
		tech: ['React', 'Tailwind CSS', 'JavaScript', 'REST API'],
		live: 'https://hngtticket-app.netlify.app',
		github: 'https://github.com/Debs-D/Ticket-App',
		accent: '#E8C17A',
		featured: false
	},
	{
		id: 'dev-blog',
		number: '05',
		title: 'Dev Blog',
		tagline: 'A full-stack CRUD platform with type-safe forms.',
		description:
			'Modern blog platform with full CRUD, Zod schema validation, react-hook-form, and light/dark theming. Users create posts with title, content, author, and image — rendered dynamically. Built with Next.js App Router and TypeScript.',
		tech: ['Next.js', 'TypeScript', 'Zod', 'react-hook-form', 'Tailwind CSS'],
		live: 'https://my-blog-indol-alpha.vercel.app',
		github: 'https://github.com/Debs-D/MyBlog',
		accent: '#B87870',
		featured: false
	},
	{
		id: 'movie-box',
		number: '06',
		title: 'Movie Box',
		tagline: '73% faster load times through smart API caching.',
		description:
			'Film discovery app powered by the TMDB API — advanced search, filtering, and user watchlists. Optimized API request handling reduced average load time from 3s to under 800ms. Currently being rebuilt with Next.js SSR.',
		tech: ['React', 'TMDB API', 'JavaScript', 'CSS3'],
		live: 'https://moviebox-blue.vercel.app',
		github: 'https://github.com/Debs-D/moviebox',
		accent: '#8AABBF',
		featured: false
	}
];
