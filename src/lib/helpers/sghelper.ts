import { updateFastFlag, UpdateSoberConf, readConfig } from './config';

type FFlags = Record<string, any>;
let configpath = '~/.var/app/org.vinegarhq.Sober/config/sober/config.json';

class Config {
	async UpdateFflags(flag: string, value: any) {
		await updateFastFlag(configpath, flag, value);
	}
	async DeleteFflag(flag: string) {
		/* impl */
	}
	async UpdateSoberConfig(key: string, value: any) {
		await UpdateSoberConf(configpath, key, value);
	}
	async Update(module: string, key: string, value: any) {
		/* impl */
	}
	async ReadSoberConfig(key: string): Promise<any> {
		const data = await readConfig(configpath);
		const value = data[key];

		return value;
	}
	ReadFflagsConfig(flag: string): any {
		return null;
	}
	CombineJson(obj1: any, obj2: any): any {
		return { ...obj1, ...obj2 };
	}
}

class FilesFunctions {
	async OverwriteFiles(targetFolder: string, files: string[]) {
		/* impl */
	}
}

class STMessages {
	error(msg: string) {
		console.error(msg);
	}
}

// instances
const genconfig = new Config();
const ff = new FilesFunctions();
const st = new STMessages();

interface ApplyOptions {
	fpsLimit: number;
	lightingTech:
		| 'Voxel Lighting (Phase 1)'
		| 'Shadowmap Lighting (Phase 2)'
		| 'Future Lighting (Phase 3)';
	rpc1: boolean;
	renderTech: boolean;
	bbchat: boolean;
	fontSize: number;
	useOldRobloxSounds: boolean;
	disablePrSh: boolean;
	textureQua:
		| 'Off'
		| 'Level 0 (potato)'
		| 'Level 1 (Low)'
		| 'Level 2 (Medium)'
		| 'Level 3 (High)'
		| 'Level 4 (Ultra)';
	msaa: 'Off' | 'x1' | 'x2' | 'x4' | 'Auto';
}

export class ApplyFunctionsTS {
	async applyChanges(options: ApplyOptions) {
		const {
			fpsLimit,
			lightingTech,
			rpc1,
			renderTech,
			bbchat,
			fontSize,
			disablePrSh,
			textureQua,
			msaa
		} = options;

		// lighting tech
		await genconfig.UpdateFflags(
			'DFFlagDebugRenderForceTechnologyVoxel',
			lightingTech === 'Voxel Lighting (Phase 1)'
		);
		await genconfig.UpdateFflags(
			'FFlagDebugForceFutureIsBrightPhase2',
			lightingTech === 'Shadowmap Lighting (Phase 2)'
		);
		await genconfig.UpdateFflags(
			'FFlagDebugForceFutureIsBrightPhase3',
			lightingTech === 'Future Lighting (Phase 3)'
		);

		// texture quality
		const textureMap: Record<string, number | null> = {
			Off: null,
			'Level 0 (potato)': 0,
			'Level 1 (Low)': 1,
			'Level 2 (Medium)': 2,
			'Level 3 (High)': 3,
			'Level 4 (Ultra)': 4
		};
		await genconfig.UpdateFflags('DFFlagTextureQualityOverrideEnabled', textureQua !== 'Off');
		if (textureQua === 'Off') {
			await genconfig.DeleteFflag('DFFlagTextureQualityOverrideEnabled');
			await genconfig.DeleteFflag('DFIntTextureQualityOverride');
		} else {
			await genconfig.UpdateFflags('DFIntTextureQualityOverride', textureMap[textureQua]);
		}

		// msaa
		switch (sample) {
			case '1':
				msaa = 'Level 0 (potato)';
				break;
			case '2':
			case '3':
				msaa = 'Level 1 (Low)';
				break;
			case '4':
				msaa = 'Level 3 (High)';
				break;
			case '':
			case undefined:
				msaa = 'Level 4 (Ultra)';
				break;
			default:
				msaa = 'Unknown';
		}

		// FPS limit
		await genconfig.UpdateFflags('DFIntTaskSchedulerTargetFps', fpsLimit);
		await genconfig.UpdateFflags('FFlagGameBasicSettingsFramerateCap5', true);
		await genconfig.UpdateFflags('FFlagTaskSchedulerLimitTargetFpsTo2402', false);

		// discord rpc
		await genconfig.UpdateSoberConfig('discord_rpc_enabled', rpc1);

		// disable player shadows
		if (disablePrSh) {
			await genconfig.UpdateFflags('FIntRenderShadowIntensity', '0');
			await genconfig.Update('lution', 'disableplayersh', true);
		} else {
			await genconfig.UpdateFflags('FIntRenderShadowIntensity', '75');
			await genconfig.Update('lution', 'disableplayersh', false);
		}

		// render tech
		await genconfig.UpdateSoberConfig('use_opengl', renderTech);

		// bubble chat
		await genconfig.UpdateFflags('FFlagEnableBubbleChatFromChatService', bbchat);

		// font size
		await genconfig.UpdateFflags('FIntFontSizePadding', fontSize);
	}

	applyFFlags(fflags: FFlags) {
		const curr = genconfig.ReadSoberConfig('fflags');
		const combine = genconfig.CombineJson(curr, fflags);
		genconfig.UpdateSoberConfig('fflags', combine);
	}

	loadLightTechConfig(): string {
		if (genconfig.ReadFflagsConfig('DFFlagDebugRenderForceTechnologyVoxel'))
			return 'Voxel Lighting (Phase 1)';
		if (genconfig.ReadFflagsConfig('FFlagDebugForceFutureIsBrightPhase2'))
			return 'Shadowmap Lighting (Phase 2)';
		if (genconfig.ReadFflagsConfig('FFlagDebugForceFutureIsBrightPhase3'))
			return 'Future Lighting (Phase 3)';
		return 'Voxel Lighting (Phase 1)';
	}

	async usingOpenGl(): Promise<boolean> {
		return !!(await genconfig.ReadSoberConfig('use_opengl'));
	}

	// TODO: Add LoadMSAA, LoadTextureQuality, UpdateCursor, create/remove desktop entry
	// can convert them in the same TS pattern with path/fs + async/await
}
