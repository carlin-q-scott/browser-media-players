let defaultCommands = Object.freeze({
    MediaPlayPause: 'MediaPlayPause',
    MediaNextTrack: 'MediaNextTrack',
    MediaPrevTrack: 'MediaPrevTrack',
    MediaStop: 'MediaStop'
});
let defaultPreferences = Object.freeze({
    autoplay: false
});
let defaultRuntimeContentScripts = Object.freeze({
    jamstash: "http://127.0.0.1:32400/*",
    plex: "",
    madsonic: "",
    subsonic: ""
});

function captureKeyCombo(event) {
    var keyCombo =
        (event.ctrlKey ? 'Ctrl+' : '') +
        (event.shiftKey ? 'Shift+' : '') +
        (event.altKey ? 'Alt+' : '') +
        (event.metaKey ? 'Meta' : '') +
        event.key;
    
    // fixup keyCombo
    keyCombo = keyCombo.replace('Arrow','')
    
    event.stopPropagation();
    event.preventDefault();
    event.srcElement.value = keyCombo;
}

function getPreferences(defaultPreferences) {
    let preferences = Object.assign({}, defaultPreferences);

    Object.keys(preferences).forEach(pref => {
        let prefElement = document.getElementById(pref);
        switch (prefElement.type){
            case 'checkbox':
                preferences[pref] = prefElement.checked;
                break;
            default:
                preferences[pref] = prefElement.value;
        }
    });

    return preferences;
}

function setPreferences(preferences) {
    Object.keys(preferences).forEach(pref => {
        let prefElement = document.getElementById(pref);
        switch (prefElement.type){
            case 'checkbox':
                prefElement.checked = preferences[pref];
                break;
            default:
                prefElement.value = preferences[pref];
        }
    });
}

function saveCommands() {
    let commands = getPreferences(defaultCommands);
    browser.storage.sync.set({
        commands: commands
    });
    Object.keys(commands).forEach(comm => {
        browser.commands.update({
            name: comm,
            shortcut: commands[comm]
        });
    });
}

function savePreferences() {
    browser.storage.sync.set({
        preferences: getPreferences(defaultPreferences)
    });
}

function saveRuntimeContentScripts() {
    browser.storage.sync.set({
        runtimeContentScripts: getPreferences(defaultRuntimeContentScripts)
    });
}

async function restoreOptions() {
    let defaultOptions = {
        preferences: defaultPreferences,
        commands: defaultCommands,
        runtimeContentScripts: defaultRuntimeContentScripts
    };
    
    var options = await browser.storage.sync.get(defaultOptions);
    setPreferences(options.commands);
    setPreferences(options.runtimeContentScripts);
    setPreferences(options.preferences);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener('keydown', captureKeyCombo);
document.addEventListener('submit', event => {
    switch (event.srcElement.id) {
        case 'commands':
            saveCommands();
            break;
        case 'preferences':
            savePreferences();
            break;
        case 'runtimeContentScripts':
            saveRuntimeContentScripts();
            break;
        default:
            throw new Error('unknown form submitted');
    }
    event.preventDefault();
})