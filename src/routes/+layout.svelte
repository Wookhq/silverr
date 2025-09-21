<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import Titlebar from '$lib/components/titlebar/titlebar.svelte';
	import Popup from '$lib/components/popup/popup.svelte';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-theme="night">
	<Titlebar />
	<Sidebar>
		<slot />
		<Popup />
	</Sidebar>
</div>
