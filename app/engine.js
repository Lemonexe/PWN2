/*
ENGINE.JS
	Welcome to PWN! This is the main javascript file, which initializes main objects of the game upon window onload.
	It also contains constructor of one of those objects, state, and some utils that are really ubiquitous
*/

//	INITIALIZATION
let state, controller, render, game, time;

function init() {
	time = new Time();
	controller = new Controller();
	state = new State();
	render = new Render();
	game = new Game();

	//load files with game and execute proper code on them
	fileLoader.init();
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

//this function saves data to the server (for statistics)
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
