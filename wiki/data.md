# Data structures

All game content is stored in JSON files (so they can be edited by the [admin app](admin.md)). Most important of those files is *config.json*, which contains information about other data files.
Using the information in *config.json* the files are loaded by the [fileLoader](services/fileLoader.md) service and processed. Here is what they contain and how does it affect the application:

## Config
Has property **files** and **init**.

Files is an array of objects like this: `{"url":"data/map.json","method":"processMap"}`, **method** is name of method in fileLoader that will be used to process this file.

Init is javascript code that will be executed when all game files have been loaded and processed.

## Textures
Stored in *textures.json*, contains all textures

Array of objects, each object has these properties:
- **name**, a unique identifier
- **width** and **height** (in characters)
- **ascii**, the ascii art itself (in the form of raw .ans file content). It is either a string (for static pictures) or array of ascii arts (for animations)
- if it is an animation, there must be an **int** number, interval between animation frames in miliseconds

When the file is loaded, the .ans files are converted into HTML ready to be drawn

```javascript
[
	{
		name: 'dog',
		width: 5,
		height: 2,
		ascii: ['ANSI1', 'ANSI2'],
		int: 50
	} 
]
```

## Map
Stored in *map.json*, contains game map objects

Array of objects, each object has its **top** and **left** coordinates. Other properties are optional:
- **texture** is name of texture for this game map object
- **z** will be its z-index (defaulting to 1)
- **class** is a reference to a class (see below)
- **width** and **height** for collision purposes. They will be taken from texture by default, but objects without a texture can have these values
- **id** an identifier for this object so it can be changed during gameplay (the changes are stored in game.state). More objects can share the same id

When the file is loaded, the texture property is overwritten with reference to the actual texture object.

```javascript
[
		{
			texture: 'dog',
			class: 'dog3',
			top: 1,
			left: 4,
			z: 3
			id: 'dogs in the Black Forest'
		}
]
```

## Classes
Stored in *classes.json*, contains all game classes.

Associative array - each game class is an object under key (its identifier). Each object can contain anything really...
There 3 categories so far:
- mapObject - will cause collisions with player, either acting as a barrier or invoking onwalk callback
- item - inventory item that can be shown, used, traded etc.
- mob - something to fight

### mapObject properties:
- **obstacle** = true/false, it means whether it will stop movement of player
- **onwalk** = string with javascript code that will be executed when the player tries to walk on it
- **onclick** = string with javascript code that will be executed when the user clicks on it
