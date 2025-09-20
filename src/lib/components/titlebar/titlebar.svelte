<script>
  const minimize = () => window.electronAPI.minimize();
  const maximize = () => window.electronAPI.maximize();
  const close = () => window.electronAPI.close();
</script>

<div class="title-bar fixed top-0 left-0 w-full flex justify-end items-center h-10 bg-base-200 shadow-md select-none"
     style="-webkit-app-region: drag; z-index: 50;">
  <button class="btn btn-sm btn-ghost mr-1" style="-webkit-app-region: no-drag;" on:click={minimize}>Z</button>
  <button class="btn btn-sm btn-ghost mr-1" style="-webkit-app-region: no-drag;" on:click={maximize}>O</button>
  <button class="btn btn-sm btn-error" style="-webkit-app-region: no-drag;" on:click={close}>S</button>
</div>
