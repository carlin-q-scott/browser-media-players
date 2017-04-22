/*eslint-env browser */

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
	browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
		switch (request) {
			case "MediaPlayPause":
				MediaPlayPause(sendResponse);
				break;

			case "MediaNextTrack":
				MediaNextTrack(sendResponse);
				break;

			case "MediaPrevTrack":
				MediaPrevTrack(sendResponse);
				break;

			case "MediaStop":
				MediaStop(sendResponse);
				break;

			default:
				break;
		}
	});
};

MediaKeys.Init();