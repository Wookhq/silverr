<script>
	import { createEventDispatcher } from 'svelte';
	export let title = 'Are you sure?';
	export let content = 'This cannot be undone!';

	const dispatch = createEventDispatcher();
	let dialogEl;

	export function open() {
		dialogEl.showModal();
	}

	export function close() {
		dialogEl.close();
		dispatch('close');
	}

	function yes() {
		dispatch('yes');
		close();
	}

	function no() {
		dispatch('no');
		close();
	}
</script>

<dialog bind:this={dialogEl} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="text-lg font-bold">{title}</h3>
		<p class="py-4">{content}</p>
		<div class="modal-action">
			<button class="btn btn-error" on:click={yes}>Yes</button>
			<button class="btn btn-outline" on:click={no}>No</button>
		</div>
	</div>
</dialog>
