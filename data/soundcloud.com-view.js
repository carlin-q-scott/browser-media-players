/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.playButton = "//button[contains(concat(' ',normalize-space(@class),' '),' playControl ')]";
MediaKeys.pauseButton = "button.playing";
MediaKeys.skipButton = "button.next";
MediaKeys.previousButton = "button.previous";