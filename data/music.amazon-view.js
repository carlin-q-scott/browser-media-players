/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

let base = '.playbackControls '
MediaKeys.playButton = base + '.playerIconPlay:not(.disabled)';
MediaKeys.pauseButton = base + '.playerIconPause';
MediaKeys.skipButton = base + '.nextButton';
MediaKeys.previousButton = base + '.previousButton';

//MediaKeys.trackInfoContainer = ".playbackControlsView"
MediaKeys.trackInfo = '.trackInfoContainer';
MediaKeys.trackImage = '.trackAlbumArt img'