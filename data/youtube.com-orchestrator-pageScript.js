/*eslint-env browser */
/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.init = function() {
    var player = document.querySelector('div.html5-video-player');

    var pageDomain = window.location.origin;
    if (pageDomain == 'null') pageDomain = window.location.href;

    var PlayerStates = {
        unstarted: -1,
        ended: 0,
        playing: 1,
        paused: 2,
        buffering: 3,
        queued: 5
    };
    var playVideo = function () {
        player.playVideo();
    };
    var pauseVideo = function () {
        player.pauseVideo();
    };

    window.addEventListener("message", function (event) {
        switch (event.data) {
            case "MediaPlayPause":
                switch (player.getPlayerState()) {
                    case PlayerStates.unstarted:
                    case PlayerStates.playing:
                        pauseVideo();
                        break;
                    case PlayerStates.ended:
                    case PlayerStates.paused:
                        playVideo();
                        break;
                }
                break;

            case "MediaPause":
                pauseVideo();
                break;

            case "MediaPlay":
                playVideo();
                break;

            case "MediaNextTrack":
                player.nextVideo();
                window.postMessage("Next", pageDomain);
                break;

            case "MediaPrevTrack":
                player.previousVideo();
                window.postMessage("Previous", pageDomain);
                break;

            case "MediaStop":
                player.stopVideo();
                break;
        }
    });

    //automatically pause other players while playing a video and resume them when done
    var latestState;
    function handlePlayerStateChanges() {
        var state = player.getPlayerState();
        if (state != latestState) {
            console.log(`youtube player state transitioned from ${latestState} to ${state}`);
            latestState = state;
            switch (state) {
                case PlayerStates.playing:
                case PlayerStates.unstarted:
                    window.postMessage("Play", pageDomain);
                    break;
                case PlayerStates.paused:
                    window.postMessage("Pause", pageDomain);
                    break;
                case PlayerStates.ended:
                    window.postMessage("Stop", pageDomain);
                    break;
            }
        }
    }

    let interval = window.setInterval(handlePlayerStateChanges, 1500);
    // window.addEventListener('beforeunload', () => window.clearInterval(interval))
};

MediaKeys.init();