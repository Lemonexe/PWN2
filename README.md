# PWN2
PWN, third attempt

## Application structure
PWN consists of two applications, which are separate, but share some componenets - **Game** and **Admin**
## Game
The game itself, it's a HTML/JS application, but it needs to be run on a server because of AJAX requests for gamedata, which is stored in JSON.
### Code structure
The main file is [**engine.js**](wiki/engine.md). The code is then structured into three main objects, which are described in details on their own pages:

[**Game**](wiki/game.md) contains all gameplay related functionality.

[**Render**](wiki/render.md) contains rendering of console and ascii art maps.

[**Controller**](wiki/controller.md) contains event listeners and the whole code concerning console.

**Other utilities** are in [services directory](wiki/services).

State is saved in two objects - state of GUI (command history etc.) is stored in [**State object**](wiki/engine.md), everything related to the game character is stored in `Game.state`.

## Admin
### doesn't exist yet!!!
This application contains a backend PHP application and frontend HTML/JS application.
It has a simple registration system to access the administration interface.

~~More details [here](wiki/admin.md)~~

## General development practices
- all development-related code should be marked with a comment like //development
