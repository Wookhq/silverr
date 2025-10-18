<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import Titlebar from '$lib/components/titlebar/titlebar.svelte';
	import Popup from '$lib/components/popup/popup.svelte';
	import Infos from '$lib/components/alert/Infos.svelte';
	import Alert from '$lib/components/alert/Alert.svelte';

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-theme="halloween">
	<Titlebar />
	<div class="pt-10">
		<Sidebar>
			<Alert />
			<Infos />
			<slot />
			<Popup />
		</Sidebar>
	</div>
</div>
