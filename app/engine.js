/*
ENGINE.JS
	Welcome to PWN! This is the main javascript file, which initializes main objects of the game upon window onload.
	It also contains constructor of one of those objects, state, and some utils that are really ubiquitos
*/

//	INITIALIZATION
var state, controller, render, game;

function init() {
	state = new State();
	controller = new Controller();
	render = new Render();
	game = new Game();
};
window.onload = init;



//	STATE CONSTRUCTOR
function State() {
	//current action (console or map)
	this.current = 'console';

	//current console address
	this.address = [];

	/*
	CONSOLE EXAMPLE:{
		name: 'asdf'	name of the console - part of the address (something like a directory)
		commands: []	commands available for this console
		children: []	array of subconsoles - members of this array are objects exactly like this one!
	}
	*/

	this.tree = {
		name: 'false',
		commands: [
			cmds.help, cmds.cls, cmds.cd, cmds.mk, cmds.history, cmds.log, cmds.resize, cmds.autoresize, cmds.eval//_DEV
		],
		children: []
	};

	//complete console history (as it is rendered)
	this.console = [];

	//history of commands as they were entered by user (for autocomplete)
	this.history = [];
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
		xobj.overrideMimeType("application/json");
		xobj.send(null);
		xobj.onreadystatechange = function() {
			if(xobj.readyState === 4 && xobj.status === 200) {
				resolve(xobj.responseText);
			}
		};
	});
}

//this function searches array of objects and returns the object that contains key: value or false if none found
Array.prototype.getObj = function(key, value) {
	let arr = this;
	arr = arr.filter(item => item[key] === value);
	if(arr.length === 0) {
		return false;
	}
	return arr[0];
};

/*
with this you can test AJAXload...
AJAXload('README.md').then(function(data) {
	alert(data);
});
*/
