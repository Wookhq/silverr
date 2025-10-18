<script>
	import { fly, fade } from 'svelte/transition';
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type = 'success';
	export let message = 'This is an alert!';
	export let duration = 3000;

	let visible = false;

	onMount(() => {
		visible = true;
		const t = setTimeout(() => (visible = false), duration);
		return () => clearTimeout(t);
	});
</script>

{#if visible}
	<div
		role="alert"
		class={`alert alert-${type} fixed top-4 left-1/2 z-50 -translate-x-1/2 transform`}
		in:fly={{ y: -50, duration: 300 }}
		out:fade={{ duration: 300 }}
	>
		{#if type === 'success'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		{:else if type === 'error'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		{:else if type === 'warning'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01M4.93 19h14.14a1 1 0 00.86-1.5L13.87 4.5a1 1 0 00-1.74 0L4.07 17.5a1 1 0 00.86 1.5z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
				/>
			</svg>
		{/if}
		<span>{message}</span>
		
	</div>
{/if}
