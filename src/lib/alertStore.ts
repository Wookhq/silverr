import { writable } from 'svelte/store';

export type Alert = {
	id: number;
	msg: string;
	type: 'success' | 'error' | 'warning' | 'info';
};

export const alerts = writable<Alert[]>([]);
let counter = 0;

export function addAlert(msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
	counter += 1;
	alerts.update((a) => [...a, { id: counter, msg, type }]);
}

export function removeAlert(id: number) {
	alerts.update((a) => a.filter((a) => a.id !== id));
}

