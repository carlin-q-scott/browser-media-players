[![Build Status](https://dev.azure.com/BrowserMediaKeys/BrowserMediaPlayers/_apis/build/status/browser-media-players)](https://dev.azure.com/BrowserMediaKeys/BrowserMediaPlayers/_build/latest?definitionId=1)


Description
==================

Lets you control various media sites using the media keys on your keyboard.

Your media keys should work without the browser window active for Chrome and Opera. Firefox only [supports the play/pause key](https://bugzilla.mozilla.org/show_bug.cgi?id=1251795#c13) and only if the [browser window is active](https://bugzilla.mozilla.org/show_bug.cgi?id=1411795). You can however change the key assignments for this extension, to any key combination that you'd like, by using the shortcuts manager for the browser.

Supported Sites: youtube, pandora, spotify, bandcamp, google play, yandex, soundcloud, tidal, deezer, plex, vk, subsonic, jamstash, jango, overcast.fm, music.amazon.co.uk, music.amazon.com, di.fm, netflix.com, and tunein.com.

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

`Note: If you cannot inspect the player controls, then player is a custom page element and you will have to figure out the Application Programming Interface (API) for the element in order to add support for it. The Youtube player is such an element so you can use the code for that as an example of how to do this. Fortunately the youtube player has really good documentation but the player you are attempting to add may not.`

Adding the site yourself
------------------------
Most sites have standard html elements for player controls. If you were able to follow the instructions in the previous section then the process for adding support is fairly painless:

1. The `data` folder contains -view.js scripts for each website that has standard html player control elements.
2. Copy one of -view.js scripts for another site you're familiar with, and rename it to match the new site.
3. Review the html you extracted earlier and look for an html attribute that seems unique to the element and hopefully one that clearly identifies it.  
   For instance, `<button qa-id="play-button" class="player-control-button play-button"/>` has `qa-id="play-button"`.
4. Replace the xpath for each element using what you learned from reviewing each elements html.  
    eg. `'//button[@qa-id="play-button"]'`
5. Sometimes there are multiple player controls on a page. If that's the case, then there's an optional xpath variable you need to define. This variable will tell the add-on where to focus when looking for the individual player controls. This variable is `MediaKeys.basePlayer`.
6. Now that you've created the view script, you will need to update the add-on manifest.json to include the website. So open it in the base directory.
7. Look for the content_scripts section which should be organized alphabetically by multimedia website.
8. Find the section for the website you used as your starting point and copy it.
9. Paste the copied section into the appropriate spot to maintain alphabetical ordering.
10. Rename the lines that are specific to the old site.
11. Time to [test](#testing)!

Development Environment
=======================

This add-on utilizes ``web-ex`` for building the extension and the ``Debugger for Firefox/Chrome`` Visual Studio Code extensions for debugging.  `npm install` will set up web-ex for you provided you use the npm scripts included in package.json or have ./node_modules/.bin in your PATH.


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