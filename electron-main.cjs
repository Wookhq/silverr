const { app, BrowserWindow, ipcMain, shell, Menu, protocol } = require('electron');
const path = require('path');
const os = require('os');

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
]);

let win;

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
		show: false,
    backgroundColor: '#1d232a'
	});
	
	Menu.setApplicationMenu(null);

	const startURL = process.env.ELECTRON_START_URL
		? process.env.ELECTRON_START_URL
		: 'app://./';

	console.log(startURL);
	win.loadURL(startURL); 
	// win.webContents.openDevTools();
	win.once('ready-to-show', () => win.show());
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    let url = request.url.substr(7);
    if (url.indexOf('?') > -1) {
      url = url.substr(0, url.indexOf('?'));
    }
    if (url.indexOf('#') > -1) {
      url = url.substr(0, url.indexOf('#'));
    }
    if (path.extname(url) === '') {
      callback({ path: path.join(__dirname, 'build', 'index.html') });
    } else {
      callback({ path: path.join(__dirname, 'build', url) });
    }
  });

	ipcMain.handle('open-path', async (_, filePath) => {
		if (filePath.startsWith('~')) {
			filePath = path.join(os.homedir(), filePath.slice(1));
		}
		await shell.openPath(filePath);
		return 'opened ' + filePath;
	});

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