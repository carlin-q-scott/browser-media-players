/*eslint-env browser */
/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.Init = function()
{
    var pageDomain = window.location.origin;
    if (pageDomain == 'null') pageDomain = window.location.href;

    function attachToVideoPlayerLater() {
        // watch for navigation events
        let observer = new MutationObserver(function() {
            if (document.querySelector('div.html5-video-player')){
                observer.disconnect();
                attemptToAttachPageScript();
            }
        });
        var config = {
            childList: true
        };
        observer.observe(document.body, config);
    }
            
    function removePageScript() {
        var pageScript = document.querySelector('script#media-keys');
        if (pageScript) document.body.removeChild(pageScript);
    }

    function setupCommunicationChannel(){
        let port = browser.runtime.connect(browser.runtime.id, {name: window.location.host});
        
        port.onMessage.addListener(message => {
            switch (message){
                case 'attach':
                    attemptToAttachPageScript();
                    break;
                case 'MediaPlayPause':
                    window.postMessage('MediaPlayPause', pageDomain);
                    break;
                case 'MediaPlay':
                    window.postMessage('MediaPlay', pageDomain);
                    break;
                case 'MediaPause':
                    window.postMessage('MediaPause', pageDomain);
                    break;
                case 'MediaNextTrack':
                    window.postMessage('MediaNextTrack', pageDomain);
                    break;
                case 'MediaPrevTrack':
                    window.postMessage('MediaPrevTrack', pageDomain)
                    break;
                case 'MediaStop':
                    window.postMessage('MediaStop', pageDomain)
                    break;
                case 'detach':
                    try {
                        window.removeEventListener('message', messageRelay)
                        removePageScript();
                    }
                    catch (exception) {
                        //console.log("cannot detach youtube page script because page is closed or otherwise innaccessible.");
                    }
                    break;
            }
        });

        function messageRelay(message)
        {
            port.postMessage(message.data);            
        }
        window.addEventListener('message', messageRelay);
        
        port.onDisconnect.addListener(() => {
            window.removeEventListener('message', messageRelay);
            setTimeout(setupCommunicationChannel, 1000);
        });
    }

    function attemptToAttachPageScript() {
        var maxPlayerLoadTime = 1500;
        var checkForPlayerInteval = 250;

        function reAttemptToAttachPageScript() {
            // console.log(`attempting to find youtube player on ${window.location.href}. ${maxPlayerLoadTime} millis remaining...`)
            maxPlayerLoadTime -= checkForPlayerInteval;
            if (maxPlayerLoadTime == 0) {
                // console.warn('didn\'t find youtube player');
                clearInterval(intervalId);
                // self.port.emit('self-destruct');
                attachToVideoPlayerLater();
                return;
            }
            if (!document.querySelector('div.html5-video-player')) return; //because there's no youtube player
            clearInterval(intervalId);

            let pageScript = document.querySelector('script#media-keys') || document.createElement('script');
            pageScript.id = 'media-keys';
            pageScript.src = browser.extension.getURL('data/youtube.com-orchestrator-pageScript.js');
            document.body.appendChild(pageScript);
        }

        var intervalId = setInterval(reAttemptToAttachPageScript, checkForPlayerInteval);
        reAttemptToAttachPageScript();
    }

    attemptToAttachPageScript();
    setupCommunicationChannel();
};

MediaKeys.Init();