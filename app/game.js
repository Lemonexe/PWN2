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

	//constructor for player object. Player is created straight away, because its universal. Characters are created later, when game files are loaded, because they are game-content-specific
	this.Player = function() {
		this.top = 1;
		this.left = 1;
		this.z = 10;
		this.textureName = 'hero';
		this.ready2move = true;

		//gameplay information
		this.characters = [];
		this.inventory = [];
		this.general = {
			gold: 0
			//exp, level
		};

		//movement limiter
		time.addEvent('movement', 'interval', 1000/10, function() {game.state.player.ready2move = true;});
	};

	//functionality related to inventory
	this.inventory = {
		//lists an inventory from argument (or player inventory if none supplied - in that case, gold will also be written)
		list: function(inventory) {
			let isPlayerInv = false;
			if(!inventory) {
				inventory = game.state.player.inventory;
				isPlayerInv = true;
			}

			controller.clear();
			controller.log('Inventory:');
			if(isPlayerInv) {controller.log('Gold: ' + game.state.player.general.gold);}
			controller.log('List of items - type "open item" to see details of the item or "exit" to close the inventory:');
			controller.log();
			inventory.forEach(function(item) {
				let str = item.className;
				if(item.count > 1) {
					str += ' x' + item.count;
				}
				controller.log(str);
			});
		},

		//details of item in inventory from argument (or player inventory, if none supplied)
		open: function(className, inventory) {
			//default arg and validity check
			if(!inventory) {inventory = game.state.player.inventory;}
			if(!inventory.getObj('className', className)) {
				controller.log('No such item is present!');
				return;
			}

			//manage console
			controller.clear();

			let commands = [{
				command: 'exit',
				callback: function() {controller.deleteConsole();game.inventory.list();}
			},{
				command: 'use',
				callback: new Function(game.classes[className].onuse)
			}];
			controller.addConsole(className, commands);
			state.address.push(className);

			//write info and draw texture
			controller.log();
			controller.log(className + ': ' + game.classes[className].description);
			controller.log('Type "use" to use it or "exit" to close the item.');

			let textureName = game.classes[className].textureName;
			if(textureName) {
				controller.getConsole().ASCII = render.textures.getObj('name', textureName);
			}
		},

		//add or remove items of className with count (can be negative) to an inventory from argument (or player inventory, if none supplied)
		add: function(className, count, inventory) {
			//default args
			if(!inventory) {
				inventory = game.state.player.inventory;
				if(typeof count === 'undefined') {count = 1;}
			}

			//check the inventory, the item might be already there
			let newItem = true;
			for(let i in inventory) {
				if(inventory.hasOwnProperty(i) && inventory[i].className === className) {
					//item is already present, so only its count will be changed and if it plunges below zero, item will be removed
					inventory[i].count += count;
					newItem = false;
					if(inventory[i].count < 0) {
						inventory.splice(i, 1);
					}
					break;
				}
			}

			//item isn't there, so it's added (can't be removed)
			if(newItem && count > 0) {
				inventory.push({
					className: className,
					count: count
				});		
			}
		}
	};

	//functionality related to common player stats and characters
	this.chars = {
		//writes general data about player and lists characters
		list: function() {
			controller.clear();

			controller.log('Your group:');
			controller.log('Exp, level, etc.');
			controller.log('List of characters - type "open name" to see details or "exit" to close chars:');
			controller.log();
			for(let char of game.state.player.characters) {
				controller.log(`${char.name} (${game.classes[char.className].name})`);
			}
		},

		//open character details
		open: function(name) {
			//check validity
			let char = game.state.player.characters.getObj('name', name);
			if(!char) {
				controller.log('No such character is present!');
				return;
			}

			//manage console
			controller.clear();

			let commands = [{
				command: 'exit',
				callback: function() {controller.deleteConsole();game.chars.list();}
			}];
			controller.addConsole(name, commands);
			state.address.push(name);

			//write info and draw texture
			controller.log(name);
			controller.log();
			controller.log('Type "exit" to close.');
			controller.log('Some description, I guess.');
			controller.log('Details about skills etc.');

			let textureName = game.classes[char.className].textureName;
			if(textureName) {
				controller.getConsole().ASCII = render.textures.getObj('name', textureName);
			}
		},

		//function to add a character object into player
		add: function(name, className) {
			game.state.player.characters.push({
				name: name,
				className: className,
				//stats, skills, equips, class (a game class with specifications what bonuses does this character have etc.)
			});
		}
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
