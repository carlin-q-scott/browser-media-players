import hotkeyManager from './lib/hotkeyManager.js';
import pageWorkerManager from './lib/pageWorkerManager.js';
import CommandOptions from './options/CommandOptions.js';
import ContentScriptOptions from './options/ContentScriptOptions.js';

pageWorkerManager.Init();

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

new ContentScriptOptions().activate();

if (!window.matchMedia('-webkit-min-device-pixel-ratio:0').matches)   // Firefox
    new CommandOptions().activate();
