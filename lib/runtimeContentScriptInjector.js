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

class RuntimeContentScriptOptions {
    some() { return typeof(this.options) === 'object' }
    
    constructor(options = undefined) {
        if (options) this.options = options;
        else browser.storage.sync.get('runtimeContentScripts').then(options => this.options = options);
    }
}


let manifest = new Manifest();

/* global chrome:false */
function setupScriptInjection(matches, scripts){
    if (chrome) {
        var requestPermissions = function(){
            chrome.permissions.request({
                origins: matches
            }, granted => {
                if (granted) {
                    chrome.tabs.onUpdated.addListener(tabInfo => {
                        if (new RegExp(matches).matches(tabInfo.url)) {
                            chrome.tabs.executeScript(tabInfo.id, {
                                js: scripts
                            });
                        }
                    });
                }
                else if (confirm("You must grant permission for 'Media Keys' to this site in order for it to control the media player on the site. Will you accept the request?")) {
                    requestPermissions();
                }
            });
        }
        requestPermissions();
        // fuck Chrome
    }
    else { // firefox
        browser.contentScripts.register({
            matches,
            js: scripts
        });
    }
}

function activateCustomDomains(options = undefined) {
    if (!options) options = new RuntimeContentScriptOptions(options);

    if (options.some()) {
        options.options.entries.forEach(siteName => {
            let siteMatch = options.options[siteName];
            if (siteMatch.length > 0) setupScriptInjection([ siteMatch ], manifest[siteName])
        })
    }
}
activateCustomDomains();

// Todo: move this to index.js and modularize activate/deactivate
browser.storage.onChanged.addListener(storageChange => activateCustomDomains(storageChange.newValue));
