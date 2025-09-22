<script lang="ts">
	import { onMount } from 'svelte';
	import Mkcard from '$lib/components/marketplacecard/mkcard.svelte';

	type Content = { title: string; [key: string]: any };
	let Themecontents: Content[] = [];
	let Modcontents: Content[] = [];
	let loading = true;

	onMount(async () => {
		const Modsres = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Mods/content.json'
		);
		const Themesres = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Themes/content.json'
		);
		Themecontents = await Themesres.json();
		Modcontents = await Modsres.json();
		loading = false;
	});
</script>

<!-- fixed-size tabs container -->
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

	<input type="radio" name="my_tabs_6" class="tab" aria-label="Tab 3" />
	<div class="tab-content border-base-300 bg-base-100 p-6">Tab content 3</div>
</div>
