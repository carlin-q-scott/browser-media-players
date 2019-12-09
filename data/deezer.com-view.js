/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};
let basePlayer = 'div#page_player ';
MediaKeys.playButton = basePlayer + 'button .svg-icon-play';
MediaKeys.pauseButton = basePlayer + 'button .svg-icon-pause';
MediaKeys.skipButton = basePlayer + 'button .svg-icon-next';
MediaKeys.previousButton = basePlayer + 'button .svg-icon-prev';
