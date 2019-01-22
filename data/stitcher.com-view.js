if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.playButton = '//*[@id="audio_player-play" and (//*[contains(concat(" ", @class, " "), "playing")])[last() = 1]]';
MediaKeys.pauseButton = '//*[@id="audio_player-play"]';
MediaKeys.skipButton = '//*[@id="audio_player-skip"]';