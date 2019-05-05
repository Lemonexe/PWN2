/*
CONTROLLER.JS
	This file contains constructor of the controller object
	Controller object operates the CONSOLE and listens to events
	Event listeners are bound at the end of the function
*/

function Controller(suppress) {
	//main function to process onkeydown event, works together with this.keyBinds
	this.processKey = function(event) {
		let keyBinds = this.keyBinds[state.tab];
		if(keyBinds.hasOwnProperty(event.keyCode)) {
			keyBinds[event.keyCode]();
		}
	};

	//keyBinds for each game tab
	this.keyBinds = {
		map: {
			'37': function() {game.move('left');},//left
			'38': function() {game.move('up');},//up
			'39': function() {game.move('right');},//right
			'40': function() {game.move('down');},//down
			'27': function() {render.switchTab('console');}//escape
		},
		console: {
			'13': function() {controller.processCommand();},//enter
			'38': function() {controller.moveInHistory(true);},//up
			'40': function() {controller.moveInHistory(false);},//down
			'9': function() {controller.autocompleteUse();},//tab
			'27': function() {render.switchTab('map');}//escape
		}
	};

	//CONSOLE CONSTRUCTOR - always use with the 'new' operator!
	this.Console = function(name, cmds, ASCII) {
		//name of the console - part of the address (something like a directory)
		this.name = name;
		//commands available when you are in this console
		this.commands = cmds;
		//array of subconsoles - members of this array are objects exactly like this one!
		this.children = [];
		//optional ASCII art of the console (texture object)
		if(ASCII) {this.ASCII = ASCII;}
	};

	//without argument it deletes the current console and moves up in the tree. With argument it deletes subconsole with that name
	this.deleteConsole = function(toBeDeleted) {
		if(!toBeDeleted) {
			if(state.address.length === 0) {return;}
			toBeDeleted = state.address.pop();
		}

		controller.getConsole().children = controller.getConsole().children.filter(item => item.name !== toBeDeleted);
		render.renderConsole();
	};

	//this function acts as a superstructure above the console constructor
	this.addConsole = function(name, cmds, ASCII) {
		if(!controller.getConsole().children.getObj('name', name)) {
			controller.getConsole().children.push(new controller.Console(name, cmds, ASCII));
		}
	};

	//this is a template for simple question request, also used in options. See cmds.confirm for an example
	//ARGS: name = name of subconsole, info = explanation what is expected from user, answers = array of commands
	this.question = function(name, info, answers) {
		//add controller.deleteConsole(); to callback
		for(let a of answers) {
			let f = a.callback;
			a.callback = function() {
				controller.deleteConsole();
				f();
			};
		}

		//addConsole with answers, enter it, log info and list answers
		controller.addConsole(name, answers);
		state.address.push(name);

		if(info) {controller.log(info);}
		answers.forEach(item => controller.log(item.command + (item.description ? `: ${item.description}` : '')));
		render.renderConsole();
	};

	//returns the console according to address (array of strings, as in state.address), or the current console if no address supplied.
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

	//generate address of console (used in processCommand and render.renderConsole)
	this.generateAddress = function() {
		return state.address.join('/') + '&gt;';
	};

	//log writes to console; clear clears the console
	this.log = function(text) {
		if(!text) {text = '';}
		state.console.push(text);
		render.renderConsole();
	};
	this.clear = function() {
		state.console = [];
		state.history = [];
		controller.getConsole().ASCII = false;
		render.renderConsole();
	};

	//general function to analyze text written by user and execute the command
	this.processCommand = function() {
		//get input and clear the HTML elements
		let value = geto('consoleInput').value.trim();
		geto('consoleInput').value = '';
		geto('autocomplete').value = '';

		if(!value) {return;}

		//matches first word, which will necessarily be the command, all other words are the argument.
		let command = value.match(/^[^\s]+\s*/);
		command = command ? command[0] : '';
		
		let arg = value.replace(command, '');
		command = command.trim().toLowerCase();

		//the input will be logged
		this.log(this.generateAddress() + value);
		
		//input will be either added to history or, if it is already there, moved at the end of it
		let index = state.history.indexOf(value);
		if(index === -1) {
			state.history.push(value);
		}
		else {
			state.history.splice(index, 1);
			state.history.push(value);
		}

		//find the matching command in the current console commands
		let match = this.getConsole().commands.getObj('command', command);

		if(!match) {
			this.log(`Command ${command} not found!`);
			return;
		}

		//now that the command is found, argument is processed according to requirements of the command and FINALLY the command is called
		if(match.arg === 'array') {
			arg = arg.split(/\s+/);

			if(match.hasOwnProperty('argCount') && match.argCount !== arg.length) {
				this.log(`Command ${match.command} requires ${match.argCount} arguments!`);
				return;
			}
		}

		if(match.arg === 'string' && !arg) {
			this.log(`Command ${match.command} requires an argument!`);
			return;
		}

		match.callback(arg);
	};

	//add commands from array to the current console (command objects, not names)
	this.addCmds = function(cmds) {
		for(let cmd of cmds) {
			if(!controller.getConsole().commands.getObj('command', cmd.command)) {
				controller.getConsole().commands.push(cmd);
			}
		}
	};

	//superstructure above addCmds - adds Cmds by tags (commands that have all the tags supplied (one tag as a string or array of tags))
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

	//superstructure above deleteCmds - delete Cmds by list of tags (commands that have all the tags supplied (one tag as a string or array of tags))
	this.deleteCmdsByTags = function(tags) {
		let names = cmds.select(tags)
			.map(item => item.command);
		this.deleteCmds(names);
	};

	//this lets you choose commands from history. You either enter the history, or, if you're already in it, move further or closer. Argument up = true/false (whether up/down arrow was pressed)
	this.moveInHistory = function(up) {
		if(state.history.length === 0) {return;}

		//get the current input and check whether this exact string is in history
		let value = geto('consoleInput').value.trim();
		let index = state.history.indexOf(value);

		//if it isn't in history, input will be filled with the last item in history. If it is, user is already moving in history
		let res = '';
		if(index === -1) {
			res = up ? state.history[state.history.length - 1] : state.history[0];
		}
		else {
			res = up ? (state.history[index - 1] || state.history[state.history.length - 1]) : (state.history[index + 1] || state.history[0]);
		}
		geto('consoleInput').value = res;
		geto('autocomplete').value = '';
	};

	//this function checks all commands while you're writing and gives you a hint. Only invoked when there already are 3 or more characters
	this.autocomplete = function() {
		let value = geto('consoleInput').value;
		let cleanValue = value.trim();
		if(cleanValue.length < 3) {
			geto('autocomplete').value = '';
			return;
		}

		//find first cmd that contains the cleanValue in its invoking string and fill it in autocomplete input
		let cmds = this.getConsole().commands.map(item => item.command);
		let possibleCMD = '';

		for(let cmd of cmds) {
			if(cmd.indexOf(cleanValue) === 0) {
				possibleCMD = cmd;
				break;
			}
		}

		geto('autocomplete').value = possibleCMD ? value.replace(cleanValue, possibleCMD) : '';
	};

	//this function is triggered by the tab key and fills the hint into the main input
	this.autocompleteUse = function() {
		if(geto('autocomplete').value) {
			geto('consoleInput').value = geto('autocomplete').value;
		}
	};

	//console help, invoked by the help command
	this.help = function(arg) {
		let buildEntry = function(item) {
			let entry = item.command.toUpperCase();
			if(item.description) {
				entry += ': ' + item.description;
			}
			if(item.tags && item.tags.length > 0) {
				entry += ` (Tags: ${item.tags.join(', ')})`;
			}
			return entry + '<br>';
		}

		let match;
		if(arg) {
			match = controller.getConsole().commands.filter(item => item.command === arg);
			if(match.length === 0) {
				match = controller.getConsole().commands.filter(item => (item.tags && item.tags.indexOf(arg) > -1));
			}
			if(match.length === 0) {
				controller.log(`Command ${arg} not found!`);
				return;
			}
		}
		else {
			match = controller.getConsole().commands;
		}
		controller.log(`${match.length} command${match.length > 1 ? 's' : ''} found:<br>`);
		match.forEach(item => controller.log(buildEntry(item)));
	};


	//Unless it is suppressed by argument, the Controller constructor defines these EVENT LISTENERS - onkeydown and detection of console input change
	if(!suppress) {
		window.onkeydown = function(event) {controller.processKey(event);};

		geto('consoleInput').oninput = function() {
			controller.autocomplete();
		};

		//---DEVELOPMENT---
		window.onerror = function(error) {
			controller.log('Error: ' + error);
			return true;
		};
	}
};
