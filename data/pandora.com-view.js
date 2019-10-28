/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.basePlayer = null;

MediaKeys.playButton = 'button.PlayButton[data-qa="play_button"]';
MediaKeys.pauseButton = 'button.PlayButton[data-qa="pause_button"]';
MediaKeys.previousButton = 'button.ReplayButton';
MediaKeys.skipButton = 'button.SkipButton';
MediaKeys.trackInfo = 'div.Tuner__Audio__TrackDetail__labels';
MediaKeys.getTrackImageUrl = () => MediaKeys.find('div.Tuner__Audio__TrackDetail__img img').src;