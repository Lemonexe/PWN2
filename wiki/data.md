# Data structures

All game content is stored in JSON files (so they can be edited by the [admin app](admin.md)). They are all loaded using the [fileLoader](services/fileLoader.md) service and processed. Here is what they contain and how does it affect the application:

## Config
Has property **init** - javascript code that will be executed when a new game is started.

## Textures
Stored in *textures.json*, contains all textures

Array of objects, each object has these properties:
- **name**, a unique identifier
- **width** and **height** (in characters)
- **ascii**, the ascii art itself (in the form of raw .ans file content). It is an array of ascii art strings (length = 1 for static, > 1 for animations)
- if it is an animation, there must be an **int** number, interval between animation frames in miliseconds. Defaults to 1000

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
There 4 categories so far, the category is saved in the mandatory **purposes** property. One class can have more purposes, therefore it's an array.

Purposes:
- mapObject - will cause collisions with player, either acting as a barrier or invoking onwalk callback
- item - inventory item that can be shown, used, traded etc.
- mob - something to fight
- charClass - specification of character type

### mapObject properties:
- **obstacle** = true/false, it means whether it will stop movement of player
- **onwalk** is a string with javascript code that will be executed when the player tries to walk on it
- **onclick** is a string with javascript code that will be executed when the user clicks on it

### item properties:
- **description** is a short text that will be displayed in item details
- **textureName** is name of texture, that will be drawn in item details (optional)
- **onuse** is a string with javascript code that will be executed when the player chooses to use item in inventory
- **equipable** = true/false, whether it can be equipped by a character. If so, more properties will follow:
- item stats etc.

### mob properties:
- **name** is name of the mob to be displayed in combat

### charClass properties:
- **name** is full name of the character class (not just identifier)
- **textureName** is name of texture, that will be drawn when the character is browsed
- bonuses etc.
