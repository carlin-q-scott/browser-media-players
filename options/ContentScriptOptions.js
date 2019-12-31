import Options from './Options.js'

const extensionBaseUrlRegex = /moz-extension:\/\/[\d\w-]+/;

class Manifest {
    getContentScriptsFor(site) {
        return this.manifest.content_scripts.find(cs => cs.js.some(jsf => jsf.indexOf(site) > 0)).js.map(script => {
            return { file: script.replace(extensionBaseUrlRegex, '') }; 
        });
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
                jamstash: '',
                plex: '',
                madsonic: '',
                subsonic: ''
            },
            'sync'
        );
    }

    static isValid(urlMatcher){
        return /:\d+\//.test(urlMatcher) == false;
    }

    handleBlur(event) {
        if (ContentScriptOptions.isValid(event.srcElement.value)) {
            event.srcElement.classList.remove('error');
            event.srcElement.title = '';
        } else {
            event.srcElement.classList.add('error');
            event.srcElement.title = 'Do not include the port number in your url matcher, such as ":32400"';
        }
    }

    /** @description activates custom site matches
     *  @param {object} options for custom sites
     */
    static activate(options) {
        if (!options) throw new Error('options are required');

        // todo: handle removal of old matches
        Object.keys(options).forEach(siteName => {
            let match = options[siteName];
            if (match.length > 0) {
                let matches = [ match ];
                let siteManifest = manifest[siteName];

                if (!browser.contentScripts.register) {   // Chrome or Opera
                    browser.tabs.onUpdated.addListener(tabInfo => {
                        if (new RegExp(match).test(tabInfo.url)) {
                            siteManifest.forEach(details => browser.tabs.executeScript(tabInfo.id, details));
                        }
                    });
                }
                else { // firefox
                    browser.contentScripts.register({ matches, js: siteManifest });
                }

                browser.tabs.query({
                    url: matches
                })
                    .then(tabs => {
                        tabs.forEach(tabInfo => {
                            siteManifest.forEach(details => browser.tabs.executeScript(tabInfo.id, details));
                        })
                    })
            }
        });
    }

    async activate() {
        return this.initializing.then(ContentScriptOptions.activate);
    }

    save() {
        this.updateFromPage();
        
        Object.keys(this.options).forEach(siteName => {
            let match = this.options[siteName];
            if (match.length > 0) {
                let matches = [ match ];
                browser.permissions.request({
                    origins: matches
                }).then(approved => {
                    if (approved)
                        browser.storage[this.storageLocation].set(this.forStorage());
                    else
                        alert('you need to approve access to the domain you specified');
                });
            }
        });
    }
}

export default ContentScriptOptions;