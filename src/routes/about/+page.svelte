<script lang="ts">
	function ExternalLink(link: string): void {
		window.electronAPI.openExternalLink(link);
	}
</script>

<div class="flex flex-col items-center justify-center p-8">
	<h1 class="text-4xl font-bold">About</h1>

	<p class="mt-4 text-center">
		Likely a lution clone but more fancy, using Svelte & Electron, made possible with
		<button
			on:click={ExternalLink('https://sober.vinegarhq.org/')}
			class="text-blue-500 hover:underline">Sober</button
		>.
	</p>

	<p class="mt-4 text-center">
		You can find the source code on
		<button
			on:click={ExternalLink('https://github.com/wookhq/silverr')}
			class="text-blue-500 hover:underline">GitHub</button
		>,
		<b>consider giving us a star! ⭐</b>
	</p>

	<p class="mt-4 text-center">
		<span
			class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text font-bold text-transparent"
		>
			Thank you for using Silverr! ❤️
		</span>
	</p>

	<div class="mt-8">
		<button on:click={ExternalLink('https://discord.gg/BXT7FYjTBa')}>
			<img
				src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white"
				alt="Discord"
			/>
		</button>
	</div>
</div>
