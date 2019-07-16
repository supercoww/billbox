const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {
	win = new BrowserWindow({
		title: 'Billbox',
		width: 870,
		height: 600,
		show: false,
		autoHideMenuBar: true
	});

	win.loadURL(
		url.format({
			pathname: path.join(__dirname, `/dist/billbox/index.html`),
			protocol: 'file:',
			slashes: true
		})
	);

	win.on('ready-to-show', win.show);

	app.on('ready', function() {
		autoUpdater.checkForUpdatesAndNotify();
	});

	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
