const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const os = require('os');

let win; // ← make win global

function createWindow() {
	win = new BrowserWindow({
		width: 1500,
		height: 768,
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true
		},
		show: false
	});
	
	Menu.setApplicationMenu(null);

	const startUrl = process.env.ELECTRON_START_URL || path.join(__dirname, 'build/index.html');
	win.loadURL(startUrl);

	win.once('ready-to-show', () => win.show());
}

app.whenReady().then(() => {
	ipcMain.handle('open-path', async (_, filePath) => {
		if (filePath.startsWith('~')) {
			filePath = path.join(os.homedir(), filePath.slice(1));
		}
		await shell.openPath(filePath);
		return 'opened ' + filePath;
	});

	// window control handlers now work
	ipcMain.on('window-minimize', () => win.minimize());
	ipcMain.on('window-maximize', () => {
		if (win.isMaximized()) win.unmaximize();
		else win.maximize();
	});
	ipcMain.on('window-close', () => win.close());

	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
