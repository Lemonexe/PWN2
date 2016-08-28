/*
COMMANDS.JS
	This is a command library - list of ALL commands, not all active commands
	If you want to activate them, add them (or remove) from controller.gC().commands
	See their description property for details...
	IT ALSO CONTAINS methods that work with commands, which are NOT to be used as commands. They are defined first.

	EXAMPLE:
		key: {
			command: 'command_keyword',
			tags: [],
			description: 'Here comes description of what the command does.'
			callback: function(arg) {
				//here comes the executed script
			}
		}
	note 1. identifier doesn't have to agree with command. It is just an ID, a reference of the command...
	note 2. command mustn't contain any whitespace characters, or it won't be possible to invoke it.
	note 3. callback always has to accept arg, even if it doesn't use it.
*/

var cmds = {
	//MANAGAMENT METHODS
	//this function returns array of commands. Without any argument it returns ALL commands, with array of tags supplied it returns commands that have all those tags.
	select: function(tags) {

	},
	//COMMANDS
	cls: {
		command: 'cls',
		tags: ['general'],
		description: 'This command clears the console and console history.',
		callback: function(arg) {
			controller.clear();
		}
	},
	cd: {
		command: 'cd',
		tags: ['general'],
		description: 'This command enters subconsole specified by argument, or enters the parent console if the argument is ..',
		callback: function(arg) {
			if(arg === '..' && state.address.length === 0) {
				controller.log('This is the root console - parent console doesn\'t exist!')
			}
			else if(arg === '..' && state.address.length > 0) {
				state.address.pop();
				render.renderConsole();
			}
			else if(controller.gC().children.getObj('name', arg)) {
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
		tags: ['general'],
		description: 'This command creates a subconsole with the argument as a name.',
		callback: function(arg) {
			if(arg) {
				controller.addConsole(arg, [cmds.cd, cmds.mk, cmds.help]);
				controller.log('Console ' + arg + ' created!');

			}
			else {
				controller.log('You need to supply a valid identifier of the console...');
			}
		}
	},
	help: {
		command: 'help',
		tags: ['general'],
		description: 'Without arguments, this command lists all commands that are available at the moment. If you type an argument, it will describe a specific command.',
		callback: function(arg) {
			let match;
			if(arg) {
				match = controller.gC().commands.filter(item => item.command === arg);
				if(match.length === 0) {
					match = controller.gC().commands.filter(item => item.tags.indexOf(arg) > -1);
				}
				if(match.length === 0) {
					controller.log('Command ' + arg + ' not found!');
					return;
				}
			}
			else {
				match = controller.gC().commands;
			}
			match.forEach(item => controller.log(item.command.toUpperCase() + ': ' + item.description + '<br>'));
		}
	},
	history: {
		command: 'history',
		tags: ['general'],
		description: 'This command lists your console history.',
		callback: function(arg) {
			state.history.forEach(item => controller.log(item));
		}
	},
	log: {
		command: 'log',
		tags: ['general'],
		arg: 'string',
		description: 'This command logs the argument to the console. It takes a string argument.',
		callback: function(arg) {
			controller.log(arg);
		}
	},
	resize: {
		command: 'resize',
		tags: ['general'],
		arg: 'array',
		argCount: 2,
		description: 'This command forces resize, it takes two arguments: width height.',
		callback: function(arg) {
			render.resize(arg[0], arg[1]);
		}
	},
	autoresize: {
		command: 'autoresize',
		tags: ['general'],
		description: 'This command forces autoresize.',
		callback: function(arg) {
			render.autoResize();
		}
	},
	eval: {
		command: 'eval',
		tags: ['general'],
		arg: 'string',
		description: 'This is a command for testing purpose, it evaluates its argument. It takes a string argument.',
		callback: function(arg) {
			try {eval(arg);}
			catch(err) {controller.log(err);}
		}
	}
};
