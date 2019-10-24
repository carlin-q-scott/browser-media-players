/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.basePlayer = 'iframe#app-player';
MediaKeys.playButton = 'button#play-pause:not([class*="playing"])';
MediaKeys.pauseButton = 'button#play-pause[class*="playing"]';
MediaKeys.skipButton = 'button#next';
MediaKeys.previousButton = 'button#previous';
