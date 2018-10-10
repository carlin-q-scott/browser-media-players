import Options from './Options.js'

class ContentScriptOptions extends Options {
    constructor() {
        super(
            'contentScripts',
            {
                jamstash: "http://127.0.0.1:32400/*",
                plex: "",
                madsonic: "",
                subsonic: ""
            },
            'sync'
        );
    }
}

export default ContentScriptOptions;