const { app, BrowserWindow, Menu, ipcMain, shell, dialog, Tray } = require('electron');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const axios = require('axios');
const notifier = require('node-notifier');

// Keep a global reference of the window object
let mainWindow;
let tray = null;
let isDevMode = process.argv.includes('--dev');

// App configuration
const APP_CONFIG = {
  name: 'Bob Empire',
  version: '2.2.0',
  minWidth: 1200,
  minHeight: 800,
  defaultWidth: 1400,
  defaultHeight: 900,
};

// WebSocket connection for real-time sync
let wsClient = null;
let deviceId = `desktop_${Date.now()}`;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: APP_CONFIG.defaultWidth,
    height: APP_CONFIG.defaultHeight,
    minWidth: APP_CONFIG.minWidth,
    minHeight: APP_CONFIG.minHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: APP_CONFIG.name,
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Load the main page
  if (isDevMode) {
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Connect to WebSocket for real-time sync
    connectWebSocket();
    
    // Show startup notification
    showNotification('Bob Empire Desktop', 'التطبيق جاهز للاستخدام!');
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window minimize to tray
  mainWindow.on('minimize', (event) => {
    if (process.platform === 'darwin') return;
    
    event.preventDefault();
    mainWindow.hide();
    
    if (!tray) {
      createTray();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../assets/tray-icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'عرض Bob Empire',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'دردشة الذكاء الاصطناعي',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('navigate-to', 'chat');
      }
    },
    {
      label: 'الوكلاء الذكية',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('navigate-to', 'agents');
      }
    },
    { type: 'separator' },
    {
      label: 'إغلاق التطبيق',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Bob Empire - منصة التجارة العالمية');
  
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function createMenu() {
  const template = [
    {
      label: 'ملف',
      submenu: [
        {
          label: 'جديد',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new');
          }
        },
        {
          label: 'فتح',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-action', 'open');
          }
        },
        {
          label: 'حفظ',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-action', 'save');
          }
        },
        { type: 'separator' },
        {
          label: 'إعدادات',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'settings');
          }
        },
        { type: 'separator' },
        {
          label: process.platform === 'darwin' ? 'إغلاق Bob Empire' : 'خروج',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'تحرير',
      submenu: [
        { label: 'تراجع', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'إعادة', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'قص', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'نسخ', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'لصق', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'تحديد الكل', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        { label: 'إعادة تحميل', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'إعادة تحميل قسري', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'أدوات المطور', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'الحجم الفعلي', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'تكبير', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'تصغير', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'ملء الشاشة', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'أدوات',
      submenu: [
        {
          label: 'دردشة الذكاء الاصطناعي',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'chat');
          }
        },
        {
          label: 'إدارة المتجر',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'store');
          }
        },
        {
          label: 'الوكلاء الذكية',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'agents');
          }
        },
        {
          label: 'ربط المنصات',
          accelerator: 'CmdOrCtrl+4',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'platforms');
          }
        },
        { type: 'separator' },
        {
          label: 'مزامنة البيانات',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            syncData();
          }
        },
        {
          label: 'ربط جهاز جديد',
          click: () => {
            showQRCode();
          }
        }
      ]
    },
    {
      label: 'مساعدة',
      submenu: [
        {
          label: 'حول Bob Empire',
          click: () => {
            showAboutDialog();
          }
        },
        {
          label: 'دليل المستخدم',
          click: () => {
            shell.openExternal('https://bobempire.com/docs');
          }
        },
        {
          label: 'الدعم الفني',
          click: () => {
            shell.openExternal('https://bobempire.com/support');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function connectWebSocket() {
  try {
    const wsUrl = process.env.WEBSOCKET_URL || 'ws://localhost:3000/ws';
    wsClient = new WebSocket(wsUrl);
    
    wsClient.on('open', () => {
      console.log('Connected to WebSocket server');
      
      // Register desktop client
      wsClient.send(JSON.stringify({
        type: 'register',
        deviceId: deviceId,
        platform: 'desktop',
        timestamp: new Date().toISOString()
      }));
      
      // Send to renderer
      mainWindow.webContents.send('websocket-status', { connected: true });
    });
    
    wsClient.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    wsClient.on('close', () => {
      console.log('WebSocket connection closed');
      mainWindow.webContents.send('websocket-status', { connected: false });
      
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    });
    
    wsClient.on('error', (error) => {
      console.error('WebSocket error:', error);
      mainWindow.webContents.send('websocket-status', { connected: false, error: error.message });
    });
    
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error);
  }
}

function handleWebSocketMessage(message) {
  switch (message.type) {
    case 'sync_data':
      mainWindow.webContents.send('sync-data', message.payload);
      break;
    case 'device_linked':
      showNotification('جهاز مرتبط', `تم ربط الجهاز: ${message.linkedDeviceId}`);
      mainWindow.webContents.send('device-linked', message);
      break;
    case 'chat_message':
      mainWindow.webContents.send('new-chat-message', message);
      break;
    case 'agent_update':
      mainWindow.webContents.send('agent-update', message.payload);
      break;
    case 'ping':
      wsClient.send(JSON.stringify({ type: 'pong', deviceId: deviceId }));
      break;
  }
}

function syncData() {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(JSON.stringify({
      type: 'sync_request',
      deviceId: deviceId,
      timestamp: new Date().toISOString()
    }));
    
    showNotification('مزامنة البيانات', 'جاري مزامنة البيانات...');
  } else {
    showNotification('خطأ في المزامنة', 'لا يوجد اتصال بالخادم');
  }
}

function showQRCode() {
  const qrcode = require('qrcode');
  const qrData = `bob_empire://${deviceId}`;
  
  qrcode.toDataURL(qrData, (err, url) => {
    if (err) {
      console.error('Error generating QR code:', err);
      return;
    }
    
    mainWindow.webContents.send('show-qr-code', { qrData, qrImage: url });
  });
}

function showNotification(title, body) {
  notifier.notify({
    title: title,
    message: body,
    icon: path.join(__dirname, '../assets/icon.png'),
    sound: true,
    wait: false
  });
}

function showAboutDialog() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'حول Bob Empire',
    message: 'Bob Empire Desktop',
    detail: `الإصدار: ${APP_CONFIG.version}\nمنصة التجارة العالمية بالذكاء الاصطناعي\n\nمطور بواسطة فريق Bob Empire`,
    buttons: ['حسناً']
  });
}

// IPC handlers
ipcMain.handle('get-device-id', () => deviceId);

ipcMain.handle('send-websocket-message', (event, message) => {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(JSON.stringify(message));
    return true;
  }
  return false;
});

ipcMain.handle('show-save-dialog', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'حفظ ملف',
    defaultPath: 'bob-empire-data.json',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result;
});

ipcMain.handle('show-open-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'فتح ملف',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });
  return result;
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (wsClient) {
    wsClient.close();
  }
});

// Handle protocol for deep linking
app.setAsDefaultProtocolClient('bob-empire');

app.on('open-url', (event, url) => {
  event.preventDefault();
  
  if (url.startsWith('bob-empire://')) {
    const deviceIdFromUrl = url.replace('bob-empire://', '');
    
    if (mainWindow) {
      mainWindow.webContents.send('device-link-request', { deviceId: deviceIdFromUrl });
      mainWindow.show();
      mainWindow.focus();
    }
  }
});

module.exports = { APP_CONFIG, deviceId };