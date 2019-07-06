/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.basePlayer = "iframe#app-player";
MediaKeys.playButton = "//button[@id='play-pause' and not(contains(@class,'playing'))]";
MediaKeys.pauseButton = "//button[@id='play-pause' and contains(@class,'playing')]";
MediaKeys.skipButton = "button#next";
MediaKeys.previousButton = "button#previous";
