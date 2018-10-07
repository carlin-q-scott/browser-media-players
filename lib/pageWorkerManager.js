/**
 * Created by Carlin on 2/7/2016.
 */
import hotkeyManager from "./hotkeyManager.js";
var prefs = {};

/**
 * Keeps track of the page workers managed by this module
 */
var pageWorkers = {
    pageWorkers: [],
    get current(){
        return this.pageWorkers[this.pageWorkers.length - 1];
    },
    set current(worker){
        //only act if the array has more than one element
        if (this.pageWorkers.length > 1 && !this.current.pinned)
        {
            var indexOfWorker = this.pageWorkers.indexOf(worker);
            if (indexOfWorker != this.pageWorkers.length - 1)
            {
                //console.log("switching from " + pageWorkers[activePageWorkerIndex].url + " to " + pageWorkers[indexOfWorker].url);
                this.pageWorkers.splice(indexOfWorker, 1);
                this.pageWorkers.push(worker);
            }
        }        
    },
    get previous(){
        var lastActivePageWorkerIndex = this.pageWorkers.length - 2;

        if (lastActivePageWorkerIndex < 0) return null;

        return this.pageWorkers[lastActivePageWorkerIndex];
    },
    get empty(){
        return this.pageWorkers.length == 0;
    },
    add: function(worker){
        var pageWorkersLength = this.pageWorkers.length;
        //not making previously pinned worker active
        if (pageWorkersLength == 0 || !this.current.pinned)
            this.pageWorkers.push(worker);
        else 
        {
            //todo: deal with multiple pinned workers
            this.pageWorkers.splice(pageWorkersLength - 1, 0, worker);
        }
    },
    remove: function(worker){
        var indexOfWorker = this.pageWorkers.indexOf(worker);
        if(indexOfWorker == -1)
        {
            //console.warn(`attempted to detach untracked pageWorker for ${worker.url}`);
            return;
        }

        this.pageWorkers.splice(indexOfWorker, 1);
    },
    findWorkerWithTabId: function(tabId){
        return this.pageWorkers.find(function(worker){
            return worker.sender.tab.id == tabId;
        });
    },
    pin: function(worker){
        this.current = worker;
        worker.pinned = true;
    },
    unpin: function(worker) {
        worker.pinned = false;
        if (this.previous.pinned) this.current = this.previous;
        else{
            var currentTabWorker = this.findWorkerWithTabId(browser.tabs.activeTab.id);
            //not making the currently active tab the active media player
            if (currentTabWorker) this.current = currentTabWorker;
        }
    },
    /**
     * Destroys all the contained page workers.
     */
    destroy: function(){
        while(this.pageWorkers.length > 0) this.pageWorkers.pop().disconnect();
    }
}

function AttachWorkerToPage(worker)
{
    if (pageWorkers.empty) hotkeyManager.RegisterHotkeys();
    pageWorkers.add(worker);

    worker.onDisconnect.addListener(() => {
        worker.disconnect();
        DetachPageWorker(worker);
    });

    if (prefs["Autoplay"])
    {
        worker.onMessage.addListener(message => {
            switch (message){
                case 'Play':
                    EmitEventToLastActivePageWorker("MediaPause", worker);
                    break;
                case 'Stop':
                    EmitEventToLastActivePageWorker("MediaPlay", worker);
                    break;
            }
        });
    }
    
    browser.pageAction.show(worker.sender.tab.id);

    browser.storage.sync.get({pins: []}).then(pins => {
        if (pins.find( pin => pin === worker.name ))
            worker.pinned = true;
    });
}

function TogglePin(tabId){
    let worker = pageWorkers.findWorkerWithTabId(tabId);
    
    console.log(`pin action taken for ${worker.name}`);
    
    let pins;
    browser.storage.sync.get({ pins: [] }).then(stored => pins = stored.pins);

    if (worker.pinned){
        console.log(`attempting to unpin ${worker.name}`);
        pageWorkers.unpin(worker);
        let indexOfPin = pins.indexOf(worker.name);
        pins.splice(indexOfPin, 1);
        DeactivatePinForTab(tabId);
    }
    else{
        console.log(`attempting to pin ${worker.name}`);
        pageWorkers.pin(worker);
        pins.push(worker.name);
        ActivatePinForTab(tabId);
    }
    
    browser.storage.sync.set({ pins });
}

function ActivatePinForTab(tabId){
    browser.pageAction.setIcon({
        path: {
            19: 'img/icon-19.png',
            38: 'img/icon-38.png'
        },
        tabId
    });
    browser.pageAction.setTitle({
        title: 'Unpin Media Keys from this tab',
        tabId
    });
}

function DeactivatePinForTab(tabId){
    browser.pageAction.setIcon({
        path: {
            19: 'img/icon-inactive-19.png',
            38: 'img/icon-inactive-38.png'
        },
        tabId
    });
    browser.pageAction.setTitle({
        title: 'Pin Media Keys to this tab',
        tabId
    });
}

function ActivatePageWorkerForTab(tabInfo)
{
    let workerForTab = pageWorkers.findWorkerWithTabId(tabInfo.tabId);
    if (workerForTab && !workerForTab.pinned) pageWorkers.current = workerForTab;
}

//Use this to detach message worker when the media page is closed
function DetachPageWorker(worker)
{
    pageWorkers.remove(worker);
    //console.warn(`detached pageWorker for ${worker.url}`)

    setTimeout(function(){
        if (pageWorkers.empty) hotkeyManager.UnregisterHotkeys();
    }, 5000);
}

function EmitEventToActivePageWorker(event)
{
    //console.log("Sending " + event + " to " + pageWorkers[activePageWorkerIndex].url);
    pageWorkers.current.postMessage(event);
}

function EmitEventToLastActivePageWorker(eventData, emitter)
{
    var pageWorker = pageWorkers.previous;
    if (pageWorker == null || pageWorker === emitter) return;

    //console.log(`sending ${eventData} to ${pageWorker.url}`);
    pageWorker.postMessage(eventData);
}

function SetUpPinner(){
    browser.pageAction.onClicked.addListener(TogglePin);   
}

function DestroyPinner(){
    browser.pageAction.onClicked.removeListener(TogglePin);
}

function Init(){
    browser.tabs.onActivated.addListener(ActivatePageWorkerForTab);
    SetUpPinner();
    browser.runtime.onConnect.addListener(AttachWorkerToPage);    
}

function Destroy(){
    pageWorkers.destroy();
    DestroyPinner();
    browser.runtime.onConnect.removeListener(AttachWorkerToPage);
}

export default {
    EmitEventToActivePageWorker,
    EmitEventToLastActivePageWorker,
    Destroy,
    Init
}