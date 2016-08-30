/*
CONTROLLER.JS
	This file contains constructor of the controller object
	Controller object operates the CONSOLE and listens to events
	Event listeners are binded at the end of the function
*/

function Controller() {
	window.onkeydown = function(event) {controller.processKey(event);};

	//main function to process onkeydown event, works together with this.keyBinds
	this.processKey = function(event) {
		if(this.keyBinds.hasOwnProperty(event.keyCode)) {
			this.keyBinds[event.keyCode]();
		}
	};

	this.keyBinds = {
		'13': function() {controller.processCommand();},
		'38': function() {controller.moveInHistory(true);},
		'40': function() {controller.moveInHistory(false);}
	};

	//CONSOLE
	this.Console = function(name, cmds) {
		this.name = name;
		this.commands = cmds;
		this.children = [];
	};

	//if possible, deletes the current console and moves up in the tree
	this.deleteConsole = function() {
		if(state.address.length === 0) {return;}

		let toBeDeleted = state.address.pop();
		controller.getConsole().children = controller.getConsole().children.filter(item => item.name !== toBeDeleted);

		render.renderConsole();
	};

	//this function acts as a superstructure above the console constructor
	this.addConsole = function(name, cmds) {
		if(!controller.getConsole().children.getObj('name', name)) {
			controller.getConsole().children.push(new controller.Console(name, cmds));
		}
	};

	//this is a template for simple confirmation request
	this.confirm = function(yesCallback, noCallback) {
		controller.addConsole('confirm', [
			cmds.help,
			{command: 'yes', callback: function(arg) {
				controller.deleteConsole();
				yesCallback();
			}},
			{command: 'no', callback: function(arg) {
				controller.deleteConsole();
				noCallback();
			}}
		]);
		state.address.push('confirm');
		render.renderConsole();
	};

	//returns the console according to address, or the current console if no address supplied.
	this.getConsole = function(address) {
		if(!address) {address = state.address;}
		let currentConsole = state.tree;
		let next;

		for(let dir of address) {
			next = currentConsole.children.getObj('name', dir);
			if(!next) {break;}
			currentConsole = next;
		}
		return currentConsole;
	};

	this.generateAddress = function() {
		return state.address.join('/') + '&gt;';
	};

	//log writes to console; clear clears the console
	this.log = function(text) {
		state.console.push(text);
		render.renderConsole();
	};
	this.clear = function() {
		state.console = [];
		state.history = [];
		render.renderConsole();
	};

	//general function to analyze text written by user and execute the command
	this.processCommand = function() {
		let value = geto('consoleInput').value.trim();
		geto('consoleInput').value = '';

		let command = value.match(/^[^\s]+\s*/);
		command = command ? command[0] : '';
		
		let arg = value.replace(command, '');
		command = command.trim();

		this.log(this.generateAddress() + value);
		
		let index = state.history.indexOf(value);
		if(index === -1) {
			state.history.push(value);
		}
		else {
			state.history.splice(index, 1);
			state.history.push(value);
		}

		let match = this.getConsole().commands.getObj('command', command);

		if(!match) {
			this.log('Command ' + command + ' not found!');
			return;
		}
		
		if(match.arg === 'array') {
			arg = arg.split(/\s+/);

			if(match.hasOwnProperty('argCount') && match.argCount !== arg.length) {
				this.log('Command ' + command + ' requires ' + match.argCount + ' arguments!');
				return;
			}
		}

		match.callback(arg);
	};

	//add commands from array to the current console
	this.addCmds = function(cmds) {
		for(let cmd of cmds) {
			if(!controller.getConsole().commands.getObj('command', cmd.command)) {
				controller.getConsole().commands.push(cmd);
			}
		}
	};

	//superstructure above addCmds - adds Cmds by tags
	this.addCmdsByTags = function(tags) {
		this.addCmds(cmds.select(tags));
	};

	//delete commands according to array of their invoke names (or a single name as a string)
	this.deleteCmds = function(names) {
		if(typeof names === 'string') {
			names = [names];
		}
		controller.getConsole().commands = controller.getConsole().commands.filter(item => names.indexOf(item.command) === -1);
	};

	//superstructure above deleteCmds - delete Cmds by list of tags
	this.deleteCmdsByTags = function(tags) {
		let names = cmds.select(tags)
			.map(item => item.command);
		this.deleteCmds(names);
	};

	//this lets you choose commands from history. You either enter the history, or, if you're already in it, move further or closer
	this.moveInHistory = function(up) {
		if(state.history.length === 0) {return;}

		let value = geto('consoleInput').value.trim();
		let index = state.history.indexOf(value);

		let res = '';
		if(index === -1) {
			res = up ? state.history[state.history.length - 1] : state.history[0];
		}
		else {
			res = up ? (state.history[index - 1] || state.history[state.history.length - 1]) : (state.history[index + 1] || state.history[0]);
		}
		geto('consoleInput').value = res;
	};
};
