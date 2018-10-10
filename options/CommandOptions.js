import Options from './Options.js';

export default class CommandOptions extends Options {
    handleKeyDown(event) {
        var keyCombo =
            (event.ctrlKey ? 'Ctrl+' : '') +
            (event.shiftKey ? 'Shift+' : '') +
            (event.altKey ? 'Alt+' : '') +
            (event.metaKey ? 'Meta' : '') +
            event.key;
        
        // fixup keyCombo
        keyCombo = keyCombo.replace('Arrow','').replace('TrackNext', 'NextTrack').replace('TrackPrevious','PrevTrack');
        
        event.stopPropagation();
        event.preventDefault();
        event.srcElement.value = keyCombo;
    }

    updateBindings(commands) {
        Object.keys(commands).forEach(comm => {
            browser.commands.update({
                name: comm,
                shortcut: commands[comm]
            })
            .then(console.log)
            .catch(console.error);
        });
    }

    constructor() {
        super(
            'commands',
            {
                MediaPlayPause: 'MediaPlayPause',
                MediaNextTrack: 'MediaNextTrack',
                MediaPrevTrack: 'MediaPrevTrack',
                MediaStop: 'MediaStop'
            },
            'local'
        );
    }
}