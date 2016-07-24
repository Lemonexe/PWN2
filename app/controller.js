/*
CONTROLLER.JS
	This file contains constructor of the controller object
	Controller object operates the console and listens to events
	Event listeners are binded at the end of the function
*/

function Controller() {
	//METHOD DEFINITONS

	//main function to process onkeydown event
	this.processKey = function(event) {
		if(event.keyCode === 13) {
			this.processCommand();
		}
	};

	//log writes to console; clear clears the console
	this.log = function(text) {
		state.console.push(text);
		render.renderConsole();
	};
	this.clear = function() {
		state.console = [];
		render.renderConsole();
	};

	//general function to analyze text written by user and execute the command
	this.processCommand = function() {
		var value = geto('consoleInput').value.trim();
		geto('consoleInput').value = '';
		state.line = '';

		var args = value.split(' ');
		var command = args[0];
		args.shift();

		this.log('&gt; ' + value);

		var match = state.commands.filter(item => item.command === command)[0];

		if(!match) {
			this.log('Command ' + command + ' not found!');
		}
		else if(match.hasOwnProperty('argCount') && match.argCount !== args.length) {
			this.log('Command ' + command + ' requires ' + match.argCount + ' arguments!');
		}
		else {
			match.callback(args);
		}

		/*
		var item;
		for(var i in state.commands) {
			item = state.commands[i];
			if(item.command === command) {
				if(item.hasOwnProperty('argCount') && item.argCount !== args.length) {
					this.log('Command ' + command + ' requires ' + item.argCount + ' arguments!');
					return;
				}
				item.callback(args);
				return;
			}
		}
		

		this.log('Command ' + command + ' not found!');*/
	};

	//this executes the help command
	this.help = function () {
		var item;
		var areArgs = function(item) {
			if(item.hasOwnProperty('argCount')) {
				return ' (' + item.argCount + ' arguments)';
			}
			else {return '';}
		};

		for(var i in state.commands) {
			item = state.commands[i];
			controller.log(item.command.toUpperCase() + areArgs(item) + ': ' + item.description + '<br>');
		}
	};




	//EVENT LISTENERS
	window.onkeydown = function(event) {controller.processKey(event);};
};
