/*
RENDER.JS
	This file contains constructor of the render object
	Render operates DOM to render the game box, console, gamemap
*/

function Render() {
	//this is where width and height is stored (along with the div id="game", of course)
	this.width = 0;
	this.height = 0;

	//size of character in pixels - constant for Courier New @13px. I know, it's absolutely horrendous!
	this.charWidth = 8;
	this.charHeight = 16;

	//this.textures - will be populated later

	//switches view between console and map
	this.switchTab = function(tab) {
		state.tab = tab;

		['console', 'map'].forEach(item => geto(item).style.display = 'none');
		geto(tab).style.display = 'block';

		if(tab === 'console') {
			this.renderConsole();
			geto('consoleInput').focus();
		}
		else if(tab === 'map') {
			this.renderMap();
			geto('consoleInput').blur();
		}
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
		//process arguments and save into this
		width = parseInt(width);
		height = parseInt(height);
		if(isNaN(width) || isNaN(height)) {return;}

		let available = this.getAvailableSize();

		if(width > available[0]) {width = available[0] - 10;}
		if(height > available[1]) {height = available[1] - 10;}

		this.width = width;
		this.height = height;

		//here comes the resizing itself
		geto('game').style.width = width + 'px';
		geto('game').style.height = height + 'px';

		geto('game').style.left = ((available[0] - width)/2) + 'px';
		geto('game').style.top = ((available[1] - height)/2) + 'px';

		geto('console').style.width = (width - 4) + 'px';//padding 2px left & right
		geto('console').style.height = (height - 20) + 'px';//address and input

		geto('map').style.width = width + 'px';
		geto('map').style.height = height + 'px';

		this.renderConsole();
	};

	//this is a master rendering function that is executed with FPS timer
	this.renderFPS = function() {
		if(state.tab === 'map') {
			render.renderMap();
		}
		else {
			render.renderConsoleASCII();
		}
	};

	//this function renders the console: generates the text -> renders it -> scrolls down -> resizes and focuses the input
	this.renderConsole = function() {
		let text = '';

		//generate console output and address
		if(state.console.length !== 0) {
			text += state.console.join('<br>') + '<br>';
		}

		geto('consoleText').innerHTML = text;
		geto('consoleAddress').innerHTML = controller.generateAddress();

		//scroll to the bottom
		let obj = geto('console');
		obj.scrollTop = obj.scrollHeight - obj.clientHeight;

		//focus and resize input (that is dependent on the size of address...)
		if(state.tab === 'console') {geto('consoleInput').focus();}
		geto('consoleInput').style.width = (this.width - geto('consoleAddress').offsetWidth - 30) + 'px';
	};

	//this function generates console ASCII art if there is any
	this.renderConsoleASCII = function() {
		let texture = controller.getConsole().ASCII;
		let consoleASCII = geto('consoleASCII');
		
		if(texture) {
			consoleASCII.innerHTML = render.getASCII(texture);
		}
		else if(consoleASCII.innerHTML !== '') {
			consoleASCII.innerHTML = '';
		}
	};

	//this function finds out where is camera and how big is screen. Then it filters all objects from activeZone that are within screen, adds player and draws them to map using the createASCIIelement function
	this.renderMap = function() {
		//this paragraph aims to enumerate top left corner and bottom right corner of the div id="map", not in pixels but in characters
		let camera = game.camera();
		let width = this.width/this.charWidth;
		let height = this.height/this.charHeight;
		let top = camera.top - height/2;
		let left = camera.left - width/2;
		let bottom = top + height;
		let right = left + width;

		//now we need to prepare a function that creates a div for each item on map, it will be applied later. h,w,gh,gw are just shortcuts
		let h = render.charHeight;
		let w = render.charWidth;
		let gh = Math.round(this.height/2);
		let gw = Math.round(this.width/2);

		let createDIV = function(item) {
			let div = document.createElement('div');

			div.style.position = 'absolute';
			div.style.top = (item.top*h - camera.top*h + gh) + 'px';
			div.style.left = (item.left*w - camera.left*w + gw) + 'px';
			div.style.height = (item.texture.height*h) + 'px';
			div.style.width = (item.texture.width*w) + 'px';
			div.style.zIndex = (typeof item.z === 'number') ? item.z : 1;
			div.innerHTML = render.getASCII(item.texture);
			if(item.class && item.class.onclick) {
				div.onmousedown = item.class.onclick;
			}
			return div;
		};

		//we still need a filtering function that evaluates whether item is at least partially within screen limits
		let squares = function(item) {
			if(!item.texture) {return false;}

			//whether respective edge of the item is within the respective coordinates of camera limits. Doesn't necessarily lie within screen, it can be far away in the other coordinate.
			let topEdge =
				(item.top > top) &&
				(item.top < bottom);
			let leftEdge =
				(item.left > left) &&
				(item.left < right);
			let bottomEdge =
				(item.top + item.texture.height > top) &&
				(item.top + item.texture.height < bottom);
			let rightEdge =
				(item.left + item.texture.width > left) &&
				(item.left + item.texture.width < right);

			//whether the height of the camera is actually inside the height of item. Analogous with width
			let overHeight =
				(item.top <= top) &&
				(item.top + item.texture.height >= bottom);
			let overWidth =
				(item.left <= left) &&
				(item.left + item.texture.width >= right);

			//whether the item is within the height of camera. Top and bottom edges are not necessarily inside, it might be overHeight too. Analogous with width
			let inHeight = topEdge || bottomEdge || overHeight;
			let inWidth = leftEdge || rightEdge || overWidth;

			/*at least one is true -> item will be rendered
				1. topEdge or bottomEdge are within the top and bottom limits of camera AND it the image is at least partially within width of image
				2. analogous
				3. the item is all over the screen (no edges are inside the camera!)
			*/
			let result =
				((topEdge || bottomEdge) && inWidth) ||
				((leftEdge || rightEdge) && inHeight) ||
				(overHeight && overWidth);
			return result;

		};

		//filter objects from game.activeZone using, add player and convert them all
		let renderable = game.activeZone.filter(squares);
		renderable.push(game.state.player);

		//draw renderable elements
		let map = geto('map');
		map.innerHTML = '';
		renderable.forEach(item => map.appendChild(createDIV(item)));
	};

	//this functions handles ascii animations - takes a texture and returns the ascii that is supposed to be drawn right now
	this.getASCII = function(texture) {
		if(typeof texture.ascii === 'string') {
			return texture.ascii;
		}
		else if(typeof texture.ascii === 'object') {
			//index of animation
			return texture.ascii[Math.floor((time.time/texture.int) % texture.ascii.length)];
		}
	};



	//ACTIONS
	this.autoResize();
	this.renderConsole();



	//EVENT LISTENERS
	geto('consoleInput').onblur = function() {
		if(state.tab === 'console') {geto('consoleInput').focus();}
	};
	window.onresize = function() {render.autoResize();};
};
