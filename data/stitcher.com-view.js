if (typeof MediaKeys == 'undefined') var MediaKeys = {};

MediaKeys.playButton = 'div:not(.playing) > div#player-container-wrapper a#audio_player-play';
MediaKeys.pauseButton = 'div.playing > div#player-container-wrapper #audio_player-play';
MediaKeys.skipButton = '#audio_player-skip';