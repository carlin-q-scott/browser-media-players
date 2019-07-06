/**
 * MediaKeys namespace.
 */
/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.basePlayer = "iframe#playQueue";

MediaKeys.playButton = "//span[contains(@id, 'startButton') and not(contains(@style,'display: none'))]";
MediaKeys.pauseButton = "//span[contains(@id, 'stopButton') and not(contains(@style,'display: none'))]";
MediaKeys.skipButton = "span#nextButton";
MediaKeys.previousButton = "span#previousButton";
