import Options from './Options.js'

class Manifest {
    getContentScriptsFor(site) {
        return manifest.content_scripts.find(cs => cs.js.some(jsf => jsf.indexOf(site) > 0)).js;
    }
    get jamstash(){ return this.getContentScriptsFor('jamstash') }
    get plex(){ return this.getContentScriptsFor('plex') }
    get madsonic(){ return this.getContentScriptsFor('madsonic') }
    get subsonic(){ return this.getContentScriptsFor('subsonic') }

    constructor() {
        this.manifest = browser.runtime.getManifest();
    }
}

const manifest = new Manifest();

class ContentScriptOptions extends Options {
    constructor() {
        super(
            'contentScripts',
            {
                jamstash: "",
                plex: "",
                madsonic: "",
                subsonic: ""
            },
            'sync'
        );
    }
    
    /* global chrome: false */
    static activate(options = this.options) {
        // todo: handle removal of old matches
        options.entries.forEach(siteName => {
            let matches = options[siteName];
            if (matches.length > 0) {
                let js = manifest[siteName];
                if (chrome) {   // or Opera
                    var requestPermissions = function(){
                        chrome.permissions.request({
                            origins: matches
                        }, granted => {
                            if (granted) {
                                chrome.tabs.onUpdated.addListener(tabInfo => {
                                    if (new RegExp(matches).test(tabInfo.url)) {
                                        chrome.tabs.executeScript(tabInfo.id, { js });
                                    }
                                });
                            }
                            else if (confirm("You must grant permission for 'Media Keys' to this site in order for it to control the media player on the site. Will you accept the request?")) {
                                requestPermissions();
                            }
                        });
                    }
                    requestPermissions();
                }
                else { // firefox
                    browser.contentScripts.register({ matches, js });
                }
            }
        });
    }
}

export default ContentScriptOptions;