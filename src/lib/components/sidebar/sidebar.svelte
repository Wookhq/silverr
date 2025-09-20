<script>
  export let drawerId = "my-drawer-2";
</script>

<div class="drawer lg:drawer-open">
  <input id={drawerId} type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <slot />
    <label for={drawerId} class="btn btn-primary drawer-button lg:hidden">
      Sidebar
    </label>
  </div>
  <div class="drawer-side">
    <label for={drawerId} aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <li><a href="/">Home</a></li>
      <li><a href="/mods">Mods</a></li>
      <li><a href="/marketplace">Marketplace</a></li>

    </ul>
  </div>
</div>
