import CommandOptions from './CommandOptions.js';
import UserOptions from './UserOptions.js';
import ContentScriptOptions from './ContentScriptOptions.js';

let commandOptions = new CommandOptions();
let userOptions = new UserOptions();
let contentScriptOptions = new ContentScriptOptions();

document.addEventListener('keydown', commandOptions.handleKeyDown);
document.addEventListener('submit', event => {
    switch (event.srcElement.id) {
        case 'commands':
            commandOptions.save();
            break;
        case 'preferences':
            userOptions.save();
            break;
        case 'contentScripts':
            contentScriptOptions.save();
            break;
        default:
            throw new Error('unknown form submitted');
    }
    event.preventDefault();
})