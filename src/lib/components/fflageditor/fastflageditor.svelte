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


  function exportToJson() {
    const exportedObject = {};
    flags.forEach(f => {
      exportedObject[f.name] = f.job;
    });
    const jsonStr = JSON.stringify(exportedObject, null, 2);
    alert(jsonStr); // optional
    return jsonStr;  // <--- RETURN it!
  }
  
  async function saveFlags() {
    const filePath = '~/.var/app/org.vinegarhq.Sober/config/sober/config.json';
    const result = await window.electronAPI.readFile(filePath);

    if (!result.ok) {
      console.error('failed to read file:', result.error);
      return;
    }

    try {
      // strip comments before parsing
      const jsonStart = result.data.indexOf('{');
      const jsonStr = result.data.slice(jsonStart);
      const config = JSON.parse(jsonStr);

      // update fflags key
      config.fflags = flags.reduce((acc, f) => {
        acc[f.name] = f.job;
        return acc;
      }, {});

      // convert back to string, preserving 2-space indentation
      const newJsonStr = JSON.stringify(config, null, 2);

      const writeResult = await window.electronAPI.writeFile(filePath, newJsonStr);

      if (writeResult.ok) {
        console.log('fflags updated');
      } else {
        console.error('failed to save file:', writeResult.error);
      }
    } catch (err) {
      console.error('JSON parse or write error:', err);
    }
  }
  async function nukeFlags() {
  const filePath = '~/.var/app/org.vinegarhq.Sober/config/sober/config.json';
  const result = await window.electronAPI.readFile(filePath);

  if (!result.ok) {
    console.error('failed to read file:', result.error);
    return;
  }

  try {
    // strip comments before parsing
    const jsonStart = result.data.indexOf('{');
    const jsonStr = result.data.slice(jsonStart);
    const config = JSON.parse(jsonStr);

    // clear fflags
    config.fflags = {};

    // also clear local editor flags
    flags = [];

    // write back
    const writeResult = await window.electronAPI.writeFile(filePath, JSON.stringify(config, null, 2));

    if (writeResult.ok) {
      console.log('all fflags cleared');
      alert('All fflags cleared!');
    } else {
      console.error('failed to save file:', writeResult.error);
    }
  } catch (err) {
    console.error('JSON parse or write error:', err);
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
      <div class="flex gap-2">
        <button class="btn btn-secondary flex-grow" on:click={loadFromJson}>Load from JSON</button>
        <button class="btn btn-info flex-grow" on:click={saveFlags}>Save to config</button>
        <button class="btn btn-error flex-grow" on:click={nukeFlags}>Clear Fastflag</button>

      </div>
    </div>
  </div>

  <div class="overflow-x-auto rounded-box border border-base-content/10">
    <table class="table table-zebra">
      <thead class="bg-base-200">
        <tr>
          <th>#</th>
          <th>name</th>
          <th>value</th>
          <th class="text-right">actions</th>
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
