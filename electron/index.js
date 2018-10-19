const electron = require('electron');
const path = require('path');
const url = require('url');
const logger = require('electron-log');
const getPort = require('get-port');
const isDev = require('electron-is-dev');
const kill = require('tree-kill');
const sleep = require('system-sleep');

const { app, BrowserWindow, dialog } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// The server process
const JAR = 'demo-0.0.1-SNAPSHOT.jar'; // how to avoid manual update of this?
const MAX_CHECK_COUNT = 10;
let serverProcess;

function startServer(port) {
  const platform = process.platform;

  let server = `${path.join(app.getAppPath(), '..', '..', JAR)}`;
  let javaInJre = `${path.join(app.getAppPath(), '..', '..', 'jre/bin','java')}`;;

  logger.info(`Launching server with jar ${server} at port ${port}...`);

  // dev will use local
  if(isDev){
    javaInJre = 'java';
    server = `${path.join(app.getAppPath(), '..', '..', '..','..','..','..', '..', 'spring/target', JAR)}`
  }
  serverProcess = require('child_process')
          .spawn(javaInJre, [ '-jar', server, `--server.port=${port}`]);

  serverProcess.stdout.on('data', data => {
    logger.info('SERVER: ' + data);
  });

  serverProcess.stderr.on('data', data => {
    logger.error('SERVER: ' + data);
  });

  if (serverProcess.pid) {
    logger.info("Server PID: " + serverProcess.pid);
  } else {
    logger.error("Failed to launch server process.")
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false
    }
  })

  // and load the splash screen of the app
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

function loadHomePage(baseUrl) {
  logger.info(`Loading home page at ${baseUrl}`);
  // check server health and switch to main page
  checkCount = 0;
  const axios = require('axios');
  setTimeout(function cycle() {
    axios.get(`${baseUrl}`)
      .then(response => {
        mainWindow.loadURL(`${baseUrl}`);
      })
      .catch(e => {
        if (checkCount < MAX_CHECK_COUNT) {
          checkCount++;
          setTimeout(cycle, 1000);
        } else {
          dialog.showErrorBox('Server timeout',
            `UI does not receive server response for ${MAX_CHECK_COUNT} seconds.`);
          app.quit()        
        }
      });
  }, 200);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  // Create window first to show splash before starting server
  createWindow();

  // Start server at an available port (prefer 8080)
  getPort({ port: 7001 }).then(port => {
    startServer(port);
    loadHomePage(`http://localhost:${port}`)
  })
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()

    getPort({ port: 7001 }).then(port => {
      startServer(port);
      loadHomePage(`http://localhost:${port}`)
    })
  }
});

app.on('will-quit', () => {
  if( serverProcess !== null ) {
    logger.info(`Killing server process ${serverProcess.pid}`);
    kill(serverProcess.pid, 'SIGTERM', function (err) {
      logger.info('Server process killed');
      serverProcess = null;
    });
  }

  // as in mac sometime kill not succeed immediately, should wait for seconds and re-kill it
  while( serverProcess !== null ){
    logger.info(`Killing again process ${serverProcess.pid}`);
    kill(serverProcess.pid, 'SIGTERM', ()=> {serverProcess = null;});
    sleep(1000);
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.