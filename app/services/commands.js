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



	//COMMANDS
	cls: {
		command: 'cls',
		tags: ['general'],
		description: 'This command clears the console and console history.',
		callback: function() {
			controller.clear();
		}
	},
	cd: {
		command: 'cd',
		arg: 'string',
		tags: ['dev'],
		description: 'This command enters subconsole specified by argument, or enters the parent console if the argument is ..',
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
				controller.log('Console ' + arg + ' not found!');
			}
		}
	},
	mk: {
		command: 'mk',
		arg: 'string',
		tags: ['dev'],
		description: 'This command creates a subconsole with the argument as a name.',
		callback: function(arg) {
			if(arg) {
				controller.addConsole(arg, cmds.select('general'));
				controller.log('Console ' + arg + ' created!');

			}
			else {
				controller.log('You need to supply a valid identifier of the console...');
			}
		}
	},
	ls: {
		command: 'ls',
		tags: ['dev'],
		description: 'This command lists subconsoles of the current console.',
		callback: function() {
			controller.getConsole().children.forEach(item => controller.log(item.name));
		}
	},
	options: {
		command: 'options',
		tags: ['general'],
		description: 'This command lets you change game options (they will be saved).',
		callback: function() {
			controller.addConsole('options', [
				{command: 'exit', description:'Exits the options interface.', callback: function() {
					state.address.pop();
					render.renderConsole();
				}},
				{command: 'dev', description: 'Type nothing or anything to disable or activate.', callback: function(arg) {
					state.options.dev = !!arg;
				}}
			]);
			state.address.push('options');
			cmds.help.callback();
		}
	},
	help: {
		command: 'help',
		tags: ['general'],
		description: 'Without arguments, this command lists all commands that are available at the moment. If you type an argument, it will either search for a specific command, or, if none found, for commands containing a tag.',
		callback: function(arg) {
			let buildEntry = function(item) {
				let entry = item.command.toUpperCase();
				if(item.description) {
					entry += ': ' + item.description;
				}
				if(item.tags && item.tags.length > 0) {
					entry += ' (Tags: ' + item.tags.join(', ') + ')';
				}
				return entry + '<br>';
			}

			let match;
			if(arg) {
				match = controller.getConsole().commands.filter(item => item.command === arg);
				if(match.length === 0) {
					match = controller.getConsole().commands.filter(item => item.tags && item.tags.indexOf(arg) > -1);
				}
				if(match.length === 0) {
					controller.log('Command ' + arg + ' not found!');
					return;
				}
			}
			else {
				match = controller.getConsole().commands;
			}
			controller.log(match.length + ' commands found:<br>');
			match.forEach(item => controller.log(buildEntry(item)));
		}
	},
	history: {
		command: 'history',
		tags: ['general'],
		description: 'This command lists your console history.',
		callback: function() {
			state.history.forEach(item => controller.log(item));
		}
	},
	log: {
		command: 'log',
		arg: 'string',
		tags: ['dev'],
		description: 'This command logs the argument to the console. It takes a string argument.',
		callback: function(arg) {
			controller.log(arg);
		}
	},
	save: {
		command: 'save',
		tags: ['general'],
		description: 'This command saves game into file, which can be downloaded by the user.',
		callback: function() {
			save.saveFile();
		}
	},
	load: {
		command: 'load',
		tags: ['general'],
		description: 'This command lets the user load a saved game.',
		callback: function() {
			save.loadFilePopup();
		}
	},
	resize: {
		command: 'resize',
		arg: 'array',
		argCount: 2,
		tags: ['general', 'rendering'],
		description: 'This command forces resize, it takes two arguments: width height.',
		callback: function(arg) {
			render.resize(arg[0], arg[1]);
		}
	},
	autoresize: {
		command: 'autoresize',
		tags: ['general', 'rendering'],
		description: 'This command forces autoresize.',
		callback: function(arg) {
			render.autoResize();
		}
	},
	eval: {
		command: 'eval',
		arg: 'string',
		tags: ['dev'],
		description: 'This is a command for testing purpose, it evaluates its argument. It takes a string argument.',
		callback: function(arg) {
			try {eval(arg);}
			catch(err) {controller.log(err);}
		}
	},
	confirm: {
		command: 'confirm',
		tags: ['dev'],
		description: 'This command asks for your confirmation. You can answer yes or no.',
		callback: function(arg) {
			controller.confirm(
				function() {controller.log('Thanks for your confirmation!');},
				function() {controller.log('Oh well, thanks for answering anyway..');}
			);
		}
	}
};
