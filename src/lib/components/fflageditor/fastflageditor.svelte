<script>
  export let flags = []
  let newFlag = ""
  let jsonInput = ""

  function addFlag() {
    if (newFlag.trim()) {
      const [name, value] = newFlag.split('=');
      flags = [...flags, { id: flags.length + 1, name: name || newFlag, job: value || "-", fav: "-" }]
      newFlag = ""
    }
  }

  function deleteFlag(id) {
    flags = flags.filter(f => f.id !== id);
  }

  function loadFromJson() {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const newFlags = [];
      let idCounter = 1;
      for (const key in parsedJson) {
        if (Object.hasOwnProperty.call(parsedJson, key)) {
          newFlags.push({ id: idCounter++, name: key, job: String(parsedJson[key]), fav: "-" });
        }
      }
      flags = newFlags;
      jsonInput = ""; // Clear the input after loading
    } catch (e) {
      alert("Invalid JSON: " + e.message);
    }
  }
</script>

<div class="p-4 rounded-lg bg-base-100/50">
  <h2 class="text-xl font-bold mb-4">Fast Flag Editor</h2>

  <div class="flex flex-col gap-4 mb-4">
    <div class="flex gap-2">
      <input
        type="text"
        placeholder="SomeFastFlag=SomeValue"
        class="input input-bordered w-full"
        bind:value={newFlag}
        on:keydown={(e) => e.key === 'Enter' && addFlag()}
      />
      <button class="btn btn-primary" on:click={addFlag}>Add</button>
    </div>

    <div class="divider">OR</div>

    <div class="flex flex-col gap-2">
      <textarea
        class="textarea textarea-bordered h-24 w-full"
        placeholder="Paste JSON here..."
        bind:value={jsonInput}
      ></textarea>
      <button class="btn btn-secondary" on:click={loadFromJson}>Load from JSON</button>
    </div>
  </div>

  <div class="overflow-x-auto rounded-box border border-base-content/10">
    <table class="table table-zebra">
      <thead class="bg-base-200">
        <tr>
          <th>#</th>
          <th>Flag Name</th>
          <th>Value</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each flags as f (f.id)}
          <tr>
            <th>{f.id}</th>
            <td>{f.name}</td>
            <td>{f.job}</td>
            <td class="text-right">
              <button class="btn btn-ghost btn-xs text-error" on:click={() => deleteFlag(f.id)}>Remove</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
