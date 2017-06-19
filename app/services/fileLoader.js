/*
FILELOADER.JS
	This is a single object with functions concering loading of game data
*/

var fileLoader = {
	//files loaded yet, number of all files to be loaded
	files: 0,
	filesLength: 0,

	//start loading files by reading config.json (a mandatory file!), interpret and store the gameInitCode and load all files listed in config.json
	init: function() {
		JSONload('data/config.json', function(data) {
			fileLoader.gameInitCode = new Function(data.init);
			fileLoader.filesLength = data.files.length;

			for(let f of data.files) {
				JSONload(f.url, function(data) {
					if(f.method && fileLoader.hasOwnProperty(f.method)) {
						fileLoader[f.method](data);
					}
					fileLoader.files++;
					fileLoader.finish();
				});
			}
		});
	},

	//checks whether all files are loaded and if so, finishes the loading process
	finish: function() {
		if(this.files === this.filesLength) {
			this.remapGameMap();
			this.gameInitCode();
			time.addEvent('FPS', 'interval', 1000/20, function() {render.renderFPS();});
		}
	},

	//some rework on game.map - instead of texture names there will be a reference to texture object & reference to class object instead of class name
	remapGameMap: function() {
		Object.keys(game.map).forEach(function(key) {
			game.map[key].forEach(function(mapObj) {
				if(mapObj.texture) {
					let ref = render.textures.getObj('name', mapObj.texture);
					mapObj.texture = ref ? ref : false;
				}
				if(mapObj.class) {
					let ref = game.classes[mapObj.class];
					mapObj.class = ref ? ref : false;
				}
			});
		});
		
		//player object
		let ref = render.textures.getObj('name', game.state.player.texture);
		game.state.player.texture = ref ? ref : false;
	},

	//processing map is simple
	processMap: function(data) {game.map = data;},

	//processing classes means converting onwalk strings to functions
	processClasses: function(data) {
		Object.keys(data).forEach(function(key) {
			if(data[key].onwalk) {
				data[key].onwalk = new Function(data[key].onwalk);
			}
			if(data[key].onclick) {
				data[key].onclick = new Function(data[key].onclick);
			}
		});
		game.classes = data;
	},

	//processing textures means converting strings with .ans files to HTML strings, using the ascii.convert
	processTextures: function(data) {
		for(let d of data) {
			if(typeof d.ascii === 'string') {
				d.ascii = ascii.convert(d.ascii);
			}
			else if(typeof d.ascii === 'object') {
				d.ascii = d.ascii.map(item => ascii.convert(item));
			}
		}
		render.textures = data;
	}
};
