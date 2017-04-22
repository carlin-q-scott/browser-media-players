browser = chrome || browser

function send(message) {
    function sendMessageToTabs(audibleTabs) {
        for (let tab of audibleTabs) {
            console.log(`sending ${message} message to tab #${tab.index + 1}`)
            browser.tabs.sendMessage(tab.id, message, response => console.log(response))
        }
    }
    browser.tabs.query({ audible: true }, sendMessageToTabs)
}

browser.commands.onCommand.addListener(send)