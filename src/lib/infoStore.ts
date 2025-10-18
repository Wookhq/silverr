import { writable } from 'svelte/store';

export type Info = { id: number; msg: string };

export const alerts = writable<Info[]>([]);
let counter = 0;

export function addInfo(msg: string) {
	counter += 1;
	alerts.update(a => [...a, { id: counter, msg }]);
}

export function removeInfo(id: number) {
	alerts.update(a => a.filter(a => a.id !== id));
}
