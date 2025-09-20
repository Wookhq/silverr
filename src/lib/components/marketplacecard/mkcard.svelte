<script lang="ts">
	export let content: {
		title: string;
		description: string;
		image: string;
		link?: string;
	};
</script>

<div class="card card-side max-h-36 w-full bg-base-100 shadow-sm">
	<figure class="w-28">
		<img src={content.image} alt={content.title} class="h-full w-full object-cover" />
	</figure>
	<div class="card-body gap-2 p-3">
		<h2 class="card-title text-sm leading-tight">{content.title}</h2>
		<p class="line-clamp-2 text-xs">{content.description}</p>
		<div class="card-actions justify-end">
			{#if content.link}
				<a class="btn btn-soft btn-xs btn-primary" href={content.link} target="_blank">install</a>
			{:else}
				<button class="btn btn-soft btn-xs btn-primary">install</button>
			{/if}
		</div>
	</div>
</div>
