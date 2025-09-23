// applyFunctions.ts
import path from 'path';
import os from 'os';
import fs from 'fs';

import { Config } from '/helpers/genconfig'; // your TS port of genconfig
import { FilesFunctions } from '../utils/files'; // TS port of FilesFunctions

const genconfig = new Config();
const ff = new FilesFunctions();

export class ApplyFunctions {
	constructor() {}

	async ApplyChanges(
		fpslimit: number,
		lightingtech: string,
		rpc1: boolean,
		rendertech: string,
		bbchat: boolean,
		fontsize: number,
		useoldrobloxsounds: boolean,
		disableprsh: boolean,
		texturequa: string,
		msaa: string
	) {
		// Lighting Tech
		if (lightingtech === 'Voxel Lighting (Phase 1)') {
			await genconfig.UpdateFflags('DFFlagDebugRenderForceTechnologyVoxel', true);
			await genconfig.UpdateFflags('FFlagDebugForceFutureIsBrightPhase2', false);
			await genconfig.UpdateFflags('FFlagDebugForceFutureIsBrightPhase3', false);
		}
		if (lightingtech === 'Shadowmap Lighting (Phase 2)') {
			await genconfig.UpdateFflags('DFFlagDebugRenderForceTechnologyVoxel', false);
			await genconfig.UpdateFflags('FFlagDebugForceFutureIsBrightPhase2', true);
			await genconfig.UpdateFflags('FFlagDebugForceFutureIsBrightPhase3', false);
		}
		if (lightingtech === 'Future Lighting (Phase 3)') {
			await genconfig.UpdateFflags('DFFlagDebugRenderForceTechnologyVoxel', false);
			await genconfig.UpdateFflags('FFlagDebugForceFutureIsBrightPhase2', false);
			await genconfig.UpdateFflags('FFlagDebugForceFutureIsBrightPhase3', true);
		}

		// Texture quality
		const chektexture = async (texturequa1: string) => {
			await genconfig.UpdateFflags('DFFlagTextureQualityOverrideEnabled', true);
			switch (texturequa1) {
				case 'Off':
					await genconfig.DeleteFflag('DFFlagTextureQualityOverrideEnabled');
					await genconfig.DeleteFflag('DFIntTextureQualityOverride');
					break;
				case 'Level 0 (potato)':
					await genconfig.UpdateFflags('DFIntTextureQualityOverride', 0);
					break;
				case 'Level 1 (Low)':
					await genconfig.UpdateFflags('DFIntTextureQualityOverride', 1);
					break;
				case 'Level 2 (Medium)':
					await genconfig.UpdateFflags('DFIntTextureQualityOverride', 2);
					break;
				case 'Level 3 (High)':
					await genconfig.UpdateFflags('DFIntTextureQualityOverride', 3);
					break;
				case 'Level 4 (Ultra)':
					await genconfig.UpdateFflags('DFIntTextureQualityOverride', 4);
					break;
			}
		};
		await chektexture(texturequa);

		// MSAA
		const msaaapply = async (msaa1: string) => {
			await genconfig.UpdateFflags('FFlagDebugDisableMSAA', false);
			switch (msaa1) {
				case 'Off':
					await genconfig.UpdateFflags('DFFlagTextureQualityOverrideEnabled', true);
					await genconfig.DeleteFflag('FIntMSAASampleCount');
					break;
				case 'x1':
					await genconfig.UpdateFflags('FIntMSAASampleCount', 1);
					break;
				case 'x2':
					await genconfig.UpdateFflags('FIntMSAASampleCount', 2);
					break;
				case 'x4':
					await genconfig.UpdateFflags('FIntMSAASampleCount', 4);
					break;
				case 'Auto':
					break;
			}
		};
		await msaaapply(msaa);

		// FPS limit
		await genconfig.UpdateFflags('DFIntTaskSchedulerTargetFps', fpslimit);
		await genconfig.UpdateFflags('FFlagGameBasicSettingsFramerateCap5', true);
		await genconfig.UpdateFflags('FFlagTaskSchedulerLimitTargetFpsTo2402', false);

		// Discord RPC
		await genconfig.UpdateSoberConfig('discord_rpc_enabled', rpc1);

		// Player shadows
		if (disableprsh) {
			await genconfig.UpdateFflags('FIntRenderShadowIntensity', '0');
			await genconfig.Update('lution', 'disableplayersh', true);
		} else {
			await genconfig.UpdateFflags('FIntRenderShadowIntensity', '75');
			await genconfig.Update('lution', 'disableplayersh', false);
		}

		// Render Tech
		if (rendertech === 'OpenGL') {
			await genconfig.UpdateSoberConfig('use_opengl', true);
		} else if (rendertech === 'Vulkan') {
			await genconfig.UpdateSoberConfig('use_opengl', false);
		}

		// Bubble chat
		await genconfig.UpdateFflags('FFlagEnableBubbleChatFromChatService', bbchat);

		// Font size
		await genconfig.UpdateFflags('FIntFontSizePadding', fontsize);

		// Old Roblox sounds
		await genconfig.Update('lution', 'OldRlbxSd', useoldrobloxsounds);
		if (useoldrobloxsounds) {
			await ff.OverwriteFiles(
				path.join(
					os.homedir(),
					'.var/app/org.vinegarhq.Sober/data/sober/asset_overlay/content/sounds/'
				),
				[
					path.resolve(__dirname, '../../files/sounds/action_footsteps_plastic.mp3'),
					path.resolve(__dirname, '../../files/sounds/action_get_up.mp3'),
					path.resolve(__dirname, '../../files/sounds/action_jump.mp3'),
					path.resolve(__dirname, '../../files/sounds/ouch.ogg')
				]
			);
		}
	}

