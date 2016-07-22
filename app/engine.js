/*
Vítejte v hlavním javascriptovém souboru PWN!
*/

//INICIALIZACE PROGRAMU
var state, controller, render, game;
function init() {
	state = new State();
	controller = new Controller();
	render = new Render();
	game = new Game();
};
window.onload = init;

//OBECNÉ VĚCI
function geto(id) {
	return document.getElementById(id);
}

//

function State() {
	this.console = [];
	this.line = "";
	//current commands
	this.commands = [
		{
			cmd: 'test',
			purpose: 'general',
			callback: function(args) {
				controller.log(JSON.stringify(args));
			}
		},
		{
			cmd: 'resize',
			purpose: 'general',
			argCount: 2,
			callback: function(args) {
				render.resize(args[0], args[1]);
			}
		},
		{
			cmd: 'cls',
			purpose: 'general',
			callback: function(args) {
				controller.clear();
			}
		}
	];
	this.commandHistory = [];
	
};


