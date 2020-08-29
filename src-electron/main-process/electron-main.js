import { app, BrowserWindow, nativeTheme, screen } from "electron";

// Update Server
require("update-electron-app")();
const { autoUpdater, dialog } = require("electron");

const server = "http://awslgit01:1337";
const url = `${server}/update/${process.platform}/${app.getVersion()}`;
autoUpdater.setFeedURL({
  url
});
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 60000);

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "Eine neue Version wurde heruntergeladen. Starte die Applikation neu damit du alle neuerungen bekommst."
  };

  dialog.showMessageBox(dialogOpts).then(returnValue => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});
autoUpdater.on("error", message => {
  console.error("Problem beim Softwareupdate ist aufgetreten");
  console.error(message);
});

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().size.width * (3 / 4),
    height: screen.getPrimaryDisplay().size.height * (17 / 20),
    frame: false,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration

      // nodeIntegration: QUASAR_NODE_INTEGRATION
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.allowRendererProcessReuse = false;
