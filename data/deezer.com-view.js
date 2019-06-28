/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};
let basePlayer = "//div[@id='page_player']/.";
MediaKeys.playButton = basePlayer + "//button/*[contains(@class,'icon-play')]";
MediaKeys.pauseButton = basePlayer + "//button/*[contains(@class,'icon-pause')]";
MediaKeys.skipButton = basePlayer + "//button/*[contains(@class,'icon-next')]";
MediaKeys.previousButton = basePlayer + "//button/*[contains(@class,'icon-prev')]";
