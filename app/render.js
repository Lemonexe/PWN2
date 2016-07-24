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

	this.autoResize = function() {
		var available = this.getAvailableSize();
		this.resize(available[0] * 0.8, available[1] * 0.8);
	};

	this.resize = function(width, height) {
		width = parseInt(width);
		height = parseInt(height);
		if(isNaN(width) || isNaN(height)) {return;}

		var available = this.getAvailableSize();

		if(width > available[0]) {width = available[0] - 10;}
		if(height > available[1]) {height = available[1] - 10;}

		geto('game').style.width = width + 'px';
		geto('game').style.height = height + 'px';

		geto('game').style.left = ((available[0] - width)/2) + 'px';
		geto('game').style.top = ((available[1] - height)/2) + 'px';

		geto('consoleWrapper').style.width = (width - 4) + 'px';
		geto('consoleWrapper').style.height = (height - 20) + 'px';

		geto('consoleInput').style.width = (width - 24) + 'px';
	};

	this.generateConsole = function() {
		var text = '';
		for(var i in state.console) {
			text += state.console[i] + '<br>';
		}
		text += '&gt;';
		return text;
	};

	this.renderConsole = function() {
		var obj = geto('consoleText');
		obj.innerHTML = this.generateConsole();
		obj.scrollTop = obj.scrollHeight - obj.clientHeight;
		geto('consoleInput').focus();
	}

	this.autoResize();
	this.renderConsole();




	//EVENT LISTENERS
	geto('consoleInput').onblur = function() {geto('consoleInput').focus();};
	window.onresize = function() {render.autoResize();};
};
