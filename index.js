import hotkeyManager from './lib/hotkeyManager.js';
import pageWorkerManager from './lib/pageWorkerManager.js';
import CommandOptions from './options/CommandOptions.js';
import ContentScriptOptions from './options/ContentScriptOptions.js';
import UserOptions from './options/UserOptions.js';

pageWorkerManager.Init();

function unload() {
    hotkeyManager.UnregisterHotkeys();
    pageWorkerManager.Destroy();
}

function onPrefChange(storageChange) { //re-register content scripts
    hotkeyManager.UnregisterHotkeys();
    pageWorkerManager.Destroy();

    // Handle changes
    if (storageChange.contentScripts)
        ContentScriptOptions.activate(storageChange.contentScripts.newValue);
    if (storageChange.commands)
        CommandOptions.activate(storageChange.commands.newValue);
        
    pageWorkerManager.Init();
}

browser.storage.onChanged.addListener(onPrefChange);
