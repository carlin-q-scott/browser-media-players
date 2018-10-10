/**
 * MediaKeys namespace.
 * 
 * Supports backwards compatibility with older Gecko key values.
 * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 */
MediaKeys.Init = function () {
	function MediaPlay() {
		var playButton = MediaKeys.GetSingleElementByXpath(MediaKeys.playButton, MediaKeys.basePlayer);
		if (playButton == null) return;
		playButton.click();
	}

	function MediaPause() {
		var pauseButton = MediaKeys.GetSingleElementByXpath(MediaKeys.pauseButton, MediaKeys.basePlayer)
		if (pauseButton != null) {
			pauseButton.click();
		}
	}

	function MediaPlayPause() {
		var playButton = MediaKeys.GetSingleElementByXpath(MediaKeys.playButton, MediaKeys.basePlayer);
		if (playButton != null) {
			playButton.click();
		}
		else {
			var pauseButton = MediaKeys.GetSingleElementByXpath(MediaKeys.pauseButton, MediaKeys.basePlayer);
			if (pauseButton == null) return;
			pauseButton.click();
		}
	}

	function MediaNextTrack() {
		var skipButton = MediaKeys.GetSingleElementByXpath(MediaKeys.skipButton, MediaKeys.basePlayer);
		if (skipButton == null) return;
		skipButton.click();
	}

	function MediaPrevTrack() {
		var previousButton = MediaKeys.GetSingleElementByXpath(MediaKeys.previousButton, MediaKeys.basePlayer);
		if (previousButton == null) return;
		previousButton.click();
	}

	function MediaStop() {
		var pauseButton = MediaKeys.GetSingleElementByXpath(MediaKeys.pauseButton, MediaKeys.basePlayer);
		if (pauseButton == null) return;
		pauseButton.click();
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
					MediaPlay();
					break;
				case "MediaPause":
					MediaPause();
					break;
				case "MediaPlayPause":
					MediaPlayPause();
					break;

				case "MediaNextTrack":
					MediaNextTrack();
					break;

				case "MediaPrevTrack":
					MediaPrevTrack();
					break;

				case "MediaStop":
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