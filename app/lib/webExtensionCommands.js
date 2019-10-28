var emitEvent = () => {};

export default {
    addEventListener: listener => emitEvent = listener,
    removeEventListener: () => emitEvent = () => {},
    postMessage: message => {
        switch (message){
            case 'attach':
                browser.commands.onCommand.addListener(emitEvent);
                break;
            case 'detach':
                browser.commands.onCommand.removeListener(emitEvent);
                break;
            default:
                throw new Error('unexpected message sent to webExensionCommands.js');
        }
    }
}