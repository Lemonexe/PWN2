/*
RENDER.JS
	This file contains constructor of the render object
	Render operates DOM to render the game box, console, gamemap and popup window
*/

function Render() {
	//this is where width and height is stored (along with the div id="game", of course)
	this.width = 0;
	this.height = 0;

	//
	this.switchTab = function(tab) {
		state.tab = tab;

		['console', 'map', 'popup'].forEach(item => geto(item).style.display = 'none');
		geto(tab).style.display = 'block';

		(tab === 'console') ? geto('consoleInput').focus() : geto('consoleInput').blur();
	};

	//obtains available width & height of the window
	this.getAvailableSize = function() {
		let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return [width, height];
	};

	//superstructure above resize, it executes resize with 80% of available window width & height supplied
	this.autoResize = function() {
		let available = this.getAvailableSize();
		this.resize(available[0] * 0.8, available[1] * 0.8);
	};

	//resizes the whole game, given width and height as arguments
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

		geto('console').style.width = (width - 4) + 'px';
		geto('console').style.height = (height - 20) + 'px';

		geto('popup').style.width = width + 'px';
		geto('popup').style.height = height + 'px';

		this.renderConsole();
	};

	//this function renders the console: generates the text -> renders it -> scrolls down -> resizes and focuses the input
	this.renderConsole = function() {
		if(state.console.length !== 0) {
			geto('consoleText').innerHTML = state.console.join('<br>') + '<br>';
		}
		geto('consoleAddress').innerHTML = controller.generateAddress();

		let obj = geto('console');
		obj.scrollTop = obj.scrollHeight - obj.clientHeight;

		geto('consoleInput').focus();
		geto('consoleInput').style.width = (this.width - geto('consoleAddress').offsetWidth - 30) + 'px';
	};

	//a window-like popup, used only for meta-game features (like game loading)
	this.popup = function(contents) {
		let popup = geto('popup');

		contents = '<input type=\'button\' value=\'X\' onclick=\'render.popupClose();\' style=\'font-size: 32px\'><br>' + contents;
		popup.innerHTML = contents;

		popup.style.display = 'block';
	};

	this.popupClose = function() {geto('popup').style.display = 'none';};



	//ACTIONS
	this.autoResize();
	this.renderConsole();



	//EVENT LISTENERS
	geto('consoleInput').onblur = function() {geto('consoleInput').focus();};
	window.onresize = function() {render.autoResize();};
};
