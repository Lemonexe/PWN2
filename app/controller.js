/*
CONTROLLER.JS
	This file contains constructor of the controller object
	Controller object operates the console and listens to events
	Event listeners are binded at the end of the function
*/

function Controller() {
	//METHOD DEFINITONS

	
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

	//general function to analyze text written by user and execute the command. Used together with add2history
	this.processCommand = function() {
		let value = geto('consoleInput').value.trim();
		geto('consoleInput').value = '';

		let args = value.split(/\s+/);
		let command = args[0];
		args.shift();

		this.log('&gt; ' + value);

		this.add2history(value);

		let match = state.commands.filter(item => item.command === command)[0];

		if(!match) {
			this.log('Command ' + command + ' not found!');
		}
		else if(match.hasOwnProperty('args') && match.args !== args.length) {
			this.log('Command ' + command + ' requires ' + match.args + ' arguments!');
		}
		else {
			match.callback(args);
		}
	};

	this.add2history = function(value) {
		let index = state.history.indexOf(value);
		if(index === -1) {
			state.history.push(value);
		}
		else {
			state.history.splice(index, 1);
			state.history.push(value);
		}
	}

	//this executes the help command
	this.help = function() {
		let areArgs = function(item) {
			return item.hasOwnProperty('args') ? ' (' + item.args + ' arguments)' : '';
		};

		for(let item of state.commands) {
			controller.log(item.command.toUpperCase() + areArgs(item) + ': ' + item.description + '<br>');
		}
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



	//EVENT LISTENERS
	window.onkeydown = function(event) {controller.processKey(event);};
};
