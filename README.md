Control Netflix in your browser with a gamepad or controller using this Chrome extension.

## TODO
* Loading WatchVideo module after going to next video
* Dynamically determine whether a page has a billboard or not
* Firefox/Edge support (convert manifests, fullscreen action)
* Add semicolons throughout code (decided to start using them after main codebase built)
* Continue mapping navigation controls to additional page elements
* Detect account login page after idle period
* Support interactive media (e.g. the new Black Mirror movie)
* Support non-standard gamepad mappings / offer way to configure mappings
* Configure right joystick to control a virtual mouse
* Timeout page readiness checks (useful in case of no internet connection)
* Improve plugin design to be extendable for other websites
* Come up with a better plugin name, maybe considering future extendability (Flixability, Joyflix, Netstix)
* Dual action hints for action pairs like volume up/down
* Fix bug where billboard sometimes grabs the current page instead of waiting for the new page's billboard to load in

## Libraries and Materials Used
* [pseudo:styler](https://github.com/TSedlar/pseudo-styler) - Allows for forcing an element to be styled with a pseudo-class.
* [Gamepads.js](https://github.com/FThompson/Gamepads.js) - A simple JavaScript module for tracking Gamepads and events pertaining to their usage.
* [Chrome Live Storage](https://github.com/FThompson/ChromeLiveStorage) - A module that provides `chrome.storage` data as native JavaScript objects that automatically synchronize between all extension views (background, content scripts, popups, options, etc.).
* Project icons courtesy of https://material.io/icons/ and https://iconfu.com.
* Many thanks to [Tyler Sedlar](https://github.com/TSedlar) for creating pseudo:styler and for letting me bounce ideas off of him throughout development of this project.