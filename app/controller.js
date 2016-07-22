/*

*/
function Controller() {

	this.processKey = function(event) {
		if(event.keyCode === 13) {
			this.processCommand();
		}
	};

	this.log = function(text) {
		state.console.push(text);
		render.renderConsole();
	};

	this.clear = function() {
		state.console = [];
		render.renderConsole();
	};

	this.processCommand = function() {
		var value = geto('consoleInput').value.trim();
		var args = value.split(' ');
		var command = args[0];
		args.shift();

		this.log('&gt;' + value);

		var item;
		for(var i in state.commands) {
			item = state.commands[i];
			if(item.cmd === command) {
				if(item.hasOwnProperty('argCount') && item.argCount !== args.length) {
					this.log('Command ' + command + ' requires ' + item.argCount + ' arguments!');
					return;
				}
				item.callback(args);
				return;
			}
		}

		this.log('Command ' + command + ' not found!');
	};

	//event listeners
	window.onkeydown = function(event) {controller.processKey(event);};
};
