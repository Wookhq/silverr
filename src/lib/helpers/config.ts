// src/lib/helpers/config.ts
export async function readConfig(filePath: string) {
	try {
		return await window.electronAPI.readJson(filePath);
	} catch (err) {
		console.error('readConfig error:', err);
		return null;
	}
}

export async function writeConfig(filePath: string, data: any) {
	try {
		await window.electronAPI.writeJson(filePath, data);
	} catch (err) {
		console.error('writeConfig error:', err);
	}
}

export async function editConfig(filePath: string, updater: (data: any) => any) {
	try {
		// we need to stringify the updater to send it via IPC
		await window.electronAPI.editJson(filePath, updater.toString());
	} catch (err) {
		console.error('editConfig error:', err);
	}
}

export async function updateFastFlag(filePath: string, key: string, value: any) {
	try {
		await window.electronAPI.updateFastFlag(filePath, key, value);
	} catch (err) {
		console.error('updateFastFlag error:', err);
	}
}

export async function UpdateSoberConf(filePath: string, key: string, value: any) {
	try {
		await window.electronAPI.updateSoberConf(filePath, key, value);
	} catch (err) {
		console.error('UpdateSoberConf error:', err);
	}
}
