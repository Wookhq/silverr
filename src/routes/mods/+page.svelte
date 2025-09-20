<script lang="ts">
  let msg = "";

  async function openHome() {
    msg = await window.electronAPI.openPath("~/.var/app/org.vinegarhq.Sober/data/sober/asset_overlay/");
  }
</script>

<button class="btn btn-outline btn-primary" on:click={openHome}>
  Open Mod Folder
</button>

<p>{msg}</p>
