/**
 * MediaKeys namespace.
 * 
 * Supports backwards compatibility with older Gecko key values.
 * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 */
MediaKeys.Init = function () {
    const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    function simulateMouseClick(element){
        mouseClickEvents.forEach(mouseEventType =>
            element.dispatchEvent(
                new MouseEvent(mouseEventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                })
            )
        );
    }

    function MediaPlay() {
        var playButton = MediaKeys.find(MediaKeys.playButton, MediaKeys.basePlayer);
        if (playButton == null) return;
        simulateMouseClick(playButton);
    }

    function MediaPause() {
        var pauseButton = MediaKeys.find(MediaKeys.pauseButton, MediaKeys.basePlayer)
        if (pauseButton != null) {
            simulateMouseClick(pauseButton);
        }
    }

    function MediaPlayPause() {
        var playButton = MediaKeys.find(MediaKeys.playButton, MediaKeys.basePlayer);
        if (playButton != null) {
            simulateMouseClick(playButton);
        }
        else {
            var pauseButton = MediaKeys.find(MediaKeys.pauseButton, MediaKeys.basePlayer);
            if (pauseButton == null) return;
            simulateMouseClick(pauseButton);
        }
    }

    function MediaNextTrack() {
        var skipButton = MediaKeys.find(MediaKeys.skipButton, MediaKeys.basePlayer);
        if (skipButton == null) return;
        simulateMouseClick(skipButton);
    }

    function MediaPrevTrack() {
        var previousButton = MediaKeys.find(MediaKeys.previousButton, MediaKeys.basePlayer);
        if (previousButton == null) return;
        simulateMouseClick(previousButton);
    }

    function MediaStop() {
        var pauseButton = MediaKeys.find(MediaKeys.pauseButton, MediaKeys.basePlayer);
        if (pauseButton == null) return;
        simulateMouseClick(pauseButton);
    }
	
    function setupTrackInfoUpdates() {
        function notifyNewTrack() {
            new Notification('Now Playing', {
                body: MediaKeys.find(MediaKeys.trackInfo, MediaKeys.basePlayer).innerText
            });
        }

        var currentTrackObservable;

        if (MediaKeys.trackInfoContainer)
            currentTrackObservable = MediaKeys.find(MediaKeys.trackInfoContainer, MediaKeys.basePlayer);
        else
			currentTrackObservable = MediaKeys.find(MediaKeys.trackInfo, MediaKeys.basePlayer);

        if (currentTrackObservable) {
            var currentTrackObserver = new MutationObserver(notifyNewTrack);
            currentTrackObserver.observe(currentTrackObservable, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    if (MediaKeys.trackInfo && Notification.permission != 'denied') {
        if (Notification.permission == 'granted') setupTrackInfoUpdates();
        else Notification.requestPermission().then(function (result) { if (result == 'granted') setupTrackInfoUpdates(); });
    }

    function setupCommunicationChannel(){
        let port = browser.runtime.connect(browser.runtime.id, {name: window.location.host});
		
        port.onMessage.addListener(request => {
			//console.log(`page script received ${request}`);
            switch (request) {
                case 'MediaPlay':
                    MediaPlay();
                    break;
                case 'MediaPause':
                    MediaPause();
                    break;
                case 'MediaPlayPause':
                    MediaPlayPause();
                    break;

                case 'MediaNextTrack':
                    MediaNextTrack();
                    break;

                case 'MediaPrevTrack':
                    MediaPrevTrack();
                    break;

                case 'MediaStop':
                    MediaStop();
                    break;

                default:
                    break;
            }
        });

        port.onDisconnect.addListener(() => setTimeout(setupCommunicationChannel, 1000));
    }
    setupCommunicationChannel();
};

MediaKeys.Init();