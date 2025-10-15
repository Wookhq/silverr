const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	openLink: (url) => ipcRenderer.invoke('open-link', url),

	openPath: (path) => ipcRenderer.invoke('open-path', path),

	writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
	readFile: (path) => ipcRenderer.invoke('read-file', path),

	replaceFileContents: (fileContent, fileName) =>
		ipcRenderer.invoke('mod:replace', fileContent, fileName),

	downloadFileFromUrl: (url) => ipcRenderer.invoke('github:downloadlfs', url),

	getLocalAssets: () => ipcRenderer.invoke('local:get-assets'),
	deleteLocalAsset: (fileName) => ipcRenderer.invoke('local:delete-asset', fileName),
	applyAsset: (fileName) => ipcRenderer.invoke('local:apply-asset', fileName),
	getLocalAssetsPath: () => ipcRenderer.invoke('local:get-assets-path'),

	readJson: (filePath) => ipcRenderer.invoke('json:read', filePath),
	writeJson: (filePath, data) => ipcRenderer.invoke('json:write', filePath, data),
	editJson: (filePath, updaterStr) => ipcRenderer.invoke('json:edit', filePath, updaterStr),
	updateFastFlag: (filePath, key, value) =>
		ipcRenderer.invoke('fastflag:update', filePath, key, value),
	fastflagSaveAll: (flags) => ipcRenderer.invoke('fastflag:save-all', flags),
	updateSoberConf: (filePath, key, value) =>
		ipcRenderer.invoke('sober:update', filePath, key, value),

	crossover: (folder) => ipcRenderer.invoke('crossover:crossover', folder),
	crossoverCreate: (folder, roblox_platform, crossover_version) =>
		ipcRenderer.invoke('crossover:create', folder, roblox_platform, crossover_version),
	crossoverPack: (folder) => ipcRenderer.invoke('crossover:pack', folder),
	crossoverUnpack: (crossover_file, dest_folder) =>
		ipcRenderer.invoke('crossover:unpack', crossover_file, dest_folder),
	crossoverUnpackAndCrossover: (crossover_file) =>
		ipcRenderer.invoke('crossover:unpack-and-crossover', crossover_file),
	crossoverCreateAndPack: (baseDir) => ipcRenderer.invoke('crossover:create-and-pack', baseDir),

	openDialog: () => ipcRenderer.invoke('dialog:openFile'),
	openDirectoryDialog: () => ipcRenderer.invoke('dialog:openDirectory'),

	createCrossoverFile: () => ipcRenderer.invoke('crossover:create-crossover-file'),

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

	openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),

	minimize: () => ipcRenderer.send('window-minimize'),
	maximize: () => ipcRenderer.send('window-maximize'),
	close: () => ipcRenderer.send('window-close')
});
