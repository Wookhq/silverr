// src/lib/config.ts
export async function readConfig(filePath: string) {
	const res = await window.electronAPI.ipcRenderer.invoke('json:read', filePath);
	if (res.ok) return res.data;
	console.error('readConfig error:', res.error);
	return null;
}

export async function writeConfig(filePath: string, data: any) {
	const res = await window.electronAPI.ipcRenderer.invoke('json:write', filePath, data);
	if (!res.ok) console.error('writeConfig error:', res.error);
}

export async function editConfig(filePath: string, updater: (data: any) => any) {
	// we need to stringify the updater to send it via IPC
	const res = await window.electronAPI.ipcRenderer.invoke(
		'json:edit',
		filePath,
		updater.toString()
	);
	if (!res.ok) console.error('editConfig error:', res.error);
}
