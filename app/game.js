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

	//move the player. First the theoretical position will be defined and checked for collisions (all triggers will be executed). If everything is all right, it will become real position
	this.move = function(str) {
		if(!this.state.player.ready2move) {
			return;
		}

		let tTop = this.state.player.top;
		let tLeft = this.state.player.left;
		if(str === 'right') {tLeft++;}
		else if(str === 'left') {tLeft--;}
		else if(str === 'down') {tTop++;}
		else if(str === 'up') {tTop--;}

		let moveBlocked = false;

		let collision = function(item) {
			let height = item.texture ? item.texture.height : item.height;
			let width = item.texture ? item.texture.width : item.width;
			let itemBottom = item.top + (height ? (height - 1) : 0);
			let itemRight = item.left + (width ? (width - 1) : 0);

			return (tTop >= item.top) && 
				(tTop <= itemBottom) && 
				(tLeft >= item.left) && 
				(tLeft <= itemRight);
		};

		for(let item of game.activeZone) {
			if(item.class && item.class.purposes.indexOf('mapObject') > -1 && collision(item)) {
				moveBlocked = moveBlocked || item.class.obstacle;
				if(item.class.onwalk) {item.class.onwalk();}
			}
		}

		if(!moveBlocked) {
			this.state.player.top = tTop;
			this.state.player.left = tLeft;
			this.state.player.ready2move = false;
		}
	};

	//get camera position. A trivial function, but it could be made more complicated sometimes (view might not be always focused on the hero)
	this.camera = function() {
		return {top: this.state.player.top, left: this.state.player.left};
	};

	//new player initiated
	this.state.player = new this.Player();
};
