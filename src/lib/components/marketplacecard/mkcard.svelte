<script lang="ts">
	import { downloadAsset } from "$lib/helpers/downloadMarketplace"

	export let content: {
		title: string
		body: string
		image: string
		link?: string
		type?: string
	}

	async function handleInstall() {
		if (content.link) {
			await downloadAsset(content.link)
		} else {
			console.warn("no link for this content")
		}
	}
</script>

<div class="card card-side max-h-36 w-full bg-base-100 shadow-sm">
	<figure class="w-28">
		<img src={content.image} alt={content.title} class="h-full w-full object-cover" />
	</figure>
	<div class="card-body gap-2 p-3">
		<h2 class="card-title text-sm leading-tight">{content.title}</h2>
		<p class="line-clamp-2 text-xs">{content.body}</p>
		<div class="card-actions justify-end">
			<button class="btn btn-soft btn-xs btn-primary" on:click={handleInstall}>
				install
			</button>
		</div>
	</div>
</div>
