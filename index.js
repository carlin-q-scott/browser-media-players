import hotkeyManager from './lib/hotkeyManager.js';
import pageWorkerManager from './lib/pageWorkerManager.js';

pageWorkerManager.Init();

function unload() {
    hotkeyManager.UnregisterHotkeys();
    pageWorkerManager.Destroy();
}

function onPrefChange() { //re-register content scripts
    hotkeyManager.UnregisterHotkeys();
    pageWorkerManager.Destroy();
    pageWorkerManager.Init();
}

// preferences.on("", onPrefChange);