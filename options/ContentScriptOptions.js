import Options from './Options.js';

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

    static validate(urlMatcher){
        if (/:\d+\//.test(urlMatcher)) return 'Do not include the port number in your url';
    }

    handleValidation(event) {
        let validationFailureMessage = ContentScriptOptions.validate(event.srcElement.value);
        if (validationFailureMessage) {
            event.srcElement.classList.add('error');
            event.srcElement.title = 'Do not include the port number in your url matcher, such as ":32400"';
        }
        else {
            event.srcElement.classList.remove('error');
            event.srcElement.title = '';
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

                if (!browser.contentScripts) {   // Opera
                    browser.tabs.onUpdated.addListener(tabInfo => {
                        if (new RegExp(match).test(tabInfo.url)) {
                            siteManifest.forEach(details => browser.tabs.executeScript(tabInfo.id, details));
                        }
                    });
                }
                else {
                    browser.contentScripts.register({ matches, js: siteManifest });
                }
            }
        });
    }

    async activate() {
        return this.initializing.then(ContentScriptOptions.activate);
    }

    save() {
        this.updateFromPage();

        Promise.all(
            Object.keys(this.options).map(siteName => {
                let match = this.options[siteName];
                if (match.length > 0) return browser.permissions.request({ origins: [ match ] })
                    .then(permitted => {
                        let siteElement = document.getElementById(siteName);
                        if (permitted){
                            siteElement.classList.remove('error');
                            siteElement.title = '';
                        }
                        else{
                            siteElement.classList.add('error');
                            siteElement.title = 'You must permit access to the site.'
                        }
                        return permitted;
                    });
                else return Promise.resolve(true);
            })
        ).then(permissionRequests => {
            if (permissionRequests.every(b => b))
                browser.storage[this.storageLocation].set(this.forStorage());
        });
    }
}

export default ContentScriptOptions;