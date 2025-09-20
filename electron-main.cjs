const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const os = require("os");

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.ELECTRON_START_URL) {
    win.loadURL(process.env.ELECTRON_START_URL);
  } else {
    win.loadFile(path.join(__dirname, "build/index.html"));
  }
}

app.whenReady().then(() => {
  ipcMain.handle("open-path", async (_, filePath) => {
    if (filePath.startsWith("~")) {
      filePath = path.join(os.homedir(), filePath.slice(1));
    }

    await shell.openPath(filePath);
    return "opened " + filePath;
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
