<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import Titlebar from '$lib/components/titlebar/titlebar.svelte';
	import Popup from '$lib/components/popup/popup.svelte';
	import Infos from '$lib/components/alert/Infos.svelte';
	import Alert from '$lib/components/alert/Alert.svelte';
	import { addInfo } from '$lib/infoStore';

	let status = 'idle';
	let progress = 0;

	function checkUpdate() {
		window.electronAPI.checkUpdate();
	}

	function downloadUpdate() {
		window.electronAPI.downloadUpdate();
	}

	function installUpdate() {
		window.electronAPI.installUpdate();
	}

	onMount(() => {
		window.electronAPI.onUpdaterStatus((data) => {
			status = data.status;
		});

		window.electronAPI.onUpdaterProgress((data) => {
			progress = data.percent;
		});
	});

	onMount(() => {
		addInfo('Checking for updates...');
		checkUpdate();
		if (status == 'available') {
			addInfo('Update available. Downloading update.');
			try {
				window.electronAPI.downloadUpdate();
			} catch (error: unknown) {
				addInfo('Something went wrong. Error : ', error.message);
			} finally {
				window.electronAPI.prompt();
			}
		} else {
			addInfo('Version is up to date.');
		}
	});
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
