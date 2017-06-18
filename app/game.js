/*
GAME.JS
	This file contains constructor of the game object
	Game contains all logic that is related to gameplay: state of the game, player, inventory etc., functions related to movement, collisions, game scripts...
*/

function Game() {
	//All game related state variables are stored here
	this.state = {};

	/*
	These properties will be populated later
		this.map - the whole game map. Will be populated when the map.json is loaded and processed
		this.classes - classes of entities of any sort. Here are all types of items on gamemap, but also inventory items, skills etc. Will be populated onload from various files.
		this.activeZone - a portion of game.map that the player currently resides in, for purposes of rendering and collisions
	*/

	//constructor for player object
	this.Player = function() {
		this.top = 1;
		this.left = 1;
		this.z = 10;
		this.texture = "hero";
		this.ready2move = true;
		time.addEvent('movement', 'interval', 1000/10, function() {game.state.player.ready2move = true;});
	};

	//move the player ---TEMPORARY--- here will be collisions!
	this.move = function(str) {
		if(!this.state.player.ready2move) {
			return;
		}
		switch(str) {
			case 'left':
				this.state.player.left--;this.state.player.ready2move = false;
			break;
			case 'right':
				this.state.player.left++;this.state.player.ready2move = false;
			break;
			case 'up':
				this.state.player.top--;this.state.player.ready2move = false;
			break;
			case 'down':
				this.state.player.top++;this.state.player.ready2move = false;
			break;
		}
	};

	//get camera position. A trivial function, but it could be made more complicated sometimes (view might not be always focused on the hero)
	this.camera = function() {
		return {top: this.state.player.top, left: this.state.player.left};
	};

	//new player initiated
	this.state.player = new this.Player();
};
