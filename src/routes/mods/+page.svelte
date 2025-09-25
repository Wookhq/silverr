<script lang="ts">
	let msg = '';

	async function openHome() {
		msg = await window.electronAPI.openPath(
			'~/.var/app/org.vinegarhq.Sober/data/sober/asset_overlay/'
		);
	}
	async function handleFontFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const reader = new FileReader();

			reader.onload = async () => {
				const arrayBuffer = reader.result as ArrayBuffer;
				msg = `Replacing font with: ${file.name}`;
				try {
					await window.electronAPI.replaceFileContents(arrayBuffer, file.name);
					msg = `Successfully replaced font with: ${file.name}`;
				} catch (error: any) {
					msg = `Error replacing font: ${error.message}`;
				}
			};
			reader.onerror = (error) => {
				msg = `Error reading file: ${error}`;
			};
			reader.readAsArrayBuffer(file);
		} else {
			msg = 'No file selected.';
		}
	}
</script>

<button class="btn btn-outline btn-primary" on:click={openHome}> Open Mod Folder </button>

<fieldset class="fieldset">
	<legend class="fieldset-legend">Custom Font</legend>
	<input type="file" class="file-input" id="fontFileInput" on:change={handleFontFileChange} />
	{#if msg}
		<p>{msg}</p>
	{/if}
</fieldset>
