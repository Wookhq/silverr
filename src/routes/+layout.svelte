<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import Popup from "$lib/components/popup/popup.svelte";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-theme="night">
	<Sidebar>
		<slot />
		<Popup />
	</Sidebar>
</div>
