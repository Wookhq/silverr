const { ipcMain, BrowserWindow } = require('electron');

ipcMain.handle('open-link', async (_, url) => {
	if (!url || typeof url !== 'string') {
		console.error('invalid url:', url);
		return;
	}

	const popup = new BrowserWindow({
		width: 900,
		height: 600,
		autoHideMenuBar: true,
		webPreferences: { nodeIntegration: false, contextIsolation: true }
	});

	const finalUrl = url.startsWith('http') ? url : `https://${url}`;
	popup.loadURL(finalUrl);
	popup.show();
});
