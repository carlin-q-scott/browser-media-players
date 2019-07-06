/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.playButton = "//button[@id='play-control' and contains(@class, 'play')]";
MediaKeys.pauseButton = "//button[@id='play-control' and contains(@class, 'pause')]";
MediaKeys.skipButton = "button#next-control";
MediaKeys.previousButton = "button#previous-control";
