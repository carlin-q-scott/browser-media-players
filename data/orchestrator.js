/**
 * MediaKeys namespace.
 * 
 * Supports backwards compatibility with older Gecko key values.
 * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 */
MediaKeys.Init = function () {
	function MediaPlay(sendResponse) {
		var playButton = MediaKeys.GetSingleElementByXpath(MediaKeys.playButton, MediaKeys.basePlayer);
		if (playButton == null) return;
		playButton.click();
		sendResponse("Play");
	}

	function MediaPause(sendResponse) {
		var pauseButton = MediaKeys.GetSingleElementByXpath(MediaKeys.pauseButton)
		if (pauseButton != null) {
			pauseButton.click();
			sendResponse("Pause");
		}
	}

	function MediaPlayPause(sendResponse) {
		var playButton = MediaKeys.GetSingleElementByXpath(MediaKeys.playButton, MediaKeys.basePlayer);
		if (playButton != null) {
			playButton.click();
			sendResponse("Play");
		}
		else {
			var pauseButton = MediaKeys.GetSingleElementByXpath(MediaKeys.pauseButton, MediaKeys.basePlayer);
			if (pauseButton == null) return;
			pauseButton.click();
			sendResponse("Pause");
		}
	}

	function MediaNextTrack(sendResponse) {
		var skipButton = MediaKeys.GetSingleElementByXpath(MediaKeys.skipButton, MediaKeys.basePlayer);
		if (skipButton == null) return;
		skipButton.click();
		sendResponse("Next");
	}

	function MediaPrevTrack(sendResponse) {
		var previousButton = MediaKeys.GetSingleElementByXpath(MediaKeys.previousButton, MediaKeys.basePlayer);
		if (previousButton == null) return;
		previousButton.click();
		sendResponse("Previous");
	}

	function MediaStop(sendResponse) {
		var pauseButton = MediaKeys.GetSingleElementByXpath(MediaKeys.pauseButton, MediaKeys.basePlayer);
		if (pauseButton == null) return;
		pauseButton.click();
		sendResponse("Stop");
	}

	if (MediaKeys.trackInfo && Notification.permission != 'denied') {
		var setupTrackInfoUpdates = function () {
			function notifyNewTrack() {
				new Notification("Now Playing", {
					body: MediaKeys.GetSingleElementByXpath(MediaKeys.trackInfo, MediaKeys.basePlayer).innerText
				});
			}

			var currentTrackObservable;

			if (MediaKeys.trackInfoContainer)
				currentTrackObservable = MediaKeys.GetSingleElementByXpath(MediaKeys.trackInfoContainer, MediaKeys.basePlayer);
			else
				currentTrackObservable = MediaKeys.GetSingleElementByXpath(MediaKeys.trackInfo, MediaKeys.basePlayer);

			if (currentTrackObservable) {
				var currentTrackObserver = new MutationObserver(notifyNewTrack);
				currentTrackObserver.observe(currentTrackObservable, {
					childList: true,
					characterData: true,
					subtree: true
				});
			}
		}

		if (Notification.permission == 'granted') setupTrackInfoUpdates();
		else Notification.requestPermission().then(function (result) { if (result == 'granted') setupTrackInfoUpdates(); });
	}

	function setupCommunicationChannel(){
		let port = browser.runtime.connect(browser.runtime.id, {name: window.location.host});
		
		port.onMessage.addListener(request => {
			//console.log(`page script received ${request}`);
			switch (request) {
				case "MediaPlay":
					MediaPlay(port.postMessage);
					break;
				case "MediaPause":
					MediaPause(port.postMessage);
					break;
				case "MediaPlayPause":
					MediaPlayPause(port.postMessage);
					break;

				case "MediaNextTrack":
					MediaNextTrack(port.postMessage);
					break;

				case "MediaPrevTrack":
					MediaPrevTrack(port.postMessage);
					break;

				case "MediaStop":
					MediaStop(port.postMessage);
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