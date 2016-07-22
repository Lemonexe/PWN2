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
	//current written line (not used yet)
	this.line = '';

	//console history (as it is rendered)
	this.console = [];

	//history of commands as they were entered by user (for autocomplete)
	this.commandHistory = [];
	
	//currently available commands
	this.commands = [
		commands.help,
		commands.cls,
		commands.resize,
		commands.test
	];
};



//	GENERALY USED UTILS

//geto is quite self-explanatory, it serves merely as a shortcut to DOM
function geto(id) {
	return document.getElementById(id);
}

//a thenable function that loads a resource from the server (used to load maps)
/*
ASI TO ALE NEBUDU DĚLAT ASYNCHRONNĚ, ĚTO ZBYTEČNÝ
všechna data budou mít dohromady asi tolik kilobajtů jako jeden obrázek v PWN 1 :-D

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

load('README.md').then(function(data) {
	alert(data);
});
*/
