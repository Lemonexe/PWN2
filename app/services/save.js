/*
SAVE.JS
	This is a single object with functions concering userdata saving & loading
*/

const save = {
	//prepares the data that should be saved (State (stripped of console tree and address) and Game.state) as JSON
	savePrepare: function() {
		let data = {
			state: Object.assign({}, state),
			gameState: Object.assign({}, game.state)
		};
		delete data.state.tree;
		delete data.state.address;
		return JSON.stringify(data);
	},

	//loaded data is stored into state and game.state, console tree and address are initiated
	loadFinish: function(data) {
		data = JSON.parse(data);
		state = data.state;
		state.tree = new controller.Console('', cmds.select('general'));
		state.address = [];
		game.state = data.gameState;
		controller.log('Game successfully loaded!');
		render.renderConsole();
	},

	//saves the data prepared by savePrepare to localStorage
	saveLocal: function() {
		let data = this.savePrepare();
		localStorage.setItem('savegame', data);
	},

	//loads data from localStorage and executes loadFinish on them
	loadLocal: function() {
		let data = localStorage.getItem('savegame');
		if(data) {
			save.loadFinish(data);
		}
	},

	//deletes the localStorage save
	purgeLocal: function() {
		localStorage.removeItem('savegame');
	},

	//generates a file from the data prepared by savePrepare and offers it for download
	saveFile: function() {
		let data = this.savePrepare();
		let blob = new Blob([data], { type : 'application/json' });
		let url = (window.URL || window.webkitURL).createObjectURL(blob);
		let link = '<a id="download" href="' + url + '" download="savegame.pwn"></a>';

		//let a = document.createElement('a');a.href = url;a.download = 'savegame.pwn';a.click(); MORE ELEGANT, BUT DOESN'T WORK IN FF
		geto('hidden').innerHTML = link;
		geto('download').click();
	},

	//opens the interface for file uploading
	loadFilePopup: function() {
		geto('hidden').innerHTML = '<input type="file" id="upload" onchange="save.loadFileProcess()">';
		geto('upload').click();
	},

	//when the user uploads a file, this function reads it and executes loadFinish on it
	loadFileProcess: function() {
		let file = geto('upload').files[0];
		if(!file) {return;}

		let reader = new FileReader();
		reader.onload = function() {
			save.loadFinish(reader.result)
		};
		reader.readAsText(file);
	},
};
