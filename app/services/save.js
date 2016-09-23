/*
SAVE.JS
	This is a single object with functions concering userdata saving & loading
*/
const save = {
	localSave: function() {

	},
	localLoad: function() {

	},
	fileSave: function() {
		let data = {state: state, gameState: game.state};
		data = JSON.stringify(data);
		let blob = new Blob([data], { type : 'application/json' });
		let link = (window.URL || window.webkitURL).createObjectURL(blob);
		render.popup('<a href="' + link + '" download="savegame.pwn" onclick="render.popupClose()">Download!</a>');
	},
	fileLoadPopup: function() {
		let HTML = 'Upload your save file (extension .pwn):<br><input type="file" id="upload" onchange="save.fileLoadProcess()">'
		render.popup(HTML);
		geto('upload').click();
	},
	fileLoadProcess: function() {
		render.popupClose();
		let file = geto('upload').files[0];
		if(!file) {return;}

		let reader = new FileReader();
		reader.onload = (function() {
			let data = JSON.parse(reader.result);
			state = data.state;
			game.state = data.gameState;
			render.renderConsole();
		});
		reader.readAsText(file);
	}
};
//eval save.fileLoadPopup()
//eval save.fileSave()
