/*
GUI.JS
	This file contains javascript that is specifically related to admin app.
	It contains view & controller for editing
*/
let GUI = {
	//switch to a tab
	view: function(what) {
		for(let elem of document.getElementsByClassName('tab')) {
			elem.style.display = (elem.id === what) ? 'block' : 'none';
		};
	},

	//switch to a subtab
	subView: function(what) {
		for(let elem of document.getElementsByClassName('subtab')) {
			elem.style.display = (elem.id === what) ? 'block' : 'none';
		};
	},

	//resize textareas
	resize: function() {
		for(let elem of document.getElementsByTagName('textarea')) {
			elem.style.height = '400px';
			elem.style.width = ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 250) + 'px';
			//alert(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 250));
		}
	},

	//map rendering
	renderFPS: function() {

	},



	/*
		CONFIG
	*/
	writeConfig: function() {
		geto('configInit').value = data.config.init;
		geto('configInit').oninput = function() {data.config.init = this.value;}
	},



	/*
		CLASSES
	*/
	//list all classes
	writeClasses: function() {
		let purpose = geto('classesFilter').value;
		let arr = Object.keys(data.classes);
		let str = '';
		if(purpose) {
			arr = arr.filter(item => (data.classes[item].purposes.indexOf(purpose) > -1))
		}
		for(let item of arr) {
			str += `<a onclick="GUI.writeClass('${item}');">${item}</a><br>`;
		}
		geto('classesList').innerHTML = str;
	},

	//edit a class specified by its identifier
	writeClass: function(key) {
		GUI.currentClass = key;
		geto('classEditTitle').innerHTML = key;
		geto('classTextarea').innerHTML = JSON.stringify(data.classes[key], null, 2);
		GUI.subView('classEdit');
	},

	//collect the currently edited class and try to save it
	parseClass: function() {
		try {
			var obj = JSON.parse(geto('classTextarea').value);
		}
		catch(err) {
			alert('Can\'t save an invalid JSON:\n' + err);
			return;
		}
		data.classes[GUI.currentClass] = obj;
		GUI.writeClasses();
		GUI.subView('classesList');
		alert('OK');
	},

	//delete currently edited class
	deleteClass: function() {
		if(confirm('Do you really want to delete this class?')) {
			delete data.classes[GUI.currentClass];
			GUI.writeClasses();
			GUI.subView('classesList');
		}
	},

	//collects parameters of a new class, initialize it and start editing it
	newClass: function() {
		let name = geto('newClassID').value;
		if(!name) {
			alert('ID is mandatory.');return;
		}
		if(data.classes[name]) {
			alert(`ID ${name} already exists!`);return;
		}

		//initialize object and define properties according to templates
		let obj = {purposes: []};
		['mapObject', 'item', 'mob', 'charClass'].forEach(function(i) {
			if(geto(i).checked) {
				obj.purposes.push(i);
				Object.assign(obj, GUI.classTemplates[i]);
			}
		});
		data.classes[name] = obj;
		GUI.writeClasses();
		GUI.writeClass(name);
	},

	//templates for a new class
	classTemplates: {
		mapObject: {
			obstacle: false,
			onwalk: '',
			onclick: ''
		},
		item: {
			description: '',
			textureName: '',
			onuse: '',
			equipable: false,
		},
		mob: {
			name: ''
		},
		charClass: {
			name: '',
			textureName: ''
		}
	},



	/*
		MAP
	*/
	writeMap: function() {},



	/*
		TEXTURES
	*/
	//list all textures
	writeTextures: function() {
		let str = '';
		for(let item of data.textures) {
			str += `<a onclick="GUI.writeTexture('${item.name}');">${item.name}</a><br>`;
		}
		geto('texturesList').innerHTML = str;
	},

	//edit a texture specified by its name
	writeTexture: function(name) {
		let obj = data.textures.getObj('name', name);
		GUI.currentTexture = obj;

		geto('textureEditTitle').innerHTML = name;
		geto('textureWidth').value = obj.width;
		geto('textureHeight').value = obj.height;
		geto('textureInt').value = obj.int || '';

		let select = geto('textureFrame');
		select.innerHTML = '';
		for(let i = 0; i < obj.ascii.length; i++) {
			let elem = document.createElement('option');
			elem.value = i;
			elem.innerHTML = i;
			select.appendChild(elem);
		}

		GUI.subView('textureEdit');

		let div = geto('texturePreview');
		div.style.height = (obj.height*render.charHeight) + 'px';
		div.style.width = (obj.width*render.charWidth) + 'px';
		div.innerHTML = ascii.convert(render.getASCII(obj));

		//add time event to render the texture. If it is not an animation, the event won't be created at all. But first, the previous event will be deleted
		time.deleteEvent('texturePreviewTimer');
		time.addEvent('texturePreviewTimer', 'interval', obj.int, function() {
			geto('texturePreview').innerHTML = ascii.convert(render.getASCII(GUI.currentTexture));
		});
	},

	applyTexture: function() {

	},

	deleteTexture: function() {

	},

	//initialize a new texture and start editing it
	newTexture: function() {
		let name = prompt('Enter identifier of the new texture to create it:');
		if(!name) {return;}
		if(data.textures.getObj('name', name)) {
			alert(`Texture named ${name} already exists!`);return;
		}
		data.textures.push({name: name, width: 0, height: 0, ascii: ['']});
		GUI.writeTexture(name);
	},

	//upload .ans file
	uploadTexture: function() {
		geto('hidden').innerHTML = '<input type="file" id="upload" onchange="GUI.uploadTextureProcess()">';
		geto('upload').click();
	},

	uploadTextureProcess: function() {
		let file = geto('upload').files[0];
		if(!file) {return;}

		let reader = new FileReader();
		reader.onload = function() {
			save.loadFinish(reader.result)
		};
		reader.readAsText(file);
	}
};
