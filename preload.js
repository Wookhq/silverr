const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	openPath: (path) => ipcRenderer.invoke('open-path', path),

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
	}
});
