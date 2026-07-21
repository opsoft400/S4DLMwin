const { contextBridge, ipcRenderer } = require('electron');

// Mirrors the exact interface MainActivity.java exposes as window.AndroidBridge,
// so index.html's `isAndroid = !!window.AndroidBridge` check and its
// fire-and-forget + callback pattern (window.onAndroidFolderPicked /
// window.onAndroidSaveResult) work unchanged on Windows.
contextBridge.exposeInMainWorld('AndroidBridge', {
  pickFolder: () => {
    ipcRenderer.invoke('pick-folder').then((dir) => {
      if (typeof window.onAndroidFolderPicked === 'function') {
        window.onAndroidFolderPicked(dir);
      }
    });
  },
  hasFolder: () => {
    return ipcRenderer.sendSync('has-folder-sync');
  },
  saveFile: (filename, base64Data) => {
    ipcRenderer.invoke('save-file', filename, base64Data).then((ok) => {
      if (typeof window.onAndroidSaveResult === 'function') {
        window.onAndroidSaveResult(ok);
      }
    });
  },
});
