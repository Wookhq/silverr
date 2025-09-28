<script lang="ts">
	async function createCrossoverFile() {
		const dir = await window.electronAPI.openDirectoryDialog();
		if (dir) {
			await window.electronAPI.crossoverCreateAndPack(dir);
		}
	}

	async function loadCrossoverFile() {
		const crossoverFile = await window.electronAPI.openDialog();
		if (crossoverFile) {
			await window.electronAPI.crossoverUnpackAndCrossover(crossoverFile);
		}
	}
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-bold">Crossover</h1>

	<div class="mb-4">
		<button on:click={createCrossoverFile} class="btn btn-primary"
			>Create and Pack Crossover Project</button
		>
	</div>

	<div class="mb-4">
		<button on:click={loadCrossoverFile} class="btn btn-primary">Load .crossover file</button>
	</div>
</div>
