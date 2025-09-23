<script lang="ts">
	import Alert from '$lib/components/alert/alert.svelte';
	import { ApplyFunctionsTS } from '$lib/helpers/sghelper';
	import { onMount } from 'svelte';
	import { readConfig } from '$lib/helpers/config';

	let alertMessage = '';
	let showAlert = false;

	let apply = new ApplyFunctionsTS();
	
	function showAlertMessage(msg, timeout = 3000) {
		alertMessage = msg;
		showAlert = true;
		setTimeout(() => (showAlert = false), timeout);
	}

	// bind each toggle
	let toggleOne = true;
	let fpsLimit = 60;
	let toggleTwo = false;
	let toggleThree = true;
	let toggleFour = false;
	let toggleFive = false;
	let lightingTech = 'Voxel Lighting (Phase 1)'; // default value

	async function updateSettings() {
		await apply.applyChanges({
			fpsLimit: fpsLimit,
			lightingTech: lightingTech,
			rpc1: toggleOne,
			renderTech: toggleFive,
			bbchat: toggleTwo,
			fontSize: 14,
			disablePrSh: toggleThree,
			useOldRobloxSounds: toggleFour,
			textureQua: 'Level 2 (Medium)',
			msaa: 'x2'
		});

		// update fflags directly example
		// apply.applyFFlags({ DFFlagDebugRenderForceTechnologyVoxel: toggleOne });

		console.log('LightTech:', apply.loadLightTechConfig());
		console.log('OpenGL?', await apply.usingOpenGl());
		showAlertMessage("Applied !")
	}

	onMount(async () => {
		const config = await readConfig('~/.var/app/org.vinegarhq.Sober/config/sober/config.json');
		if (config) {
			if (config.fflags) {
				if (config.fflags.DFIntTaskSchedulerTargetFps) {
					fpsLimit = config.fflags.DFIntTaskSchedulerTargetFps;
				}
				if (config.fflags.DFFlagDebugRenderForceTechnologyVoxel) {
					lightingTech = 'Voxel Lighting (Phase 1)';
				} else if (config.fflags.FFlagDebugForceFutureIsBrightPhase2) {
					lightingTech = 'Shadowmap Lighting (Phase 2)';
				} else if (config.fflags.FFlagDebugForceFutureIsBrightPhase3) {
					lightingTech = 'Future Lighting (Phase 3)';
				}
			}
			if (config.hasOwnProperty('use_opengl')) {
				toggleFive = config.use_opengl;
			}
			if (config.fflags.FFlagEnableBubbleChatFromChatService) {
				toggleFour = config.fflags.FFlagEnableBubbleChatFromChatService;
			}
			if (config.fflags.FIntRenderShadowIntensity == '75') {
				toggleThree = false;
			} else if (config.fflags.FIntRenderShadowIntensity == '0') {
				toggleThree = true;
			}
		}
	});
</script>

{#if showAlert}
	<Alert type="success" message={alertMessage} />
{/if}

<div class="mx-auto flex w-full flex-col gap-4">
	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="label">
				<span class="label-text">FPS limit</span>
			</label>
			<input
				type="number"
				placeholder="Type here"
				class="input-bordered input"
				bind:value={fpsLimit}
			/>
		</div>
	</div>
	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Discord RPC</span>
					<p class="text-sm text-base-content/70">understandable</p>
				</div>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={toggleOne} />
			</label>
		</div>
	</div>

	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Disable chat</span>
					<p class="text-sm text-base-content/70">readable</p>
				</div>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={toggleTwo} />
			</label>
		</div>
	</div>

	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Disable Player Shadow</span>
					<p class="text-sm text-base-content/70">yeah</p>
				</div>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={toggleThree} />
			</label>
		</div>
	</div>

	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Disable Chat</span>
					<p class="text-sm text-base-content/70">js read the title gng</p>
				</div>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={toggleFour} />
			</label>
		</div>
	</div>

	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Use OpenGL</span>
					<p class="text-sm text-base-content/70">if not, its will use vulkan</p>
				</div>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={toggleFive} />
			</label>
		</div>
	</div>

	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control flex flex-col gap-2">
			<div class="flex flex-col">
				<span class="text-lg font-semibold text-base-content">Preferred Lighting Technology</span>
				<span class="text-sm text-base-content/70">cool</span>
			</div>
			<select class="select w-full select-primary" bind:value={lightingTech}>
				<option disabled selected>Choose</option>
				<option>Voxel Lighting (Phase 1)</option>
				<option>Shadowmap Lighting (Phase 2)</option>
				<option>Future Lighting (Phase 3)</option>
			</select>
		</div>
	</div>
	<button class="btn mt-4 self-end btn-primary" on:click={updateSettings}> Apply Settings </button>
</div>
