# Controller

The whole file *controller.js* is an object constructor *Controller*, which is instanced upon initiation as *controller*.

This object contains all functionality concerning console (the console as a whole is considered to be a controlling element for the user).

## HTML objects related to console
input id="consoleInput" - the user input. It's always focused
input id="autocomplete" - a "shadow" of the consoleInput, it lies beneath it and has a slightly darker font

## Event listeners
### onkeydown
Depends on the game tab (console or map, see State), each game tab has its own array of keybinds in *controller.keybinds*.

### onerror
Just a small development utility, it writes any error through *controller.log*

### consoleInput.oninput
Detects change in the console input, triggers the autocomplete method (see below).

## Methods and properties
Note: CC means current console, the console user is currently in.

**keybinds** - see the source code for example...

**Console** - constructor for a console object with given name (displayed in address) and array of command objects. There are other methods operating it, see below.

**deleteConsole** - deletes the CC and relocates the user to the parent console

**addConsole** - operates the Console constructor - creates console with given parameters and appends it as a child of the CC

**confirm** - a special case of console creation - a console whose sole purpose is a yes or no question

**getConsole** - gets the CC, or a console with given address (if supplied as an parameter)

**generateAddress** - generates address as a string to be rendered

**log** - logs the given string into console

**clear** - clears whole console history

**processCommand** - the largest command here, it takes the consoleInput value and evaluates it as a command (also handles command parameters properly), if possible, and logs it into history

**addCmds** - adds command object array to the CC

**addCmdsByTags** - searches and adds commands to the CC by their tags (array of tags). If you supply more tags, it acts as an AND

**deleteCmds** - deletes commands from CC by array of the names you want to delete

**deleteCmdsByTags** - deletes commands from CC by array of tags. If you supply more tags, it acts as an AND

**moveInHistory** - lets the user choose from commands that he has already entered

**autocomplete** - triggered by a change of consoleInput, this function searches the string that the user has written for possible commands, finds the first command starting with the string and fills it in the autocomplete input

**autocompleteUse** - this merely copies text from autocomplete input to the consoleInput (triggered by tab button)
