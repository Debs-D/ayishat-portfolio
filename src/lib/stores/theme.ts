import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

function createThemeStore() {
	const initial: Theme = browser
		? ((localStorage.getItem('theme') as Theme) ?? 'dark')
		: 'dark';

	const { subscribe, set, update } = writable<Theme>(initial);

	return {
		subscribe,
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.setAttribute('data-theme', theme);
			}
			set(theme);
		},
		toggle: () => {
			update((current) => {
				const next: Theme = current === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem('theme', next);
					document.documentElement.setAttribute('data-theme', next);
				}
				return next;
			});
		},
		init: () => {
			if (browser) {
				const saved = (localStorage.getItem('theme') as Theme) ?? 'dark';
				document.documentElement.setAttribute('data-theme', saved);
				set(saved);
			}
		}
	};
}

export const theme = createThemeStore();
