function send(message) {
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

browser.commands.onCommand.addListener(send)