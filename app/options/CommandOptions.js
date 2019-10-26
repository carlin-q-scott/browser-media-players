import Options from './Options.js';

class CommandOptions extends Options {
    constructor() {
        super(
            'commands',
            {
                MediaPlayPause: '',
                MediaNextTrack: '',
                MediaPrevTrack: '',
                MediaStop: ''
            },
            'local'
        );
    }

    handleKeyDown(event) {
        if (event.key == 'Tab') return;
        if (event.srcElement.parentElement.parentElement.parentElement.id != 'commands') return;

        var keyCombo =
            (event.ctrlKey ? 'Ctrl+' : '') +
            (event.shiftKey ? 'Shift+' : '') +
            (event.altKey ? 'Alt+' : '') +
            (event.metaKey ? 'Command+' : '');

        if (/(Control|Shift|Alt|Command)/.test(event.key) == false) {
            var keyName = event.key;
            if (/^[a-z]$/.test(keyName)) keyName = keyName.toUpperCase();
            keyCombo += keyName;
        }
        
        // fixup keyCombo
        keyCombo = keyCombo.replace('Arrow','').replace('TrackNext', 'NextTrack').replace('TrackPrevious','PrevTrack');

        event.stopPropagation();
        event.preventDefault();
        event.srcElement.value = keyCombo;
    }

    handleKeyUp(event) {
        if (CommandOptions.isValid(event.srcElement.value)) {
            event.srcElement.classList.remove('error');
            event.srcElement.title = '';
        } else {
            event.srcElement.classList.add('error');
            event.srcElement.title = 'Key combo not supported. You must specify a media or function key, or a modified key (such as Ctrl+Shift+Right).';
        }
    }

    handleReset() {
        document.querySelectorAll('form#commands input.error').forEach(element => {
            element.classList.remove('error');
            element.title = '';
        })
    }

    static isValid(keyCombo) {
        return (/^\s*(Alt|Ctrl|Command|MacCtrl)\s*\+\s*(Shift\s*\+\s*)?([A-Z0-9]|Comma|Period|Home|End|PageUp|PageDown|Space|Insert|Delete|Up|Down|Left|Right)\s*$/.test(keyCombo)
             || /^\s*((Alt|Ctrl|Command|MacCtrl)\s*\+\s*)?(Shift\s*\+\s*)?(F[1-9]|F1[0-2])\s*$/.test(keyCombo)
             || /^(MediaNextTrack|MediaPlayPause|MediaPrevTrack|MediaStop)$/.test(keyCombo));

    }

    /** @description activates command bindings
     *  @param {object} options for command bindings
     */
    static activate(options) {
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