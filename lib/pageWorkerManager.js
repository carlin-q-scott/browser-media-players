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
        IsWorkerPinned(this.current).then(currentWorkerPinned => {
            var pageWorkersLength = this.pageWorkers.length;
            if (pageWorkersLength == 0 || currentWorkerPinned)
                this.pageWorkers.push(worker);
            else 
            {
                //todo: deal with multiple pinned workers
                this.pageWorkers.splice(pageWorkersLength - 1, 0, worker);
            }
        });
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
}

async function IsWorkerPinned(worker){
    return await browser.tabs.get(worker.sender.tab.pinned);
}

function ActivatePageWorkerForTab(tabInfo)
{
    let workerForTab = pageWorkers.findWorkerWithTabId(tabInfo.id);
    if (workerForTab) pageWorkers.current = workerForTab;
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

function Init(){
    browser.tabs.onActivated.addListener(ActivatePageWorkerForTab);
    browser.runtime.onConnect.addListener(AttachWorkerToPage);    
}

function Destroy(){
    pageWorkers.destroy();
    browser.runtime.onConnect.removeListener(AttachWorkerToPage);
}

export default {
    EmitEventToActivePageWorker,
    EmitEventToLastActivePageWorker,
    Destroy,
    Init
}