	async Applyfflags(fflags: Record<string, any>) {
		const Currfflags = await genconfig.ReadSoberConfig('fflags');
		const Combine = genconfig.CombineJson(Currfflags, fflags);
		await genconfig.UpdateSoberConfig('fflags', Combine);
	}

	async LoadLightTechConfig(): Promise<string> {
		const Voxel = await genconfig.ReadFflagsConfig('DFFlagDebugRenderForceTechnologyVoxel');
		const Phase2 = await genconfig.ReadFflagsConfig('FFlagDebugForceFutureIsBrightPhase2');
		const Phase3 = await genconfig.ReadFflagsConfig('FFlagDebugForceFutureIsBrightPhase3');
		if (Voxel) return 'Voxel Lighting (Phase 1)';
		if (Phase2) return 'Shadowmap Lighting (Phase 2)';
		if (Phase3) return 'Future Lighting (Phase 3)';
		return 'Voxel Lighting (Phase 1)'; // fallback
	}

	async LoadMSAA(): Promise<string> {
		const flag = await genconfig.ReadFflagsConfig('FFlagDebugDisableMSAA');
		const flag2 = await genconfig.ReadFflagsConfig('FIntMSAASampleCount');
		if (flag === false) return 'Off';
		switch (flag2) {
			case 1:
				return 'x1';
			case 2:
				return 'x2';
			case 4:
				return 'x4';
			default:
				return 'Auto';
		}
	}

	async LoadTextureQuality(): Promise<string> {
		const flag = await genconfig.ReadFflagsConfig('DFIntTextureQualityOverride');
		switch (flag) {
			case 0:
				return 'Level 0 (potato)';
			case 1:
				return 'Level 1 (Low)';
			case 2:
				return 'Level 2 (Medium)';
			case 3:
				return 'Level 3 (High)';
			case 4:
				return 'Level 4 (Ultra)';
			default:
				return 'Off';
		}
	}

	async UsingOpenGl(): Promise<boolean> {
		return (await genconfig.ReadSoberConfig('use_opengl')) ?? false;
	}
}
