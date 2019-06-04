Control Netflix in your browser with a gamepad or controller using this Chrome extension.

## TODO
* Loading WatchVideo module after going to next video
* Dynamically determine whether a page has a billboard or not
* Firefox/Edge support (convert manifests, fullscreen action)
* Add semicolons throughout code (decided to start using them after main codebase built)
* Fix closing search without any search results
* Continue mapping navigation controls to additional page elements
* Detect account login page after idle period
* Button action hints
* Support interactive media (e.g. the new Black Mirror movie)
* Support non-standard gamepad mappings / offer way to configure mappings
* Configure right joystick to control a virtual mouse
* Timeout page readiness checks (useful in case of no internet connection)
* Improve plugin design to be extendable for other websites
* Come up with a better plugin name, maybe considering future extendability (Flixability, Joyflix, Netstix)
* Batch chrome.storage get calls where possible
* Add warning bar for non-standard gamepad in content script
* Separate live setting logic into external library
* Replace pseudo:styler with calls to chrome.debugger to spawn trusted mouse events

## Libraries and Materials Used
* [pseudo:styler](https://github.com/TSedlar/pseudo-styler) - Allows for forcing an element to be styled with a pseudo-class.
* [Gamepads.js](https://github.com/FThompson/Gamepads.js) - A simple JavaScript module for tracking Gamepads and events pertaining to their usage.
* Project icons courtesy of https://material.io/icons/ and https://iconfu.com.
* Many thanks to [Tyler Sedlar](https://github.com/TSedlar) for creating pseudo:styler and for letting me bounce ideas off of him throughout development of this project.