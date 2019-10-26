/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.basePlayer = 'iframe#main';
MediaKeys.playButton = 'button#play:not([class*="playing"])';
MediaKeys.pauseButton = 'button#play[class*="playing"]';
MediaKeys.skipButton = 'button#next';
MediaKeys.previousButton = 'button#previous';
