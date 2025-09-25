<!--
<script lang="ts">
	import { onMount } from 'svelte';
	import Mkcard from '$lib/components/marketplacecard/mkcard.svelte';

	type Content = { title: string; body: string; image: string; link?: string; type?: string;[key: string]: any };
	let Themecontents: Content[] = [];
	let Modcontents: Content[] = [];
	let downloadedAssets: string[] = [];
	let loading = true;

	onMount(async () => {
		const modsContentRes = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Mods/content.json'
		);
		const modsInfoRes = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Mods/info.json'
		);
		const themesContentRes = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Themes/content.json'
		);
		const themesInfoRes = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Themes/info.json'
		);

		const localAssetsRes = await window.electronAPI.getLocalAssets();

		const modsContent = await modsContentRes.json();
		const modsInfo = await modsInfoRes.json();
		const themesContent = await themesContentRes.json();
		const themesInfo = await themesInfoRes.json();

		if (localAssetsRes.ok) {
			downloadedAssets = localAssetsRes.files;
		}

		const modsPathMap = new Map(modsInfo.map((i: any) => [i.name, i.path]));
		const themesPathMap = new Map(themesInfo.map((i: any) => [i.name, i.path]));

		Modcontents = modsContent.map((content: any) => ({
			...content,
			link: modsPathMap.get(content.title),
			type: 'Mods'
		}));

		Themecontents = themesContent.map((content: any) => ({
			...content,
			link: themesPathMap.get(content.title),
			type: 'Themes'
		}));

		loading = false;
	});

	async function handleDelete(asset: string) {
		const result = await window.electronAPI.deleteLocalAsset(asset);
		if (result.ok) {
			downloadedAssets = downloadedAssets.filter((a) => a !== asset);
		} else {
			console.error('Failed to delete asset:', result.error);
		}
	}

	async function handleApply(asset: string) {
		const result = await window.electronAPI.applyAsset(asset);
		if (!result.ok) {
			console.error('Failed to apply asset:', result.error);
		}
	}

	async function openDownloadsFolder() {
		const path = await window.electronAPI.getLocalAssetsPath();
		window.electronAPI.openPath(path);
	}
</script>

<div class="mx-auto tabs h-160 w-full max-w-[1200px] tabs-box">
	<input type="radio" name="my_tabs_6" class="tab" aria-label="Themes" checked />
	<div class="tab-content border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 font-bold">Themes</h2>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			{#if loading}
				{#each Array(6) as _}
					<div class="flex w-52 flex-col gap-4">
						<div class="h-32 w-full skeleton"></div>
						<div class="h-4 w-28 skeleton"></div>
						<div class="h-4 w-full skeleton"></div>
						<div class="h-4 w-full skeleton"></div>
					</div>
				{/each}
			{:else}
				{#each Themecontents as content (content.title)}
					<Mkcard {content} />
				{/each}
			{/if}
		</div>
	</div>

	<input type="radio" name="my_tabs_6" class="tab" aria-label="Mods" />
	<div class="tab-content border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 font-bold">Mods</h2>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			{#if loading}
				{#each Array(6) as _}
					<div class="flex w-52 flex-col gap-4">
						<div class="h-32 w-full skeleton"></div>
						<div class="h-4 w-28 skeleton"></div>
						<div class="h-4 w-full skeleton"></div>
						<div class="h-4 w-full skeleton"></div>
					</div>
				{/each}
			{:else}
				{#each Modcontents as content (content.title)}
					<Mkcard {content} />
				{/each}
			{/if}
		</div>
	</div>

	<input type="radio" name="my_tabs_6" class="tab" aria-label="Downloads" />
	<div class="tab-content border-base-300 bg-base-100 p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-bold">Downloads</h2>
			<button class="btn btn-ghost btn-sm" on:click={openDownloadsFolder}>Open Folder</button>
		</div>
		<div class="overflow-x-auto rounded-box border border-base-content/10">
			<table class="table table-zebra">
				<thead class="bg-base-200">
					<tr>
						<th>Name</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
										<tbody>
											{#each downloadedAssets as asset}
												<tr>
													<td>{asset}</td>
													<td class="text-right">
														<button class="btn btn-ghost btn-xs" on:click={() => handleApply(asset)}>Apply</button>
														<button class="btn text-error btn-ghost btn-xs" on:click={() => handleDelete(asset)}>Remove</button>
													</td>
												</tr>
											{/each}
										</tbody>			</table>
		</div>
	</div>
</div>
-->
