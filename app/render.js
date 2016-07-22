/*
RENDER.JS
	This file contains constructor of the render object
	Render operates DOM to render the game box, console and gamemap
*/

function Render() {
	this.getAvailableSize = function() {
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return [width, height];
	};

	this.resize = function(width, height) {
		width = parseInt(width);
		height = parseInt(height);
		if(isNaN(width) || isNaN(height)) {return;}

		var available = this.getAvailableSize();

		geto('game').style.width = width + 'px';
		geto('game').style.height = height + 'px';

		geto('game').style.left = ((available[0] - width)/2) + 'px';
		geto('game').style.top = ((available[1] - height)/2) + 'px';

		geto('console').style.width = (width - 4) + 'px';
		geto('console').style.height = (height - 20) + 'px';

		geto('consoleInput').style.width = (width - 4) + 'px';
		geto('consoleInput').style.height = 20 + 'px';
		geto('consoleInput').style.top = (height - 20 + 50) + 'px';
	};

	this.generateConsole = function() {
		var text = '';
		for(var i in state.console) {
			text += state.console[i] + '<br>';
		}
		text += '&gt;' + state.line + '_';
		return text;
	};

	this.renderConsole = function() {
		var text = this.generateConsole();
		var obj = geto('console');
		obj.innerHTML = text;
		obj.scrollTop = obj.scrollHeight - obj.clientHeight;
	}

	this.resize(800, 600);
	this.renderConsole();
};
