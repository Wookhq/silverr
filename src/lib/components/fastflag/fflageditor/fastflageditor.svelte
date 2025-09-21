<script>
  import ModalYesNo from "../../modalyesorno/modal.svelte";
  import Alert from "../../alert/alert.svelte";

  export let flags = [];
  let newFlag = "";
  let jsonInput = "";

  let showAlert = false;
  let alertMessage = '';

  let modalRef;

  function addFlag() {
    if (!newFlag.trim()) return;
    const [name, value] = newFlag.split('=');
    flags = [...flags, { id: flags.length + 1, name: name || newFlag, job: value || "-", fav: "-" }];
    newFlag = "";
  }

  function deleteFlag(id) {
    flags = flags.filter(f => f.id !== id);
  }

  function loadFromJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      flags = Object.entries(parsed).map(([k,v], i) => ({ id: i+1, name: k, job: String(v), fav: "-" }));
      jsonInput = "";
    } catch (e) {
      alert("Invalid JSON: " + e.message);
    }
  }

  async function saveFlags() {
    const filePath = '~/.var/app/org.vinegarhq.Sober/config/sober/config.json';
    const res = await window.electronAPI.readFile(filePath);
    if (!res.ok) return console.error(res.error);

    try {
      const jsonStr = res.data.slice(res.data.indexOf('{'));
      const config = JSON.parse(jsonStr);

      config.fflags = flags.reduce((acc,f)=>{ acc[f.name]=f.job; return acc; },{});
      const writeRes = await window.electronAPI.writeFile(filePath, JSON.stringify(config,null,2));
      if (writeRes.ok) {
        showAlertMessage("fflags saved");
      } else console.error(writeRes.error);
    } catch(e) { console.error(e); }
  }

  async function nukeFlags() {
    const filePath = '~/.var/app/org.vinegarhq.Sober/config/sober/config.json';
    const res = await window.electronAPI.readFile(filePath);
    if (!res.ok) return console.error(res.error);

    try {
      const jsonStr = res.data.slice(res.data.indexOf('{'));
      const config = JSON.parse(jsonStr);

      config.fflags = {};
      flags = [];

      const writeRes = await window.electronAPI.writeFile(filePath, JSON.stringify(config,null,2));
      if (writeRes.ok) showAlertMessage("Success");
      else console.error(writeRes.error);
    } catch(e){ console.error(e); }
  }

  function showAlertMessage(msg, timeout=3000){
    alertMessage = msg;
    showAlert = true;
    setTimeout(()=> showAlert=false, timeout);
  }

  function openModal(){ modalRef.open(); }
  function onYes(){ nukeFlags(); }
  function onNo(){ console.log("canceled"); }

</script>

{#if showAlert}
  <Alert type="success" message={alertMessage} />
{/if}

<div class="p-4 rounded-lg bg-base-100/50">
  <h2 class="text-xl font-bold mb-4">Fast Flag Editor</h2>

  <div class="flex flex-col gap-4 mb-4">
    <div class="flex gap-2">
      <input type="text" placeholder="SomeFastFlag=SomeValue" class="input input-bordered w-full" bind:value={newFlag} on:keydown={e=>e.key==='Enter' && addFlag()}/>
      <button class="btn btn-primary" on:click={addFlag}>Add</button>
    </div>

    <div class="divider">OR</div>

    <div class="flex flex-col gap-2">
      <textarea class="textarea textarea-bordered h-24 w-full" placeholder="Paste JSON here..." bind:value={jsonInput}></textarea>
      <div class="flex gap-2">
        <button class="btn btn-secondary flex-grow" on:click={loadFromJson}>Load from JSON</button>
        <button class="btn btn-info flex-grow" on:click={saveFlags}>Save to config</button>
        <button class="btn btn-error flex-grow" on:click={openModal}>Clear Fastflag</button>

        <ModalYesNo
          bind:this={modalRef}
          title="Clear all fflags?"
          content="This will reset all flags! Are you sure?"
          on:yes={onYes}
          on:no={onNo}
        />
      </div>
    </div>
  </div>

  <div class="overflow-x-auto rounded-box border border-base-content/10">
    <table class="table table-zebra">
      <thead class="bg-base-200">
        <tr>
          <th>#</th><th>name</th><th>value</th><th class="text-right">actions</th>
        </tr>
      </thead>
      <tbody>
        {#each flags as f (f.id)}
          <tr>
            <th>{f.id}</th>
            <td>{f.name}</td>
            <td>{f.job}</td>
            <td class="text-right"><button class="btn btn-ghost btn-xs text-error" on:click={()=>deleteFlag(f.id)}>Remove</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
