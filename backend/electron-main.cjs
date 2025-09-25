const { app, BrowserWindow, ipcMain, shell, Menu, protocol } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { readJson, writeJson, editJson, updateFastFlag, updateSoberConf } = require(
	path.join(__dirname, 'helpers', 'jsonHelper.cjs')
);
const { downloadFileFromUrl } = require(path.join(__dirname, 'helpers', 'filestream.cjs'));
const { Mutex } = require('async-mutex');
const { replaceFileContents } = require('./helpers/fileReplacer.cjs');

const configMutex = new Mutex();

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

	const startURL = process.env.ELECTRON_START_URL ? process.env.ELECTRON_START_URL : 'app://./';

	console.log(startURL);
	win.loadURL(startURL);
	win.webContents.openDevTools();
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
			callback({ path: path.join(__dirname, '..', 'build', 'index.html') });
		} else {
			callback({ path: path.join(__dirname, '..', 'build', url) });
		}
	});
	ipcMain.handle('read-file', async (_, filePath) => {
		try {
			// handle ~ expansion
			if (filePath.startsWith('~')) {
				filePath = path.join(os.homedir(), filePath.slice(1));
			}

			const data = await fs.promises.readFile(filePath, 'utf8');
			return { ok: true, data };
		} catch (err) {
			return { ok: false, error: err.message };
		}
	});

	ipcMain.handle('write-file', async (_, filePath, content) => {
		try {
			if (filePath.startsWith('~')) {
				filePath = path.join(os.homedir(), filePath.slice(1));
			}
			await fs.promises.writeFile(filePath, content, 'utf8');
			return { ok: true };
		} catch (err) {
			return { ok: false, error: err.message };
		}
	});

	ipcMain.handle('github:downloadlfs', async (_, url, fileName) => {
		return downloadFileFromUrl(url, fileName);
	});

	ipcMain.handle('local:get-assets', async () => {
		const assetsDir = path.join(app.getPath('userData'), 'marketplace_assets');
		try {
			if (!fs.existsSync(assetsDir)) {
				fs.mkdirSync(assetsDir, { recursive: true });
			}
			const files = await fs.promises.readdir(assetsDir);
			return { ok: true, files };
		} catch (err) {
			return { ok: false, error: err.message };
		}
	});

	ipcMain.handle('local:delete-asset', async (_, fileName) => {
		const assetsDir = path.join(app.getPath('userData'), 'marketplace_assets');
		const filePath = path.join(assetsDir, fileName);
		try {
			await fs.promises.unlink(filePath);
			return { ok: true };
		} catch (err) {
			return { ok: false, error: err.message };
		}
	});

	ipcMain.handle('local:get-assets-path', async () => {
		return path.join(app.getPath('userData'), 'marketplace_assets');
	});

	// // apply change
	// ipcMain.handle('apply-changes', async () => {
	// 	const config = new Config();
	// 	const files = new FilesFunctions();
	// 	return ApplyChanges(config, files);
	// });

	// font
	ipcMain.handle('mod:replace', async (_, fileContent, fileName) => {
		const overlayFontDir = path.join(
			os.homedir(),
			'.var',
			'app',
			'org.vinegarhq.Sober',
			'data',
			'sober',
			'asset_overlay',
			'content',
			'fonts'
		);
		const sourceFontDir = path.join(
			os.homedir(),
			'.var',
			'app',
			'org.vinegarhq.Sober',
			'data',
			'sober',
			'asset',
			'content',
			'fonts'
		);
		const tempFilePath = path.join(os.tmpdir(), fileName);

		try {
			if (!fs.existsSync(overlayFontDir)) {
				fs.mkdirSync(overlayFontDir, { recursive: true });
			}

			const filesInOverlay = await fs.promises.readdir(overlayFontDir);
			if (filesInOverlay.length === 0) {
				console.log(`Overlay font directory ${overlayFontDir} is empty. Copying original fonts from ${sourceFontDir}.`);
				if (fs.existsSync(sourceFontDir)) {
					const originalFonts = await fs.promises.readdir(sourceFontDir);
					for (const fontFile of originalFonts) {
						const srcPath = path.join(sourceFontDir, fontFile);
						const destPath = path.join(overlayFontDir, fontFile);
						if (fs.lstatSync(srcPath).isFile()) {
							fs.copyFileSync(srcPath, destPath);
							console.log(`Copied ${fontFile} to ${overlayFontDir}`);
						}
					}
				} else {
					console.warn(`Original font directory ${sourceFontDir} does not exist.`);
				}
			}

			await fs.promises.writeFile(tempFilePath, Buffer.from(fileContent));
			replaceFileContents(tempFilePath, overlayFontDir);
			return { ok: true };
		} catch (error) {
			console.error(`Error in mod:replace: ${error.message}`);
			return { ok: false, error: error.message };
		} finally {
			// Clean up the temporary file
			if (fs.existsSync(tempFilePath)) {
				await fs.promises.unlink(tempFilePath);
			}
		}
	});

	// json
	ipcMain.handle('json:read', async (_, filePath) => {
		if (filePath.startsWith('~')) {
			filePath = path.join(os.homedir(), filePath.slice(1));
		}
		return await readJson(filePath);
	});

	ipcMain.handle('json:write', async (_, filePath, data) => {
		if (filePath.startsWith('~')) {
			filePath = path.join(os.homedir(), filePath.slice(1));
		}
		return await writeJson(filePath, data);
	});

	ipcMain.handle('sober:update', async (_, filePath, key, value) => {
		return await configMutex.runExclusive(async () => {
			if (filePath.startsWith('~')) {
				filePath = path.join(os.homedir(), filePath.slice(1));
			}
			return await updateSoberConf(filePath, key, value);
		});
	});

	ipcMain.handle('fastflag:update', async (_, filePath, key, value) => {
		return await configMutex.runExclusive(async () => {
			if (filePath.startsWith('~')) {
				filePath = path.join(os.homedir(), filePath.slice(1));
			}
			return await updateFastFlag(filePath, key, value);
		});
	});

	ipcMain.handle('json:edit', async (_, filePath, updaterStr) => {
		if (filePath.startsWith('~')) {
			filePath = path.join(os.homedir(), filePath.slice(1));
		}
		// deserialize updater (stringified function from renderer)
		const updater = eval(`(${updaterStr})`);
		return await editJson(filePath, updater);
	});

	// browser windows stuf
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

	ipcMain.handle('local:apply-asset', async (_, fileName) => {
		const assetsDir = path.join(app.getPath('userData'), 'marketplace_assets');
		const filePath = path.join(assetsDir, fileName);
		const overlayDir = path.join(
			os.homedir(),
			'.var',
			'app',
			'org.vinegarhq.Sober',
			'data',
			'sober',
			'asset_overlay'
		);

		try {
			// Clean the directory
			if (fs.existsSync(overlayDir)) {
				fs.rmSync(overlayDir, { recursive: true, force: true });
			}
			fs.mkdirSync(overlayDir, { recursive: true });

			// Copy the asset
			const destPath = path.join(overlayDir, fileName);
			fs.copyFileSync(filePath, destPath);

			return { ok: true };
		} catch (err) {
			return { ok: false, error: err.message };
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
