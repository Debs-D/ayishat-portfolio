import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib'
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (path.startsWith('/images/')) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
