
/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

var baseXpath = 'div.controls ';
MediaKeys.playButton = baseXpath + 'a[class*="play"]';
MediaKeys.pauseButton = baseXpath + 'a[class*="pause"]';
