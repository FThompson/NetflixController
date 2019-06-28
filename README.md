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
* Choose options when watching interactive media like Black Mirror Bandersnatch
* Choose your button icons (Xbox 360 / Xbox One / PS3 / PS4)
* Test your gamepad mapping in the browser icon popup
* Customize your experience in the extension options

### Video Player Controls

| Action | Xbox | Playstation |
|--------|------|-------------|
| Play / Pause  | ![A](/static/buttons/Xbox%20One/XboxOne_A.png) | ![Cross](/static/buttons/PS4/PS4_Cross.png) |
| Mute          | ![X](/static/buttons/Xbox%20One/XboxOne_X.png) | ![Square](/static/buttons/PS4/PS4_Square.png) |
| Fullscreen    | ![Y](/static/buttons/Xbox%20One/XboxOne_Y.png) | ![Triangle](/static/buttons/PS4/PS4_Triangle.png) |
| Go Back       | ![B](/static/buttons/Xbox%20One/XboxOne_B.png) | ![Circle](/static/buttons/PS4/PS4_Circle.png) |
| Volume Up     | ![Dpad Up](/static/buttons/Xbox%20One/XboxOne_Dpad_Up.png) | ![Dpad Up](/static/buttons/PS4/PS4_Dpad_Up.png) |
| Volume Down   | ![Dpad Down](/static/buttons/Xbox%20One/XboxOne_Dpad_Down.png) | ![Dpad Down](/static/buttons/PS4/PS4_Dpad_Down.png) |
| Jump 10s      | ![Dpad Right](/static/buttons/Xbox%20One/XboxOne_Dpad_Right.png) | ![Dpad Right](/static/buttons/PS4/PS4_Dpad_Right.png) |
| Jump Back 10s | ![Dpad Left](/static/buttons/Xbox%20One/XboxOne_Dpad_Left.png) | ![Dpad Left](/static/buttons/PS4/PS4_Dpad_Left.png) |
| Skip Intro    | ![Start](/static/buttons/Xbox%20One/XboxOne_Menu.png) | ![Start](/static/buttons/PS4/PS4_Options.png) |
| Next Episode  | ![RB](/static/buttons/Xbox%20One/XboxOne_RB.png) | ![R1](/static/buttons/PS4/PS4_R1.png) |

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
* Project icons courtesy of https://material.io/icons/ and https://iconfu.com.
* Many thanks to [Tyler Sedlar](https://github.com/TSedlar) for creating pseudo:styler and for letting me bounce ideas off of him throughout development of this project.