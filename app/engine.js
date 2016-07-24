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
	checkEC6();
};
window.onload = init;


//	STATE CONSTRUCTOR
function State() {
	//console history (as it is rendered)
	this.console = [];

	//history of commands as they were entered by user (for autocomplete)
	this.commandHistory = [];
	
	//currently available commands
	this.commands = [
		cmds.help,
		cmds.cls,
		cmds.resize,cmds.autoresize,
		cmds.say
	];
};



//	GENERALY USED UTILS

//geto is quite self-explanatory, it serves merely as a shortcut to DOM
function geto(id) {
	return document.getElementById(id);
}

//a thenable function that loads a resource from the server (used to load maps)
function load(url) {
	return new Promise(function(resolve, reject) {
		//aculy does nothing
		var xobj = new XMLHttpRequest();
		xobj.open('GET',url,true);
		xobj.overrideMimeType("application/json");
		xobj.send(null);
		xobj.onreadystatechange = function(){
			if(xobj.readyState==4 && xobj.status==200){
				resolve(xhttp.responseText);
			}};
	});
}

/*
load('README.md').then(function(data) {
	alert(data);
});
*/

//this function tests the browser for EC6 features and in overwrites the whole page with error in case of failure
function checkEC6() {
	try {
		eval('const pole=[1,2];for(let item of pole){let arrow=pole.filter(item2 => item2===item);}');
	}
	catch(err) {
		document.body.innerHTML = '<h1>PWN cannot be executed in your internet browser :-(</h1>'
			+ 'Your browser is probably old and doesn\'t support EC6 javascript.<br>'
			+ 'Update your browser in order to play PWN (PWN works in latest Chrome, Firefox or Edge).';
	}
}
