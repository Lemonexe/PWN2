# Render

The whole file *render.js* is an object constructor *Render*, which is instanced upon initiation as *render*.

This object contains all functionality concerning dynamic rendering of both console and ASCII art, it operates various HTML elements.

Static, invariable configuration of appearance is in *style/game.css*

## Event listeners

### consoleInput.onblur
If view = console, consoleInput will be focused all the time thanks to this function

### onresize
Resizes the game when the window is resized

## Methods and properties

**width, height** - in these integers width and height of the **div id="game"** is stored

**switchTab** - method to switch view between console and map (current view stored in state.tab)

**getAvailableSize** - method that returns available dimensions of the game viewport

**resize** - method that resizes the whole game to supplied dimensions

**autoresize** - method that operates resize to resize the game to 80% of available dimensions

**renderConsole** - method that renders the console output and the last line, where the address and text input lies

## Concerned HTML elements

**div id="game"** - wrapper for map and console

**div id="console"** - it is just a wrapper for the other parts

**div id="consoleText"** - it is everything above user input

**span id="consoleAddress** - it is the current address in the console tree

**input id="consoleInput"** - the console text input

**div id="map"** - for game map
