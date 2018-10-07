/* global console */
import pageWorkerManager from './pageWorkerManager.js';
import webExtensionCommands from './webExtensionCommands.js';

var hotkeyWorker = null;
var fellBackToFirefoxHotkeys = false;

var RegistrationErrorHandler = function (error) {
    console.warn(`falling back to web extension commands due to: "${error.message}" in ${error.filename}:${error.lineno}-${error.colno}`);
    if (!fellBackToFirefoxHotkeys) {
        fellBackToFirefoxHotkeys = true;
        RegisterWebextensionCommands();
    }
};

var RegisterWebextensionCommands = () => {
    hotkeyWorker = webExtensionCommands;
    hotkeyWorker.addEventListener(pageWorkerManager.EmitEventToActivePageWorker);
    hotkeyWorker.postMessage('attach');
};

var RegisterHotkeys = function()
{
    if (hotkeyWorker != null) return;

    //switch (browser.runtime.PlatformOs)
    // always use webExtensionHotkeys for now; aka commands.
    switch ('default')
    {
        case 'win':
            console.log('Registering global hotkeys');
            if (require('sdk/simple-prefs').prefs.UseMkWin){
                hotkeyWorker = require('./mk-win.js');
                hotkeyWorker.addEventListener(pageWorkerManager.EmitEventToActivePageWorker);
                hotkeyWorker.onerror = RegistrationErrorHandler;
                //hotkeyWorker.postMessage("debug");
            }
            else{
                var {Cu} = require('chrome');       
                var {ChromeWorker} = Cu.import('resource://gre/modules/Services.jsm', null);
                hotkeyWorker = new ChromeWorker(require('sdk/self').data.url('../lib/windowsHotkeys.js'));
                hotkeyWorker.addEventListener('message', pageWorkerManager.EmitEventToActivePageWorker);
                hotkeyWorker.onerror = RegisterWebextensionCommands;
            }
            hotkeyWorker.postMessage('attach');
            break;
        case 'linux':
            console.log('Registering DBus hotkeys');
            hotkeyWorker = require('./linuxDBusHotkeys');
            hotkeyWorker.addEventListener(pageWorkerManager.EmitEventToActivePageWorker);
            if (hotkeyWorker.gLibsExist) {
                try
                {
                    hotkeyWorker.postMessage('attach');
                }
                catch (exception)
                {
                    RegisterWebextensionCommands();
                }
                break;
            } else {
                console.log('DBus not supported. glib, gobject and gio libaries are required.');
            }
        case 'mac':
            console.log('Registering global hotkeys');
            hotkeyWorker = require('./darwinKeys');
            hotkeyWorker.addEventListener(pageWorkerManager.EmitEventToActivePageWorker);
            hotkeyWorker.postMessage('attach');
            break;
        default:
            // console.log(`Global hotkeys not supported for ${browser.runtime.PlatformOs}. Falling back to browser hotkeys`);
            RegisterWebextensionCommands();
    }

};

var UnregisterHotkeys = function(){
    if (hotkeyWorker != null){
        hotkeyWorker.postMessage('detach');
        hotkeyWorker.removeEventListener('message', pageWorkerManager.EmitEventToActivePageWorker);
        hotkeyWorker = null;
        fellBackToFirefoxHotkeys = false;
    }
};

export default {
    RegisterHotkeys,
    UnregisterHotkeys
}
