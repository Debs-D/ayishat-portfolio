import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createBootStore() {
	const alreadyBooted = browser ? sessionStorage.getItem('booted') === '1' : false;
	const { subscribe, set } = writable(alreadyBooted);

	return {
		subscribe,
		complete: () => {
			if (browser) sessionStorage.setItem('booted', '1');
			set(true);
		}
	};
}

export const bootComplete = createBootStore();
