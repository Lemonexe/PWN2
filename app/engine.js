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
	//currently focused tab (console, map or popup). Used in rendering
	this.tab = 'console';

	//current console address
	this.address = [];

	/*
	CONSOLE EXAMPLE: {
		name: 'asdf'	name of the console - part of the address (something like a directory)
		commands: []	commands available for this console
		children: []	array of subconsoles - members of this array are objects exactly like this one!
	}
	*/

	this.tree = {
		name: '',
		commands: cmds.select(),
		children: []
	};

	//complete console history (as it is rendered)
	this.console = [];

	//history of commands as they were entered by user (mostly for autocomplete)
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
		xobj.overrideMimeType('application/json');
		xobj.send(null);
		xobj.onreadystatechange = function() {
			if(xobj.readyState === 4 && xobj.status === 200) {
				resolve(xobj.responseText);
			}
		};
	});
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
EVERYTHING BELOW IS A TEMPORARY EXPERIMENT. Working experiments shouldn't be commited to github...
*/

/*
Example how to load a JSON
JSONload('data/testdata.json', function(result) {
	alert(result.someString);
});
*/

/*
window.setTimeout(function() {
	geto('hidden').innerHTML = '<iframe src="p.pwn"></iframe>';
}, 10);
*/
