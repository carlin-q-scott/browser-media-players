
function send(message) {
    console.log(`extension received ${message} command`);
    browser.tabs.query({ audible: true }).then(audibleTabs => {
        for (let tab of audibleTabs) {
            console.log(`sending ${message} message to tab #${tab.index + 1}`)
            browser.tabs
                .sendMessage(tab.id, message)
                .then(response => {
                    console.log(response);
                    return true;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    })
}

var emitEvent;

export default {
    addEventListener: listener => emitEvent = listener,
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