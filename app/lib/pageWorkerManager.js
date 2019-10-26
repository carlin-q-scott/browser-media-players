/**
 * Created by Carlin on 2/7/2016.
 */
import hotkeyManager from "./hotkeyManager.js";
import UserOptions from "../options/UserOptions.js";

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
        if (this.pageWorkers.length > 1) {
            IsWorkerPinned(this.current).then(currentWorkerPinned => {
                if (currentWorkerPinned) return;

                var indexOfWorker = this.pageWorkers.indexOf(worker);
                if (indexOfWorker != this.pageWorkers.length - 1)
                {
                    //console.log("switching from " + pageWorkers[activePageWorkerIndex].url + " to " + pageWorkers[indexOfWorker].url);
                    this.pageWorkers.splice(indexOfWorker, 1);
                    this.pageWorkers.push(worker);
                }
            });
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
        if (this.pageWorkers.length == 0)
            this.pageWorkers.push(worker);
        else {
            IsWorkerPinned(worker).then(newWorkerPinned => {
                if (newWorkerPinned) this.pageWorkers.push(worker);
                else {
                    IsWorkerPinned(this.current).then(currentWorkerPinned => {
                        if (currentWorkerPinned) 
                            this.pageWorkers.splice(this.pageWorkers.length - 1, 0, worker);
                        else
                            this.pageWorkers.push(worker);
                    });
                }
            });
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

    // console.log(`added page worker for ${worker.name} (${worker.sender.url})`);

    worker.onDisconnect.addListener(DetachPageWorker);

    if (UserOptions.options.autoplay)
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
}

async function IsWorkerPinned(worker){
    // if user has decided to only control the active tab, then the pinning feature should be disabled
    if (UserOptions.options.activeTab) return false;

    let currentTabInfo = await browser.tabs.get(worker.sender.tab.id);
    return currentTabInfo.pinned;
}

async function IsWorkerTabActive(worker){
    let currentTabInfo = await browser.tabs.get(worker.sender.tab.id);
    return currentTabInfo.active;
}

function ActivatePageWorkerForTab(tabInfo)
{
    let workerForTab = pageWorkers.findWorkerWithTabId(tabInfo.tabId);
    if (workerForTab) pageWorkers.current = workerForTab;
}

//Use this to detach message worker when the media page is closed
function DetachPageWorker(worker)
{
    pageWorkers.remove(worker);
    //console.warn(`detached pageWorker for ${worker.url}`)

    setTimeout(function(){
        if (pageWorkers.empty) hotkeyManager.UnregisterHotkeys();
    }, 10000);
}

function EmitEventToActivePageWorker(event)
{
    let currentWorker = pageWorkers.current;
    if (typeof currentWorker != 'undefined') {
        if (UserOptions.options.activeTab) IsWorkerTabActive(currentWorker).then(workerTabActive => {
            if (workerTabActive) currentWorker.postMessage(event)
        })
        else {
            // console.log(`sending ${event} to ${currentWorker.sender.url}`);
            currentWorker.postMessage(event);
        }
    }
}

function EmitEventToLastActivePageWorker(eventData, emitter)
{
    var pageWorker = pageWorkers.previous;
    if (pageWorker == null || pageWorker === emitter) return;

    //console.log(`sending ${eventData} to ${pageWorker.url}`);
    pageWorker.postMessage(eventData);
}

function Init(){
    if (!browser.tabs.onActivated.hasListener(ActivatePageWorkerForTab)) browser.tabs.onActivated.addListener(ActivatePageWorkerForTab);
    if (!browser.runtime.onConnect.hasListener(AttachWorkerToPage)) browser.runtime.onConnect.addListener(AttachWorkerToPage);
}

function Destroy(){
    pageWorkers.destroy();
    browser.tabs.onActivated.removeListener(ActivatePageWorkerForTab);
    browser.runtime.onConnect.removeListener(AttachWorkerToPage);
}

export default {
    EmitEventToActivePageWorker,
    EmitEventToLastActivePageWorker,
    Destroy,
    Init
}