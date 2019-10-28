import pageWorkerManager from './pageWorkerManager.js';
import webExtensionCommands from './webExtensionCommands.js';

var hotkeyWorker = null;

function RegisterWebextensionCommands() {
    hotkeyWorker = webExtensionCommands;
    hotkeyWorker.addEventListener(pageWorkerManager.EmitEventToActivePageWorker);
    hotkeyWorker.postMessage('attach');
}

function UnregisterHotkeys(){
    if (hotkeyWorker != null){
        hotkeyWorker.postMessage('detach');
        hotkeyWorker.removeEventListener('message', pageWorkerManager.EmitEventToActivePageWorker);
        hotkeyWorker = null;
    }
}

export default {
    RegisterHotkeys: RegisterWebextensionCommands,
    UnregisterHotkeys
}
