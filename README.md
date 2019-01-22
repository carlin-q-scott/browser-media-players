[![Build Status](https://dev.azure.com/BrowserMediaKeys/BrowserMediaPlayers/_apis/build/status/browser-media-players)](https://dev.azure.com/BrowserMediaKeys/BrowserMediaPlayers/_build/latest?definitionId=1)


Description
==================

Lets you control various media sites using the media keys on your keyboard.

Your media keys should work without the browser window active for Chrome and Opera. Firefox only supports the play/pause key and only if the browser window is active. You can however change the key assignments for this extension, to any key combination that you'd like, by using the shortcuts manager for the browser.

Supported Sites: youtube, pandora, spotify, bandcamp, google play, yandex, soundcloud, tidal, deezer, plex, vk, subsonic, jamstash, overcast.fm, music.amazon.co.uk, music.amazon.com, di.fm, netflix.com, and tunein.com.

Please find us on GitHub if you'd like to request features, post issues or contribute to the project.


Releases
========
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/media-keys/)
[Opera/Chrome](https://github.com/carlin-q-scott/browser-media-players/releases/latest) - Still awaiting store approval but you can install using the crx file.

Requesting New Sites
====================
If you'd like support for a multimedia website to be added, please create an issue with the following information:
1. Link to the website
2. Name of the website
3. Player control element html; see below on how to capture that.

Capturing player control elements
---------------------------------
1. Navigate to the multimedia website you'd like added.
2. Start playing something on the site
3. Inspect the pause button  
   ![Inspect Element](docs/img/Inspect_Element.png)
   1. Right-Click on the button
   2. Click "Inspect Element"
4. Copy the outer HTML of the element  
   ![Copy Outer HTML](docs/img/Extract_Element.png)
   1. Right-Click on the highlighted text in the Inspector panel
   2. Click "Copy > Outer HTML"
5. Paste that HTML into the new issue description
6. Repeat these steps for the following buttons: Play, Next/Skip, Back/Previous.

Development Environment
=======================

This add-on utilizes ``web-ex`` for building the extension and the ``Debugger for Firefox/Chrome`` Visual Studio Code extensions for debugging.  `npm install` will set up web-ex for you provided you use the npm scripts included in package.json or have ./node_modules/.bin in your PATH.

More details about jpm can be found at https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm.


Testing
-------
To start the browser test environment without running tests, select Debug->'Start Debugging' from the VSCode menu bar. 

```
Chrome/Opera Debugging: You must load the extension yourself from the extension manager, using the "Load unpacked extension..." option.
```

Pandora, Youtube and Spotify also can be launched in the test environment. e.g. `npm run pandora`


Packing
-------
Always start with Firefox, because it knows better than the other packers of what is included in the webextension.

### Firefox
The npm build script will generate a zip file that's ready for uploading to Firefox.

`npm run build`

### Opera
1. Extract the zip file created for Firefox to a folder
2. Open Opera
3. Go to the extension manager
4. Pack extension, providing the secret key not in this repo

### Chrome
I haven't done this one yet but it's probably the same as Opera.