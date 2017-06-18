/*
ENGINE.JS
	Welcome to PWN! This is the main javascript file, which initializes main objects of the game upon window onload.
	It also contains constructor of one of those objects, state, and some utils that are really ubiquitous
*/

//	INITIALIZATION
var state, controller, render, game, time;

function init() {
	time = new Time();
	controller = new Controller();
	state = new State();
	render = new Render();
	game = new Game();
	save.loadLocal();

	loadGameFiles();
	
	//---DEVELOPMENT---
	controller.addCmdsByTags('dev');
	render.switchTab('console');
};
window.onload = init;



//	STATE CONSTRUCTOR
function State() {
	//currently focused tab (console or map). Used in rendering
	this.tab = 'console';

	//current console address
	this.address = [];

	//tree of consoles - like a directory tree. See controller.Console for details
	this.tree = new controller.Console('', cmds.select('general'));

	//complete console history (as it is rendered)
	this.console = [];

	//history of commands as they were entered by user (mostly for autocomplete)
	this.history = [];

	//options, they are stored as identifier: {value: anything, description: 'this option lets you lorem ipsum'}
	this.options = {};
};



//LOAD GAME FILES, TEMPORARY CODE
//Object.assign(target, ...sources) to merge objects
function loadGameFiles() {
	let files = 0;
	let filesLength = 2;
	let finish = function() {
		if(files === filesLength) {
			controller.log('All data files are loaded!');
			time.addEvent('FPS', 'interval', 1000/20, function() {if(state.tab === 'map') {render.renderMap();}});

			//some rework on game.map - instead of texture names there will be a reference to texture object.
			Object.keys(game.map).forEach(function(key) {
				game.map[key].forEach(function(mapObj) {
					if(mapObj.texture) {
						let ref = render.textures.getObj('name', mapObj.texture);
						mapObj.texture = ref ? ref : false;
					}
				});
			});
			
			//player object
			let ref = render.textures.getObj('name', game.state.player.texture);
			game.state.player.texture = ref ? ref : false;
		}
	}
	JSONload('data/textures.json', function(data) {
		for(let d of data) {
			if(typeof d.ascii === 'string') {
				d.ascii = ascii.convert(d.ascii);
			}
			else {
				d.ascii = d.ascii.map(item => ascii.convert(item));
			}
		}
		render.textures = data;
		files++;
		finish();
	});
	JSONload('data/map.json', function(data) {
		game.map = data;
		game.activeZone = data['test-level'];
		files++;
		finish();
	});
}



//	GENERALY USED UTILS

//geto is quite self-explanatory, it serves merely as a shortcut to DOM
function geto(id) {
	return document.getElementById(id);
}

//a thenable function that loads a resource from the server (used to load maps)
function AJAXload(url) {
	return new Promise(function(resolve) {
		let xobj = new XMLHttpRequest();
		xobj.open('GET', url, true);
		xobj.overrideMimeType('application/json');
		xobj.send(null);
		xobj.onreadystatechange = function() {
			if(xobj.readyState === 4 && xobj.status === 200) {
				resolve(xobj.responseText);
			}
		};
	});
}

//a thenable function that saves data to the server (for statistics)
function AJAXsave(url, data) {
	let xobj = new XMLHttpRequest();
	xobj.open('POST', url, true);
	xobj.setRequestHeader('Content-type', 'application/json');
	xobj.send(JSON.stringify(data));
}

//superstructure above AJAXload - this function loads a JSON and executes callback function on it, given the parsed object as an argument
function JSONload(url, callback) {
	AJAXload(url).then(function(result) {
		result = JSON.parse(result);
		callback(result);
	});
}

//an Array method - it searches array of objects and returns the object that contains the requested key: value, or false if none such found
Object.defineProperty(Array.prototype, 'getObj', {
    enumerable: false,
    value: function(key, value) {
		let arr = this
			.filter(item => typeof item === 'object')
			.filter(item => item[key] === value);
		if(arr.length === 0) {
			return false;
		}
		return arr[0];
	}
});

/*
EVERYTHING BELOW IS A TEMPORARY EXPERIMENT.
When you're committing, comment them!
Working experiments shouldn't be committed to github...
*/

/*
Example how to load a JSON
JSONload('data/testdata.json', function(result) {
	alert(result.someString);
});
*/
