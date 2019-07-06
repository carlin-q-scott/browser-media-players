/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.playButton = "section.playbackControlsView//*[contains(@class, 'playerIconPlay')]";
MediaKeys.pauseButton = "section.playbackControlsView//*[contains(@class, 'playerIconPause')]";
MediaKeys.skipButton = "//*[contains(@class, 'nextButton')]";
MediaKeys.previousButton = "//*[contains(@class, 'previousButton')]";

//MediaKeys.trackInfoContainer = "//*[@class='playbackControlsView']"
MediaKeys.trackInfo = "//*[@class='trackInfoContainer']";