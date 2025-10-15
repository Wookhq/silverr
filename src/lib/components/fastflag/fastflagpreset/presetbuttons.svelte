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
	let fontSize = 1;
	let toggleTwo = false;
	let toggleThree = true;
	let toggleFour = false;
	let toggleFive = false;
	let lightingTech = 'Voxel Lighting (Phase 1)'; // default value
	let tex = 'Choose';
	let msaa = 'Off';

	async function updateSettings() {
		await apply.applyChanges({
			fpsLimit: fpsLimit,
			lightingTech: lightingTech,
			rpc1: toggleOne,
			renderTech: toggleFive,
			bbchat: toggleTwo,
			fontSize: fontSize,
			disablePrSh: toggleThree,
			useOldRobloxSounds: toggleFour,
			textureQua: tex,
			msaa: msaa
		});

		// update fflags directly example
		// apply.applyFFlags({ DFFlagDebugRenderForceTechnologyVoxel: toggleOne });

		console.log('LightTech:', apply.loadLightTechConfig());
		console.log('OpenGL?', await apply.usingOpenGl());
		showAlertMessage('Applied !');
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
			if (config.fflags.FIntFontSizePadding) {
				fontSize = config.fflags.FIntFontSizePadding;
			}
			if (config.fflags.DFIntTextureQualityOverride) {
				switch (config.fflags.DFIntTextureQualityOverride) {
					case 0:
						tex = 'Level 0 (potato)';
						break;
					case 1:
						tex = 'Level 1 (Low)';
						break;
					case 2:
						tex = 'Level 1 (Low)';
						break;
					case 3:
						tex = 'Level 3 (High)';
						break;
					case 4:
						tex = 'Level 4 (Ultra)';
						break;
				}
			}

			const msaaFlag = config.fflags.FIntMSAASampleCount;
			if (config.fflags.FFlagDebugDisableMSAA) {
				msaa = 'Off';
			} else {
				switch (msaaFlag) {
					case '1':
						msaa = 'x1';
						break;
					case '2':
						msaa = 'x2';
						break;
					case '3':
						msaa = 'x3';
						break;
					case '4':
						msaa = 'x4';
						break;
					case undefined:
					case '':
						msaa = 'Auto';
						break;
					default:
						msaa = 'Auto';
				}
			}
		}
	});
</script>

{#if showAlert}
	<Alert type="success" message={alertMessage} />
{/if}

<div class="mx-auto flex w-full flex-col gap-4">
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
			>Warning: Due to roblox removing some fflags, we've hide some fflags preset. <a
				href="#"
				class="underline hover:text-blue-600 dark:hover:text-blue-400"
				on:click|preventDefault={() => window.electronAPI.openLink(fflagsallowlist)}
			>
				Read it here.
			</a>
		</span>
	</div>

	<!-- <div class="card w-full bg-base-200 p-5 shadow-md">
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
	</div> -->

	<!-- <div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="label">
				<span class="label-text">Font size</span>
			</label>
			<input
				type="number"
				placeholder="Type here"
				class="input-bordered input"
				bind:value={fontSize}
			/>
		</div>
	</div> -->

	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Discord RPC (Sober's built in)</span
					>
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

	<!-- <div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control">
			<label class="flex cursor-pointer items-center justify-between gap-4">
				<div>
					<span class="text-lg font-semibold text-base-content">Disable Player Shadow</span>
					<p class="text-sm text-base-content/70">yeah</p>
				</div>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={toggleThree} />
			</label>
		</div>
	</div> -->

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
	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control flex flex-col gap-2">
			<div class="flex flex-col">
				<span class="text-lg font-semibold text-base-content">Preferred Texture Quality</span>
				<span class="text-sm text-base-content/70">ingore my english gammar pls</span>
			</div>
			<select class="select w-full select-primary" bind:value={tex}>
				<option disabled selected>Choose</option>
				<option>Level 0 (potato)</option>
				<option>Level 1 (Low)</option>
				<option>Level 2 (Medium)</option>
				<option>Level 3 (High)</option>
				<option>Level 4 (Ultra)</option>
			</select>
		</div>
	</div>
	<div class="card w-full bg-base-200 p-5 shadow-md">
		<div class="form-control flex flex-col gap-2">
			<div class="flex flex-col">
				<span class="text-lg font-semibold text-base-content">MSAA</span>
				<span class="text-sm text-base-content/70">cookies</span>
			</div>
			<select class="select w-full select-primary" bind:value={msaa}>
				<option disabled selected>Choose</option>
				<option>Off</option>
				<option>x1</option>
				<option>x2</option>
				<option>x3</option>
				<option>x4</option>
				<option>Auto</option>
			</select>
		</div>
	</div>
	<button class="btn mt-4 self-end btn-primary" on:click={updateSettings}> Apply Settings </button>
</div>
