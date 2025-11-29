<script>
	import Fastflageditor from '$lib/components/fastflag/fflageditor/fastflageditor.svelte';
	import Presetbuttons from '$lib/components/fastflag/fastflagpreset/presetbuttons.svelte';
	let tab = 'presets';
	let editorFlags = [];

	async function loadFlags() {
		const result = await window.electronAPI.readJson(
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
	$: if (tab === 'editor') {
		loadFlags();
	}
</script>

<div class="min-h-screen w-full bg-base-100">
	<div class="sticky top-0 w-full bg-base-100 z-10 pt-[50px] pb-4 border-b border-base-300">
		<div class="container mx-auto px-4">
			<div class="tabs tabs-box justify-center w-full max-w-4xl mx-auto">
				<input
					type="radio"
					name="fastflag_tabs"
					class="tab"
					aria-label="Presets"
					value="presets"
					bind:group={tab}
					checked
				/>
				<input
					type="radio"
					name="fastflag_tabs"
					class="tab"
					aria-label="Fast Flag editor"
					value="editor"
					bind:group={tab}
				/>
				<input
					type="radio"
					name="fastflag_tabs"
					class="tab"
					aria-label="Tab 3"
					value="tab3"
					bind:group={tab}
				/>
			</div>
		</div>
	</div>

	<div class="w-full py-6">
		<div class="container mx-auto px-4 w-full">
			{#if tab === 'presets'}
				<Presetbuttons />
			{:else if tab === 'editor'}
				<Fastflageditor flags={editorFlags} class="mb-4" />
			{:else if tab === 'tab3'}
				<div class="p-4">:3</div>
			{/if}
		</div>
	</div>
</div>
