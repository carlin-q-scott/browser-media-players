/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.basePlayer = "iframe#main";
MediaKeys.playButton = "//button[@id='play' and not(contains(@class,'playing'))]";
MediaKeys.pauseButton = "//button[@id='play' and contains(@class,'playing')]";
MediaKeys.skipButton = "button#next";
MediaKeys.previousButton = "button#previous";
