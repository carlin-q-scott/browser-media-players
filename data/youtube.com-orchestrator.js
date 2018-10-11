/*eslint-env browser */
/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.Init = function()
{
    var maxPlayerLoadTime = 1500;
    var checkForPlayerInteval = 250;

    var attemptToAttachPageScript = function() {
        //console.log(`attempting to find youtube player. ${maxPlayerLoadTime} millis remaining...`)
        maxPlayerLoadTime -= checkForPlayerInteval;
        if (maxPlayerLoadTime == 0) {
            // console.log('didn\'t find youtube player');
            clearInterval(intervalId);
            // self.port.emit('self-destruct');
            return;
        }
        if (!window.document.querySelector('div.html5-video-player')) return; //because there's no youtube player
        clearInterval(intervalId);

        var pageDomain = window.location.origin;
        if (pageDomain == 'null') pageDomain = window.location.href;

        var pageScript = document.createElement('script');

        var attachPageScript = function () {
            pageScript.id = 'media-keys';
            pageScript.src = browser.extension.getURL('data/youtube.com-orchestrator-pageScript.js');
            document.body.appendChild(pageScript);
        };
        attachPageScript();
        
        function setupCommunicationChannel(){
            let port = browser.runtime.connect(browser.runtime.id, {name: window.location.host});
            
            port.onMessage.addListener(message => {
                switch (message){
                    case 'attach':
                        attachPageScript();
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
					case 'MediaTrackNext':
                        window.postMessage('MediaTrackNext', pageDomain);
                        break;
					case 'MediaTrackPrevious':
                        window.postMessage('MediaTrackPrevious', pageDomain)
                        break;
					case 'MediaStop':
                        window.postMessage('MediaStop', pageDomain)
                        break;
					case 'detach':
                        try {
                            window.removeEventListener('message', messageRelay)
                            document.body.removeChild(pageScript);
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
        setupCommunicationChannel();
    };

	var intervalId = setInterval(attemptToAttachPageScript, checkForPlayerInteval);
	attemptToAttachPageScript();
};

MediaKeys.Init();