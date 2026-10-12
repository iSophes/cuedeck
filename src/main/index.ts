import { app, BrowserWindow, nativeTheme, shell } from "electron";
import { join } from "node:path";

// Height of the custom titlebar. The renderer reads it back through the
// `titlebar-area-*` CSS env vars, so this is the only place it's defined.
const TITLEBAR_HEIGHT = 40;
const BACKGROUND = "#11111b";
const FOREGROUND = "#cdd6f4";

function createWindow(): void {
  const isMac = process.platform === "darwin";

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 500,
    show: false,
    backgroundColor: BACKGROUND,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: BACKGROUND,
      symbolColor: FOREGROUND,
      height: TITLEBAR_HEIGHT - 1,
    },
    ...(isMac && {
      trafficLightPosition: { x: 14, y: (TITLEBAR_HEIGHT - 14) / 2 },
    }),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  win.once("ready-to-show", () => win.show());

  // Open target="_blank" links in the user's browser instead of a new Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:") || url.startsWith("http:"))
      shell.openExternal(url);
    return { action: "deny" };
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

nativeTheme.themeSource = "dark";

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
