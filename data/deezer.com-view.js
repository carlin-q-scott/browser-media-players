/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};
let basePlayer = "div#page_player ";
MediaKeys.playButton = basePlayer + "button .icon-play";
MediaKeys.pauseButton = basePlayer + "button .icon-pause";
MediaKeys.skipButton = basePlayer + "button .icon-next";
MediaKeys.previousButton = basePlayer + "button .icon-prev";
