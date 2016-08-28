/*
RENDER.JS
	This file contains constructor of the render object
	Render operates DOM to render the game box, console and gamemap
*/

function Render() {
	this.width = 0;
	this.height = 0;

	this.getAvailableSize = function() {
		let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return [width, height];
	};

	this.autoResize = function() {
		let available = this.getAvailableSize();
		this.resize(available[0] * 0.8, available[1] * 0.8);
	};

	this.resize = function(width, height) {
		width = parseInt(width);
		height = parseInt(height);
		if(isNaN(width) || isNaN(height)) {return;}

		let available = this.getAvailableSize();

		if(width > available[0]) {width = available[0] - 10;}
		if(height > available[1]) {height = available[1] - 10;}

		this.width = width;
		this.height = height;

		geto('game').style.width = width + 'px';
		geto('game').style.height = height + 'px';

		geto('game').style.left = ((available[0] - width)/2) + 'px';
		geto('game').style.top = ((available[1] - height)/2) + 'px';

		geto('consoleWrapper').style.width = (width - 4) + 'px';
		geto('consoleWrapper').style.height = (height - 20) + 'px';

		this.resizeInput();
	};

	this.renderConsole = function() {
		if(state.console.length !== 0) {
			geto('consoleText').innerHTML = state.console.join('<br>') + '<br>';
		}
		geto('consoleAddress').innerHTML = controller.generateAddress();

		let obj = geto('consoleWrapper');
		obj.scrollTop = obj.scrollHeight - obj.clientHeight;

		geto('consoleInput').focus();
		this.resizeInput();
	};

	this.resizeInput = function() {
		geto('consoleInput').style.width = (this.width - geto('consoleAddress').offsetWidth - 30) + 'px';
	};

	this.autoResize();
	this.renderConsole();



	//EVENT LISTENERS
	geto('consoleInput').onblur = function() {geto('consoleInput').focus();};
	window.onresize = function() {render.autoResize();};
};
