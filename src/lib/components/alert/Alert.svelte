<script lang="ts">
	import Alerts from './Alerts.svelte';
	import { alerts, removeAlert } from '$lib/alertStore'; // or wherever your store is
</script>

<div class="fixed top-12 left-4 flex flex-col gap-2 z-50">
	{#each $alerts as info (info.id)}
		<Alerts message={info.msg} type={info.type} on:close={() => removeAlert(info.id)} />
	{/each}
</div>

