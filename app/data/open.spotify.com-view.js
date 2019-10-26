/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.playButton = 'button[class*="spoticon-play-"]';
MediaKeys.pauseButton = 'button[class*="spoticon-pause-"]';
MediaKeys.skipButton = 'button[class*="spoticon-skip-forward-"]';
MediaKeys.previousButton = 'button[class*="spoticon-skip-back-"]';

MediaKeys.trackInfo = 'div.now-playing'
{
    let urlRegex = new RegExp('https://[/\\w\\.\\d]+');
    MediaKeys.getTrackImageUrl = () => MediaKeys.find(MediaKeys.trackInfo + ' div.cover-art-image').style.backgroundImage.match(urlRegex)[0];
}