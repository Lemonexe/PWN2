/*
COMMANDS.JS
	This is a command library - list of ALL commands, not all active commands
	If you want to activate them, add them (or remove) from state.commands
	See their description property for details...
*/

var cmds = {
	cls: {
		command: 'cls',
		purpose: 'general',
		description: 'This command clears the console and console history.',
		callback: function(args) {
			controller.clear();
		}
	},
	help: {
		command: 'help',
		purpose: 'general',
		description: 'This command lists all commands that are available at the moment.',
		callback: function(args) {
			controller.help();
		}
	},
	history: {
		command: 'history',
		purpose: 'general',
		description: 'This command lists your console history.',
		callback: function(args) {
			state.history.map(item => controller.log(item));
		}
	},
	log: {
		command: 'log',
		purpose: 'general',
		description: 'This command logs the argument to the console. The whole argument field is considered one argument.',
		callback: function(args) {
			controller.log(args.join(' '));
		}
	},
	resize: {
		command: 'resize',
		purpose: 'general',
		description: 'This command forces resize, it requires two parameters: resize width height.',
		args: 2,
		callback: function(args) {
			render.resize(args[0], args[1]);
		}
	},
	autoresize: {
		command: 'autoresize',
		purpose: 'general',
		description: 'This command forces autoresize.',
		callback: function(args) {
			render.autoResize();
		}
	},
	test: {
		command: 'test',
		purpose: 'general',
		description: 'This is a command for testing purpose, it writes its arguments JSON-stringified.',
		callback: function(args) {
			controller.log(JSON.stringify(args));
		}
	},
	eval: {
		command: 'eval',
		purpose: 'general',
		description: 'This is a command for testing purpose, it evaluates its argument. The whole argument field is considered one argument.',
		callback: function(args) {
			eval(args.join(' '));
		}
	}
};
