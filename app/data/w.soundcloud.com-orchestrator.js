/**
 * MediaKeys namespace.
 * 
 * Supports backwards compatibility with older Gecko key values.
 * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 */
MediaKeys.Init = function () {
    let port = browser.runtime.connect(browser.runtime.id, {name: window.location.host});

    port.onMessage.addListener(request => {
        switch (request) {
            case 'MediaPlay':
                window.postMessage(JSON.stringify({'method':'play'}))
                break;

            case 'MediaPause':
                window.postMessage(JSON.stringify({'method':'pause'}))
                break;

            case 'MediaPlayPause':
                window.postMessage(JSON.stringify({'method':'toggle'}))
                break;

            case 'MediaNextTrack':
                window.postMessage(JSON.stringify({'method':'next'}))
                break;

            case 'MediaPrevTrack':
                window.postMessage(JSON.stringify({'method':'prev'}))
                break;

            case 'MediaStop':
                window.postMessage(JSON.stringify({'method':'pause'}))
                break;
        }
    });
};

MediaKeys.Init();