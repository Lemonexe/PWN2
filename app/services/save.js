/*
SAVE.JS
	This is a single object with functions concering userdata saving & loading
*/

const save = {
	savePrepare: function() {
		let data = {
			state: Object.assign({}, state),
			gameState: Object.assign({}, game.state)
		};
		delete data.state.tree;
		delete data.state.address;
		return JSON.stringify(data);
	},
	loadFinish: function(data) {
		data = JSON.parse(data);
		state = data.state;
		state.tree = new controller.Console('', cmds.select('general'));
		state.address = [];
		game.state = data.gameState;
		controller.log('Game successfully loaded!');
		render.renderConsole();
	},
	saveLocal: function() {
		let data = this.savePrepare();
		localStorage.setItem('savegame', data);
	},
	loadLocal: function() {
		let data = localStorage.getItem('savegame');
		if(data) {
			save.loadFinish(data);
		}
	},
	purgeLocal: function() {
		localStorage.removeItem('savegame');
	},
	saveFile: function() {
		let data = this.savePrepare();
		let blob = new Blob([data], { type : 'application/json' });
		let url = (window.URL || window.webkitURL).createObjectURL(blob);
		let link = '<a id="download" href="' + url + '" download="savegame.pwn"></a>';

		//let a = document.createElement('a');a.href = url;a.download = 'savegame.pwn';a.click(); MORE ELEGANT, BUT DOESN'T WORK IN FF
		geto('hidden').innerHTML = link;
		geto('download').click();
	},
	loadFilePopup: function() {
		let form = 'Upload your save file (extension .pwn):<br><input type="file" id="upload" onchange="save.loadFileProcess()">'
		geto('hidden').innerHTML = form;
		geto('upload').click();
	},
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
