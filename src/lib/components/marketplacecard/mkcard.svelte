<script lang="ts">
  export let content: {
    title: string;
    description: string;
    image: string;
    link?: string;
  };
</script>

<div class="card card-side bg-base-100 shadow-sm w-full max-h-36">
  <figure class="w-28">
    <img
      src={content.image}
      alt={content.title}
      class="object-cover h-full w-full"
    />
  </figure>
  <div class="card-body p-3 gap-2">
    <h2 class="card-title text-sm leading-tight">{content.title}</h2>
    <p class="text-xs line-clamp-2">{content.description}</p>
    <div class="card-actions justify-end">
      {#if content.link}
        <a
          class="btn btn-xs btn-soft btn-primary"
          href={content.link}
          target="_blank"
          >install</a
        >
      {:else}
        <button class="btn btn-xs btn-soft btn-primary">install</button>
      {/if}
    </div>
  </div>
</div>
