# Game

The whole file *game.js* is an object constructor *Game*, which is instanced upon initiation as *game*.

This object contains all functionality concerning gameplay: 1) basic mechanics like movement on map and collisions 2) gameplay itself, like player, inventory, combat etc.

## Properties

**state** - object, see below

**inventory** - object, see below

**chars** - object, see below

**map** - the whole game map, it is populated by game data upon loading of game

**classes** - all classes of entities of any sort. Here are all types of items on gamemap, but also inventory items, enemies, skills etc. It is populated by game data upon loading of game

**activeZone** - a portion of game.map that the player currently resides in, for purposes of rendering and collisions. It is populated whenever a game area is loaded

## Methods

**Player** - constructor for player object, which is instanced upon initiation as **game.state.player**

**move** - invoked by controller - this function moves the player, checks collisions and calls callbacks of game

**camera** - gets camera position as object with properties top, left

## state
game.state is an object that contains variables that are result of users actions related to gameplay - game character info (stats, inventory, quests, position on map) and info about changes on game.map that are result of interaction with it.

## inventory
This object contains methods related to inventory management. Not specific to player inventory, they can be used for other inventories as well.

**list** - write a list of items in a given *inventory*. Inventory defaults to player inventory (will also write gold)

**open** - open details of item specified by *className* in a given *inventory*. Inventory defaults to player inventory

**add** - add item specified by *className* to a given *inventory* in given *number* (can be negative). Inventory and number default to player inventory and 1, respectively

## chars
This object contains methods related to player characters.

**list** - write general stats of the player and a list of characters

**open** - open details of character specified by *name*

**add** - add a character with a given *name*, its characteristics specified by *className*
