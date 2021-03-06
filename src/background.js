'use strict'

import {app, protocol, BrowserWindow, screen, ipcMain} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { getStorageInfo, setStorageInfo } from './modules/ElectronStorage';
const isDevelopment = process.env.NODE_ENV !== 'production';
import MainServer from './server';

// eslint-disable-next-line no-unused-vars
let mainServer = new MainServer;

let win = null;
let winMess = [];
let cfg = {
  width: null,
  height: null,
  maximized: null,
}
// eslint-disable-next-line no-unused-vars
let cfgChanged = false

function messageToWin(msg) {
  if (win !== null) {
    win.webContents.send('messageToWin', msg)
  } else {
    winMess.push(msg)
  }
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { secure: true, standard: true }
}])

async function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  cfg = await getStorageInfo('cfg.json')
  // messageToWin(cfg)
  // messageToWin(screen.getPrimaryDisplay())

  if (cfg.width == null) {
    cfg.width = width * 0.85
    cfgChanged = true
  }
  if (cfg.height == null) {
    cfg.height = height * 0.85
    cfgChanged = true
  }

  win = new BrowserWindow({
    width: cfg.width,
    height: cfg.height,
    backgroundColor: '#121212',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    frame: false,
  })

  win.setMenu(null);
  if (cfg.maximized) {
    win.maximize();
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on("resize", () => {
    if (win !== null) win.webContents.send('window-resize', win.isMaximized());

    let size   = win.getSize()
    let wSize = {
      height: size[1],
      width: size[0]
    }
    cfg.maximized = false
    cfg.height = wSize.height
    cfg.width = wSize.width
    cfgChanged = true

    messageToWin(wSize);
  });

  win.on('closed', () => {
    win = null
  })

  winMess.forEach((i)=>{
    messageToWin(i)
  })
  winMess = []
}

// feel90d: Serial port will NOT work in renderer WITHOUT this line.
app.allowRendererProcessReuse = false;


// Quit when all windows are closed.
app.on('window-all-closed', () => {

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createMainWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on("window-minimize", () => {
  win.minimize();
})

ipcMain.on("window-maximize", () => {
  win.maximize();
  cfg.maximized = true;
  cfgChanged = true
})

ipcMain.on("window-unmaximize", () => {
  win.unmaximize();
  cfg.maximized = false;
  cfgChanged = true;
})

ipcMain.on("window-close", () => {
  (async ()=>{
    if (cfgChanged) {
      await setStorageInfo('cfg.json', cfg)
    }
    win.close();
  })()
})
