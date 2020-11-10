'use strict'

import {app, protocol, BrowserWindow, screen, ipcMain, ipcRenderer} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { secure: true, standard: true }
}])

let win, worker = null

async function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: width * 0.85,
    height: height * 0.85,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    frame: false,
  })

  win.setMenu(null);

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
  });

  win.on('closed', () => {
    win = null
    worker = null;
  })
}

async function createWorkerWindow(callback) {
  // Create the worker window.
  worker = new BrowserWindow({
    webPreferences: {
      parent: win,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  // feel90d: Should stay here, BEFORE worker.loadURL
  worker.webContents.on('did-finish-load', () => {
    if (typeof callback == 'function') {
      callback();
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // and worker
    await worker.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "worker.html")

    if (!process.env.IS_TEST) worker.webContents.openDevTools()
  } else {
    // Load worker
    worker.loadURL('app://./worker.html')
  }

  // set to null
  worker.on('closed', () => {
    worker = null;
  });
}


// feel90d: Serial port will NOT work in renderer WITHOUT this line.
app.allowRendererProcessReuse = false;


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
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
})

ipcMain.on("window-unmaximize", () => {
  win.unmaximize();
})

ipcMain.on("window-close", () => {
  win.close();
})

ipcMain.on("click-from-renderer", () => {
  if (worker == null) {
    createWorkerWindow(() => {
      worker.webContents.send('ping', 'created!')
    })
  } else {
    worker.webContents.send('ping', 'whoooooooh!')
  }
})

ipcMain.on("port-selection", () => {
  if (worker == null) {
    createWorkerWindow(() => {
      worker.webContents.send('port-selection', 'port selected')
    })
  } else {
    worker.webContents.send('port-selection', 'port selected')
  }

  let timer = setTimeout(()=>{
    win.webContents.send('port-response', 'server timeOut')
    ipcMain.removeListener('port-response', ()=>{
    })
  }, 1000)

  ipcMain.on("port-response", () => {
    clearTimeout(timer);
    win.webContents.send('port-response', 'server response')
  })
})