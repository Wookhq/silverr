const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	openPath: (path) => ipcRenderer.invoke('open-path', path),

	writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
	readFile: (path) => ipcRenderer.invoke('read-file', path),

	downloadFileFromUrl: (url) => ipcRenderer.invoke('github:downloadlfs', url),

	getLocalAssets: () => ipcRenderer.invoke('local:get-assets'),
	deleteLocalAsset: (fileName) => ipcRenderer.invoke('local:delete-asset', fileName),
	getLocalAssetsPath: () => ipcRenderer.invoke('local:get-assets-path'),

	readJson: (filePath) => ipcRenderer.invoke('json:read', filePath),
	writeJson: (filePath, data) => ipcRenderer.invoke('json:write', filePath, data),
	editJson: (filePath, updaterStr) => ipcRenderer.invoke('json:edit', filePath, updaterStr),
	updateFastFlag: (filePath, key, value) =>
		ipcRenderer.invoke('fastflag:update', filePath, key, value),
	updateSoberConf: (filePath, key, value) =>
		ipcRenderer.invoke('sober:update', filePath, key, value),

	send: (channel, data) => {
		const validChannels = ['toMain'];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},

	receive: (channel, func) => {
		const validChannels = ['fromMain'];
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	},

	minimize: () => ipcRenderer.send('window-minimize'),
	maximize: () => ipcRenderer.send('window-maximize'),
	close: () => ipcRenderer.send('window-close')
});
