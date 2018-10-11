import Options from './Options.js';

class CommandOptions extends Options {
    handleKeyDown(event) {
        if (event.key == 'Tab') return;
        if (event.srcElement.parentElement.parentElement.parentElement.id != 'commands') return;
        
        var keyCombo =
            (event.ctrlKey ? 'Ctrl+' : '') +
            (event.shiftKey ? 'Shift+' : '') +
            (event.altKey ? 'Alt+' : '') +
            (event.metaKey ? 'Command+' : '');
            
        if (/(Control|Shift|Alt|Command)/.test(event.key) == false) 
            keyCombo += event.key;
        
        // fixup keyCombo
        keyCombo = keyCombo.replace('Arrow','').replace('TrackNext', 'NextTrack').replace('TrackPrevious','PrevTrack');
        
        event.stopPropagation();
        event.preventDefault();
        event.srcElement.value = keyCombo;
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

    /** @description activates command bindings
     *  @param {object} options for command bindings
     */
    static activate(options) {
        if (window.matchMedia('screen and (-webkit-min-device-pixel-ratio:0)').matches) return;
        if (!options) throw new Error('options are required');

        Object.keys(options).forEach(comm => {
            if (options[comm] == ''){
                browser.commands.reset(comm);
            }
            else {
                browser.commands.update({
                    name: comm,
                    shortcut: options[comm]
                })
            }
        });
    }

    async activate() {
        return this.initializing.then(CommandOptions.activate);
    }
}

export default CommandOptions;