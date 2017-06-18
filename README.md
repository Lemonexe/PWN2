# PWN2
PWN, third attempt

## Application structure
PWN consists of two applications, which are separate, but share some componenets - **Game** and **Admin**

## Game
The game itself. It's a HTML/JS application, but it needs to be run on a server because of AJAX requests for gamedata, which is stored in JSON.
There is also a PHP script for statistics that can be deployed on server...

### Code structure
The main file is [**engine.js**](wiki/engine.md). The code is then structured into three main objects, which are described in details on their own pages:

[**Game**](wiki/game.md) contains all gameplay related functionality.

[**Render**](wiki/render.md) contains rendering of console and ascii art maps.

[**Controller**](wiki/controller.md) contains event listeners and the whole code concerning console.

**Other utilities** are in [services directory](wiki/services).

State is saved in two objects - state of GUI (command history etc.) is stored in [**State object**](wiki/engine.md), everything related to the game character is stored in `Game.state`.

~~[**statistics.php**](wiki/statistics.md)~~ is a simple PHP script to save statistics about players. Data is collected by the game application and sent as AJAX post requests.

## Admin
### doesn't exist yet!!!
This application contains a backend PHP application and frontend HTML/JS application.
It has a very simple authentication system to access the administration interface, which is then used to create the game content.

~~More details [here](wiki/admin.md)~~

## General development practices
This is just an opinion of Lemonexe...
- no libraries will be used in this code. None at all. They aren't needed, I wanted to write my own code, just for fun :-)
- all development-related code should be marked with this comment: `//---DEVELOPMENT---`. That way all development related code can be easily found.
- temporary experiments should be at least commented (but rather deleted) before committing
- the code should work in important modern browsers (Chrome, FF, Edge, Safari). Support for IE6 and alike is dropped because I really enjoy ECMA6:
  - generation of strings interlaced with many variables should be done using Template literals for clarity
  - arrow functions should be used in cases where the function doesn't do anything but return a value, which is a simple expression
- function that generate objects should be constructors, not factories. I think the code is more clear that way.
- even though I love the ternary conditional operator, it shouldn't be used with long expressions, it makes the code confusing.
