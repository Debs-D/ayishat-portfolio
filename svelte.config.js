import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib'
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore missing static assets (resume.pdf, og-image.png) — user will add them
				if (path.startsWith('/images/') || path === '/resume.pdf') return;
				throw new Error(message);
			}
		}
	}
};

export default config;
