# Engine

This is the main file of the JS code of PWN, it executes object constructors of main objects (and services that are coded as constructors (some are directly defined objects)) in init function, which is executed upon window.onload. The init function also loads localStorage save (see [save.js](services/save.md))

## State
It also contains constructor of one of the main game objects, the state. This object contains every variables that are results of user's actions (but NOT the game character info (stats, inventory, quests, position on map), that's in game.state!). For example it doesn't contain width and height of the gamebox, because those are not in user's control and are updated automatically...

**What it contains**:
- game tab: (either console or map), it means what is the user viewing...
- address: the address the current console, address where is the user located
- **tree**: this is a console object - the "root" console. All other subconsoles are somewhere in its children...
- console: all the text that is written in the console (user inputs and all outputs)
- history: this is just history of user inputs
- options: obviously those are game options that the user can change...

## Generaly used utils
Here are functions that are either ubiquitous enough to deserve being a global variable, or functions whose purpose is very special (so they cannot be categorized elsewhere)

**geto** - this is merely shortcut for document.getElementById (warning: extremely ubiquitous!)

**AJAXload** - sends a GET call to url and returns a promise, which is resolved as the response

**JSONload** - operates the AJAXload - it parses the response as a JSON and executes callback upon it.

**Array.prototype.getObj** - custom extension of the Array prototype. It's used for an array of objects - it searches itself and returns the object that contains given *key*: *value*.
