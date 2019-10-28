import hotkeyManager from './lib/hotkeyManager.js';
import pageWorkerManager from './lib/pageWorkerManager.js';
import CommandOptions from './options/CommandOptions.js';
import ContentScriptOptions from './options/ContentScriptOptions.js';
import isFirefoxPromise from '../lib/isFirefoxPromise.js'


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

isFirefoxPromise.then(isFirefox => {
    if (isFirefox) new CommandOptions().activate();
});

browser.pageAction.onClicked(tab => {
    // TODO: find match in contentScripts.json or storage (custom domains) to get correct matches pattern and scripts to load
    browser.permissions.request({
        origins: matches
    }).then(approved => {
        if (approved)
            // TODO: register content scripts
        else
            alert('you need to approve Browser Media Player access to this site in order to enable media keys');
    });
})