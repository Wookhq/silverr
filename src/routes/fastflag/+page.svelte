<script>
	import Fastflageditor from '$lib/components/fastflag/fflageditor/fastflageditor.svelte';
	import Presetbuttons from '$lib/components/fastflag/fastflagpreset/presetbuttons.svelte';
	let tab = 'tab1';
	let editorFlags = [];

	async function loadFlags() {
		const result = await window.electronAPI.readFile(
			'~/.var/app/org.vinegarhq.Sober/config/sober/config.json'
		);
		if (result.ok) {
			try {
				const config = JSON.parse(result.data);
				if (config.fflags) {
					editorFlags = Object.entries(config.fflags).map(([key, val], i) => ({
						id: i + 1,
						name: key,
						job: String(val),
						fav: '-'
					}));
				}
			} catch (e) {
				console.error('invalid JSON:', e);
			}
		} else {
			console.error('failed to read file:', result.error);
		}
	}
	$: if (tab === 'Fast flag editor') {
		loadFlags();
	}
</script>

<div class="flex min-h-screen flex-col items-start">
	<!-- tabs pinned top-left with custom offset -->
	<div class="mt-[50px] ml-[220px] tabs tabs-box">
		<input
			type="radio"
			name="my_tabs_1"
			class="tab"
			aria-label="Presets"
			value="tab1"
			bind:group={tab}
			checked
		/>
		<input
			type="radio"
			name="Fast flag editor"
			class="tab"
			aria-label="Fast flag editor"
			value="Fast flag editor"
			bind:group={tab}
		/>
		<input
			type="radio"
			name="my_tabs_1"
			class="tab"
			aria-label="Tab 3"
			value="tab3"
			bind:group={tab}
		/>
	</div>

	<!-- centered content -->
	<div class="mb-4 flex w-full justify-center">
		{#if tab === 'tab1'}
			<Presetbuttons />
		{:else if tab === 'Fast flag editor'}
			<Fastflageditor flags={editorFlags} class="mb-4" />
		{:else if tab === 'tab3'}
			<div class="p-4">:3</div>
		{/if}
	</div>
</div>
