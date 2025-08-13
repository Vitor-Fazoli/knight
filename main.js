const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadFile('index.html');
}

// Handler para abrir o diálogo de seleção de diretório
ipcMain.handle('select-directory', async () => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            title: 'Selecione um diretório'
        });

        if (result.canceled) {
            return { success: false, message: 'Seleção cancelada' };
        }

        const selectedPath = result.filePaths[0];
        const knightFolderPath = path.join(selectedPath, '.knight');

        // Criar a pasta .knight
        try {
            await fs.mkdir(knightFolderPath, { recursive: true });
            return {
                success: true,
                message: 'Pasta .knight criada com sucesso!',
                path: knightFolderPath
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao criar pasta: ${error.message}`
            };
        }

    } catch (error) {
        return {
            success: false,
            message: `Erro ao abrir diálogo: ${error.message}`
        };
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});