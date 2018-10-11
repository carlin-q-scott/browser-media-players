/** @description abstract class for managing extension options */
class Options {
    /** @param {string} storeKey used to store options in browser.storage
     *  @param {object} defaults for options
     *  @param {string} storageLocation for browser.storage (options are: sync and local)
     */
    constructor(storeKey, defaults, storageLocation){
        this.storeKey = storeKey;
        this.options = defaults;
        this.storageLocation = storageLocation;
        
        this.initializing = this.updateFromStorage();
    }

    /** @description wraps the options in a browser storage object
     *  @param {object} optional options object to wrap
     *  @returns {object} object for persisting to browser.storage
    */
    forStorage(options) {
        if (!options) options = this.options;
        
        let optionsForStorage = {};
        optionsForStorage[this.storeKey] = options;
        
        return optionsForStorage;
    }

    /** @description updates this object from in browser.storage */
    updateFromStorage() {
        // console.log(`loading ${this.storeKey} from storage`);
        return browser.storage[this.storageLocation]
            .get(this.forStorage(this.options))
            .then(storedOptions => {
                // console.log(storedOptions);
                this.options = storedOptions[this.storeKey];
            });
    }

    /** @description update this object from what's entered on the options page */
    updateFromPage() {
        Object.keys(this.options).forEach(pref => {
            let prefElement = document.getElementById(pref);
            switch (prefElement.type){
                case 'checkbox':
                    this.options[pref] = prefElement.checked;
                    break;
                default:
                    this.options[pref] = prefElement.value;
            }
        });
    }
    
    /** @description update the options page */
    updatePage() {
        this.initializing.then(() => {
            Object.keys(this.options).forEach(opt => {
                let prefElement = document.getElementById(opt);
                if (!prefElement) return;
                switch (prefElement.type){
                    case 'checkbox':
                        prefElement.checked = this.options[opt];
                        break;
                    default:
                        prefElement.value = this.options[opt];
                }
            });
        });
    }
    
    /** @description persists to storage */
    save() {
        this.updateFromPage();
        browser.storage[this.storageLocation].set(this.forStorage());
    }
}

export default Options;