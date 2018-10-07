Build Status
============

| Linux | Windows |
|-------|---------|
| [![Linux Build Status](https://travis-ci.org/carlin-q-scott/browser-media-keys.svg?branch=master)](https://travis-ci.org/carlin-q-scott/browser-media-keys) | [![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/carlin-q-scott/browser-media-keys)](https://ci.appveyor.com/project/carlin-q-scott/browser-media-keys) |


Description
==================

Lets you control various media sites using the media keys on your keyboard.

Your media keys should work without the browser window active for Chrome and Opera. Firefox only supports the play/pause key and only if the browser window is active.

Supported Sites: youtube, pandora, spotify, bandcamp, google play, yandex, soundcloud, tidal, deezer, plex, vk, subsonic, jamstash, overcast.fm, music.amazon.co.uk, music.amazon.com, di.fm, netflix.com, and tunein.com.

Please find us on GitHub if you'd like to request features, post issues or contribute to the project.

Development Environment
=======================

This add-on utilizes ``web-ex`` for building the extension and the ``Debugger for Firefox`` Visual Studio Code extension for debugging.  `npm install` will set up web-ex for you provided you use the npm scripts included in package.json or have ./node_modules/.bin in your PATH.

More details about jpm can be found at https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm.


Testing
-------
To start the browser test environment without running tests, select Debug->'Start Debugging' from the VSCode menu bar.

Pandora, Youtube and Spotify also can be launched in the test environment. e.g. `npm run pandora`
