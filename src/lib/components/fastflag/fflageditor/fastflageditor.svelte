<script>
	import ModalYesNo from '../../modalyesorno/modal.svelte';
	import Alert from '../../alert/alert.svelte';

	export let flags = [];
	const fflagsallowlist =
		'https://devforum.roblox.com/t/allowlist-for-local-client-configuration-via-fast-flags/3966569';
	let newFlag = '';
	let jsonInput = '';

	let showAlert = false;
	let alertMessage = '';

	let modalRef;

	function addFlag() {
		if (!newFlag.trim()) return;
		const [name, value] = newFlag.split('=');
		flags = [
			...flags,
			{ id: flags.length + 1, name: name || newFlag, job: value || '-', fav: '-' }
		];
		newFlag = '';
	}

	function deleteFlag(id) {
		flags = flags.filter((f) => f.id !== id);
	}

	function loadFromJson() {
		try {
			const parsed = JSON.parse(jsonInput);
			flags = Object.entries(parsed).map(([k, v], i) => ({
				id: i + 1,
				name: k,
				job: String(v),
				fav: '-'
			}));
			jsonInput = '';
		} catch (e) {
			alert('Invalid JSON: ' + e.message);
		}
	}

	async function saveFlags() {
		try {
			const fflags = flags.reduce((acc, f) => {
				acc[f.name] = f.job;
				return acc;
			}, {});
			const writeRes = await window.electronAPI.fastflagSaveAll(fflags);
			if (writeRes) {
				showAlertMessage('fflags saved');
			} else {
				showAlertMessage('Error saving flags');
				console.error('Error saving flags');
			}
		} catch (e) {
			showAlertMessage('Error saving flags');
			console.error(e);
		}
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

			const writeRes = await window.electronAPI.writeFile(
				filePath,
				JSON.stringify(config, null, 2)
			);
			if (writeRes.ok) showAlertMessage('Success');
			else console.error(writeRes.error);
		} catch (e) {
			console.error(e);
		}
	}

	function showAlertMessage(msg, timeout = 3000) {
		alertMessage = msg;
		showAlert = true;
		setTimeout(() => (showAlert = false), timeout);
	}

	function openModal() {
		modalRef.open();
	}
	function onYes() {
		nukeFlags();
	}
	function onNo() {
		console.log('canceled');
	}
</script>

{#if showAlert}
	<Alert type="success" message={alertMessage} />
{/if}

<div class="rounded-lg bg-base-100/50 p-4">
	<h2 class="mb-4 text-xl font-bold">Fast Flag Editor</h2>

	<div role="alert" class="mb-4 alert alert-warning">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
		<span
			>Warning: Roblox only allow some fflags now. <a
				href="#"
				class="underline hover:text-blue-600 dark:hover:text-blue-400"
				on:click|preventDefault={() => window.electronAPI.openLink(fflagsallowlist)}
			>
				More info here.
			</a>
		</span>
	</div>

	<div class="mb-4 flex flex-col gap-4">
		<div class="flex gap-2">
			<input
				type="text"
				placeholder="SomeFastFlag=SomeValue"
				class="input-bordered input w-full"
				bind:value={newFlag}
				on:keydown={(e) => e.key === 'Enter' && addFlag()}
			/>
			<button class="btn btn-primary" on:click={addFlag}>Add</button>
		</div>

		<div class="divider">OR</div>

		<div class="flex flex-col gap-2">
			<textarea
				class="textarea-bordered textarea h-24 w-full"
				placeholder="Paste JSON here..."
				bind:value={jsonInput}
			></textarea>
			<div class="flex gap-2">
				<button class="btn flex-grow btn-secondary" on:click={loadFromJson}>Load from JSON</button>
				<button class="btn flex-grow btn-info" on:click={saveFlags}>Save to config</button>
				<button class="btn flex-grow btn-error" on:click={openModal}>Clear Fastflag</button>

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
						<td class="text-right"
							><button class="btn text-error btn-ghost btn-xs" on:click={() => deleteFlag(f.id)}
								>Remove</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
