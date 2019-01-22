/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

var baseXpath = '//div[@data-qa-id=\'playerControlsContainer\']';
MediaKeys.playButton = baseXpath + '/.//button[@data-qa-id=\'resumeButton\']';
MediaKeys.pauseButton = baseXpath + '/.//button[@data-qa-id=\'pauseButton\']';
MediaKeys.skipButton = baseXpath + '/.//button[@data-qa-id=\'nextButton\']';
MediaKeys.previousButton = baseXpath + '/.//button[@data-qa-id=\'previousButton\']';
