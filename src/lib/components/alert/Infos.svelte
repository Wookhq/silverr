<script lang="ts">
	import Info from './Info.svelte';
	import { alerts, removeInfo } from '$lib/infoStore';
</script>

<div class="fixed top-12 left-4 z-50 flex flex-col gap-2">
	{#each $alerts as info (info.id)}
		<Info {info} on:close={() => removeInfo(info.id)} />
	{/each}
</div>
