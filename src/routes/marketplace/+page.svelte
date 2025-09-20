<script lang="ts">
	import { onMount } from 'svelte';
	import Mkcard from '$lib/components/marketplacecard/mkcard.svelte';

	let contents: any[] = [];
	let loading = true;

	onMount(async () => {
		const res = await fetch(
			'https://raw.githubusercontent.com/Wookhq/Lution-Marketplace/refs/heads/main/Assets/Themes/content.json'
		);
		contents = await res.json();
		loading = false;
	});
</script>

<div class="tabs tabs-box">
	<input type="radio" name="my_tabs_6" class="tab" aria-label="Marketplace" checked="checked" />
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
				{#each contents as content (content.title)}
					<Mkcard {content} />
				{/each}
			{/if}
		</div>
	</div>

	<input type="radio" name="my_tabs_6" class="tab" aria-label="Tab 2" />
	<div class="tab-content border-base-300 bg-base-100 p-6">Tab content 2</div>

	<input type="radio" name="my_tabs_6" class="tab" aria-label="Tab 3" />
	<div class="tab-content border-base-300 bg-base-100 p-6">Tab content 3</div>
</div>
