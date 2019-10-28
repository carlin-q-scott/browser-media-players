import CommandOptions from './CommandOptions.js';
import UserOptions from './UserOptions.js';
import ContentScriptOptions from './ContentScriptOptions.js';
import isFirefoxPromise from '../lib/isFirefoxPromise.js'

let commandOptions = new CommandOptions();
let contentScriptOptions = new ContentScriptOptions();

document.addEventListener('DOMContentLoaded', () => {
    isFirefoxPromise.then(isFirefox => {
        if (isFirefox) commandOptions.updatePage();
        else document.querySelector('div#commandsDiv').setAttribute('style', 'display: none;')
    });

    UserOptions.updatePage();
    contentScriptOptions.updatePage();
});
document.addEventListener('keydown', commandOptions.handleKeyDown);
document.addEventListener('keyup', commandOptions.handleKeyUp);
document.addEventListener('reset', commandOptions.handleReset);
document.addEventListener('submit', event => {
    switch (event.srcElement.id) {
        case 'commands':
            commandOptions.save();
            break;
        case 'preferences':
            UserOptions.save();
            break;
        case 'contentScripts':
            contentScriptOptions.save();
            break;
        default:
            throw new Error('unknown form submitted');
    }
    event.preventDefault();
})