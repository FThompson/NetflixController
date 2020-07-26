# Netflix Controller Chrome Extension

[![](https://img.shields.io/chrome-web-store/v/kjgfkjidgcfgbabbhjephchohcghcdkf.svg)](https://chrome.google.com/webstore/detail/netflix-controller/kjgfkjidgcfgbabbhjephchohcghcdkf)

Control Netflix in your browser with a gamepad or controller using this Chrome extension.

![Netflix Controller](/webstore-assets/promo-large.png)

## Getting Started

Add Netflix Controller to your browser [here](https://chrome.google.com/webstore/detail/netflix-controller/kjgfkjidgcfgbabbhjephchohcghcdkf), then open [Netflix](https://www.netflix.com/browse) and press a button on your controller to load the plugin.

## Features

* Navigate Netflix using a controller
* Control the video player
* Search for media using virtual keyboard
* See current actions in the hints bar at the bottom of the viewport
* Choose options when watching interactive media like Black Mirror Bandersnatch
* Choose your button icons (Xbox 360 / Xbox One / PS3 / PS4)
* Test your gamepad mapping in the browser icon popup
* Customize your experience in the extension options

### Video Player Controls

| Action | Xbox | Playstation |
|--------|------|-------------|
| Play / Pause  | <img alt='A' src='static/buttons/Xbox%20One/XboxOne_A.png' width='40'> | <img alt='Cross' src='static/buttons/PS4/PS4_Cross.png' width='40'> |
| Mute          | <img alt='X' src='static/buttons/Xbox%20One/XboxOne_X.png' width='40'> | <img alt='Square' src='static/buttons/PS4/PS4_Square.png' width='40'> |
| Fullscreen    | <img alt='Y' src='static/buttons/Xbox%20One/XboxOne_Y.png' width='40'> | <img alt='Triangle' src='static/buttons/PS4/PS4_Triangle.png' width='40'> |
| Go Back       | <img alt='B' src='static/buttons/Xbox%20One/XboxOne_B.png' width='40'> | <img alt='Square' src='static/buttons/PS4/PS4_Square.png' width='40'> |
| Volume Up     | <img alt='Dpad Up' src='static/buttons/Xbox%20One/XboxOne_Dpad_Up.png' width='40'> | <img alt='Dpad Up' src='static/buttons/PS4/PS4_Dpad_Up.png' width='40'> |
| Volume Down   | <img alt='Dpad Down' src='static/buttons/Xbox%20One/XboxOne_Dpad_Down.png' width='40'> | <img alt='Dpad Down' src='static/buttons/PS4/PS4_Dpad_Down.png' width='40'> |
| Jump 10s      | <img alt='Dpad Right' src='static/buttons/Xbox%20One/XboxOne_Dpad_Right.png' width='40'> | <img alt='Dpad Right' src='static/buttons/PS4/PS4_Dpad_Right.png' width='40'> |
| Jump Back 10s | <img alt='Dpad Left' src='static/buttons/Xbox%20One/XboxOne_Dpad_Left.png' width='40'> | <img alt='Dpad Left' src='static/buttons/PS4/PS4_Dpad_Left.png' width='40'> |
| Skip Intro    | <img alt='Start' src='static/buttons/Xbox%20One/XboxOne_Menu.png' width='40'> | <img alt='Start' src='static/buttons/PS4/PS4_Options.png' width='40'> |
| Next Episode  | <img alt='RB' src='static/buttons/Xbox%20One/XboxOne_RB.png' width='40'> | <img alt='R1' src='static/buttons/PS4/PS4_R1.png' width='40'> |

## Screenshots

![Navigate the homepage](/webstore-assets/screenshot-browse.jpg)
![Control the video player](/webstore-assets/screenshot-watch.jpg)
![Search for content](/webstore-assets/screenshot-search.jpg)
![Explore specific titles](/webstore-assets/screenshot-jawbone.jpg)
![Watch interactive media](/webstore-assets/screenshot-interactive.png)


## TODO
* Firefox/Edge support (convert manifests, fullscreen action)
* Continue mapping navigation controls to additional page elements (such as other jawbone options)
* Support non-standard gamepad mappings / offer way to configure mappings
* Configure right joystick to control a virtual mouse
* Dual action hints for action pairs like volume up/down
* CSS classes for content outlines
* Fix visual bug that occurs on some billboard MyList buttons
* Scale bottom bar elements according to page size
* Hide jump 10s actions when unavailable, such as in Bandersnatch (player class `preplay`?)
* Identify interactive videos and only apply related settings/observers if needed
* Fix bug where search page handler does not finish loading until keyboard is closed when only one character has been entered into the search bar
* Organize page handler logic such that navigatables have clean access to the enclosing page handler
* Add additional styling to jawbone buttons to better indicate the selected option
* Use mutation observers or parse CSS transitions instead of using static timing in slider timeouts
* Fix bug where jawbone changes due to removing from my list the title with an open jawbone
* Show video controls when in fullscreen mode
* Add remaining jawbone pane types
* Auto skip intro

## Libraries and Materials Used
* [pseudo:styler](https://github.com/TSedlar/pseudo-styler) - A module that allows for forcing an element to be styled with a pseudo-class.
* [Gamepads.js](https://github.com/FThompson/Gamepads.js) - A module for tracking Gamepads and events pertaining to their usage.
* [Chrome Live Storage](https://github.com/FThompson/ChromeLiveStorage) - A module that provides `chrome.storage` data as native JavaScript objects that automatically synchronize between all extension views (background, content scripts, popups, options, etc.).
* Xbox controller image courtesy of http://gamepadviewer.com/
* Project icons courtesy of https://material.io/icons/ and https://iconfu.com.
* Many thanks to [Tyler Sedlar](https://github.com/TSedlar) for creating pseudo:styler and for letting me bounce ideas off of him throughout development of this project.

## Changelog
| Version | Date | Changes |
|---------|------|---------|
| 1.0.4 | July 25, 2020 | Fixed the title panel handler. |
| 1.0.3 | June 3, 2020 | Fixed the billboard handler and added support for the latest page. |
| 1.0.2 | March 21, 2020 | Fixed crashing at the end of episodes in a playlist and added support for the top 10 slider. |
| 1.0.1 | January 27, 2020 | Updated gamepads.js to fix Chrome support. |
| 1.0.0 | June 28, 2019 | Initial release.