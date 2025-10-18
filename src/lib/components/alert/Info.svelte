<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import  CircleX  from 'lucide-svelte/icons/circle-x';
	export let info: { id: number; msg: string };

	const dispatch = createEventDispatcher();
	let show = true;

	function close() {
		show = false;
		dispatch('close'); 
	}
</script>

{#if show}
	<div
		role="alert"
		class="alert flex items-center gap-2 rounded-lg alert-info p-3 shadow-md"
		in:fly={{ x: 100, duration: 300 }}
		out:fade={{ duration: 200 }}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-current"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>

		<span contenteditable="true" bind:innerText={info.msg} class="rounded-sm px-1 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"></span>

		<button on:click={close}><CircleX /></button>
	</div>
{/if}
