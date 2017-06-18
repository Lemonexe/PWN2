# Game

The whole file *game.js* is an object constructor *Game*, which is instanced upon initiation as *game*.

This object contains all functionality concerning gameplay: 1) basic mechanics like movement on map and collisions 2) gameplay itself, like player, inventory, combat etc.

## Properties

**state** - object that contains variables that are result of users actions related to gameplay - game character info (stats, inventory, quests, position on map) and info about changes on game.map that are result of interaction with it.

**map** - the whole game map, it is populated by game data upon loading of game

**classes** - all classes of entities of any sort. Here are all types of items on gamemap, but also inventory items, enemies, skills etc. It is populated by game data upon loading of game

**activeZone** - a portion of game.map that the player currently resides in, for purposes of rendering and collisions

## Methods

**Player** - constructor for player object, which is instanced upon initiation as **game.state.player**

**move** - invoked by controller - this function moves the player, checks collisions and calls callbacks of game

**camera** - gets camera position as object with properties top, left
