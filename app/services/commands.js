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
		description: 'This command clears the console.',
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
	say: {
		command: 'say',
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
		argCount: 2,
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
	}
};
