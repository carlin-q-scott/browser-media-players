/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.playButton = 'button[data-test-id="play"]:not([style*="none"])]';
MediaKeys.pauseButton = 'button[data-test-id="pause"]:not([style*="none"])]';
MediaKeys.skipButton = 'button[data-test-id="next"]';
MediaKeys.previousButton = 'button[data-test-id="previous"]';