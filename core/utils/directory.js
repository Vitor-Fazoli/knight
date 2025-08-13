const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;


class Directory {

    path = "";

    constructor(dir) {
        path = dir;
    }

    scan() {
        let results = [];
        const list = fs.readdirSync(path);

        list.forEach(file => {
            const filePath = path.join(path, file);
            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                results = results.concat(scan(filePath));
            } else {
                results.push(filePath);
            }
        });

        return results;
    }
}