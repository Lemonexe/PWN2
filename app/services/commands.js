/*
COMMANDS.JS
	This is a command library - list of ALL commands, not all active commands
	If you want to activate them, add them (or remove) from controller.getConsole().commands
	See their description property for details...
	IT ALSO CONTAINS methods that work with commands, which are NOT to be used as commands. They are defined first.

	For an example and list of used tags, see wiki/commands.md
*/

var cmds = {
//MANAGAMENT METHODS

	//this function returns array of commands. Without any argument it returns ALL commands, with array of tags (or a single tag as a string) supplied it returns commands that have all those tags.
	select: function(tags) {
		if(typeof tags === 'string') {
			tags = [tags];
		}
		let self = this;
		//all properties of cmds (not methods) to array
		let cmds = Object.keys(self)
			.map(item => self[item])
			.filter(item => typeof item !== 'function')
		if(!tags) {
			return cmds;
		}
		return cmds.filter(function(item) {
			for(let tag of tags) {
				if(item.tags.indexOf(tag) === -1) {
					return false;
				}
			}
			return true;
		});
	},


//ALL COMMANDS, SORTED INTO CATEGORIES
	//Exit command is a metacategory. It is used in various subdirs, which are usually also in its tags
	exit: {
		command: 'exit',
		tags: ['option', 'inventory','chars'],
		description: 'exits current console',
		callback: function() {controller.deleteConsole();}
	},



	//DEV COMMANDS
	cd: {
		command: 'cd',
		arg: 'string',
		tags: ['dev'],
		description: 'enters subconsole specified by argument, or enters the parent console if the argument is ..',
		callback: function(arg) {
			if(arg === '..' && state.address.length === 0) {
				controller.log('This is the root console - parent console doesn\'t exist!')
			}
			else if(arg === '..' && state.address.length > 0) {
				state.address.pop();
				render.renderConsole();
			}
			else if(controller.getConsole().children.getObj('name', arg)) {
				state.address.push(arg);
				render.renderConsole();
			}
			else{
				controller.log(`Console ${arg} not found!`);
			}
		}
	},
	mk: {
		command: 'mk',
		arg: 'string',
		tags: ['dev'],
		description: 'creates a subconsole with the argument as a name',
		callback: function(arg) {
			controller.addConsole(arg, cmds.select('general').concat(cmds.select('dev')));
			controller.log(`Console ${arg} created.`);
		}
	},
	rm: {
		command: 'rm',
		arg: 'string',
		tags: ['dev'],
		description: 'removes subconsole by its name',
		callback: function(arg) {
			if(controller.getConsole().children.getObj('name', arg)) {
				controller.deleteConsole(arg);
				controller.log(`Console ${arg} has been deleted.`);
			}
			else {
				controller.log(`Console ${arg} not found!`);
			}			
		}
	},
	ls: {
		command: 'ls',
		tags: ['dev'],
		description: 'lists subconsoles of the current console',
		callback: function() {
			controller.getConsole().children.forEach(item => controller.log(item.name));
		}
	},
	asciify: {
		command: 'asciify',
		tags: ['dev'],
		description: 'enriches current console with ASCII art (supply name of the texture)',
		callback: function(arg) {
			controller.getConsole().ASCII = arg ? render.textures.getObj('name', arg) : false;
		}
	},
	log: {
		command: 'log',
		arg: 'string',
		tags: ['dev'],
		description: 'This command logs the argument to the console (needs a string argument)',
		callback: function(arg) {controller.log(arg);}
	},
	eval: {
		command: 'eval',
		arg: 'string',
		tags: ['dev'],
		description: 'for testing purposes - it evaluates its argument (needs a string argument)',
		callback: function(arg) {
			try {eval(arg);}
			catch(err) {controller.log(err);}
		}
	},
	confirm: {
		command: 'confirm',
		tags: ['dev'],
		description: 'asks for your confirmation, you can answer yes or no',
		callback: function() {
			controller.question(
				'confirm',
				'Do you want to confirm this?',
				[
					{command: 'yes', callback: function() {controller.log('Thanks for your confirmation!');}},
					{command: 'no', callback: function() {controller.log('Understandable, have a great day!');}}
				]
			);
		}
	},



	//ROOT DIRECTORY COMMANDS
	cls: {
		command: 'cls',
		tags: ['general'],
		description: 'clears the console and console history',
		callback: function() {controller.clear();}
	},
	help: {
		command: 'help',
		tags: ['general'],
		description: 'lists all commands that are available at the moment. If you type an argument, it will either search for a specific command, or, if none found, for commands containing a tag.',
		callback: function(arg) {controller.help(arg);}
	},
	history: {
		command: 'history',
		tags: ['general'],
		description: 'lists your console history',
		callback: function() {
			state.history.forEach(item => controller.log(item));
		}
	},
	save: {
		command: 'save',
		tags: ['general'],
		description: 'saves game into file, which is then downloaded',
		callback: function() {save.saveFile();}
	},
	load: {
		command: 'load',
		tags: ['general'],
		description: 'lets you load a saved game',
		callback: function() {save.loadFilePopup();}
	},
	inventory: {
		command: 'inv',
		tags: ['general'],
		description: 'opens your inventory',
		callback: function() {
			controller.addConsole('inv', cmds.select('inventory'));
			state.address.push('inv');
			game.inventory.list();
		}
	},
	chars: {
		command: 'chars',
		tags: ['general'],
		description: 'browse your characters',
		callback: function() {
			controller.addConsole('chars', cmds.select('chars'));
			state.address.push('chars');
			game.chars.list();
		}
	},



	//GAME OPTIONS COMMANDS
	options: {
		command: 'options',
		tags: ['general'],
		description: 'lets you change game options (they will be saved)',
		callback: function() {
			controller.addConsole('options', cmds.select('option'));
			state.address.push('options');
			cmds.help.callback();
		}
	},
	resize: {
		command: 'resize',
		arg: 'array',
		argCount: 2,
		tags: ['option'],
		description: 'forces resize, it takes two arguments: width height',
		callback: function(arg) {render.resize(arg[0], arg[1]);}
	},
	autoresize: {
		command: 'autoresize',
		tags: ['option'],
		description: 'forces autoresize',
		callback: function() {render.autoResize();}
	},
	devMode: {
		command: 'dev',
		tags: ['option'],
		description: 'enables or disables developer options',
		callback: function() {
			if(state.options.dev) {
				state.options.dev = false;
				controller.deleteConsole();
				controller.deleteCmdsByTags('dev');
			}
			else {
				state.options.dev = true;
				controller.deleteConsole();
				controller.addCmdsByTags('dev');
			}
		}
	},



	//INVENTORY
	invOpen: {
		command: 'open',
		arg: 'string',
		tags: ['inventory'],
		callback: function(arg) {game.inventory.open(arg)}
	},
	//CHARACTERS
	charOpen: {
		command: 'open',
		arg: 'string',
		tags: ['chars'],
		callback: function(arg) {game.chars.open(arg)}
	},

};
