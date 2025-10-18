const { autoUpdater } = require('electron-updater');
const { dialog, BrowserWindow, ipcMain } = require('electron');
const log = require('electron-log');

let updaterWindow = null;

function initUpdater(mainWindow) {
	autoUpdater.logger = log;
	log.transports.file.level = 'info';

	// events for autoUpdater
	autoUpdater.on('checking-for-update', () => {
		log.info('checking for update...');
		mainWindow.webContents.send('updater:status', { status: 'checking' });
	});

	autoUpdater.on('update-available', (info) => {
		log.info(`update available: ${info.version}`);
		mainWindow.webContents.send('updater:status', { status: 'available', version: info.version });
	});

	autoUpdater.on('update-not-available', (info) => {
		log.info(`no update: ${info.version}`);
		mainWindow.webContents.send('updater:status', { status: 'none' });
	});

	autoUpdater.on('error', (err) => {
		log.error('update error:', err);
		mainWindow.webContents.send('updater:status', { status: 'error', message: err.message });
	});

	autoUpdater.on('download-progress', (progress) => {
		mainWindow.webContents.send('updater:progress', { percent: Math.floor(progress.percent) });
	});

	autoUpdater.on('update-downloaded', (info) => {
		log.info('update downloaded');

		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				buttons: ['Restart now', 'Later'],
				defaultId: 0,
				cancelId: 1,
				title: 'Update ready',
				message: `v${info.version} downloaded`,
				detail: 'restart now to apply it?'
			})
			.then((res) => {
				if (res.response === 0) autoUpdater.quitAndInstall();
			});
	});
}

module.exports = { initUpdater };
