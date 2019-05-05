/*
MAIN.JS
	This file contains javascript that is specifically related to admin app
	It contains generic & infrastructure functions
	Admin app doesn't have much code overall, so it isn't as tidy as the game app - functions here are mostly global
*/

let time, data, render;

/*
	LISTENERS
*/
window.onload = function() {
	render = new Render(true);
	time = new Time();

	GUI.resize();
	GUI.view('intro');
	
	time.addEvent('FPS', 'interval', 1000/20, function() {GUI.renderFPS();});

	let files = 0;
	let finish = function() {
		files++;
		if(files === 4) {
			GUI.writeConfig(); GUI.writeClasses(); GUI.writeMap(); GUI.writeTextures();
		}
	};

	//either load local storage
	let local = localStorage.getItem('admin');
	if(local && confirm('Local backup detected. Do you want to load it?')) {
		data = JSON.parse(local);
		GUI.writeConfig(); GUI.writeClasses(); GUI.writeMap(); GUI.writeTextures();
	}
	//or load game files
	else {
		data = {};
		JSONload('../data/config.json', function(res) {data.config = res; finish();});
		JSONload('../data/classes.json', function(res) {data.classes = res; finish();});
		JSONload('../data/map.json', function(res) {data.map = res; finish();});
		JSONload('../data/textures.json', function(res) {data.textures = res; finish();});
	}
};

//ctrl+S || cmd+S for saving
window.onkeydown = function(evt) {
	let c = evt.keyCode;
	let ctrl = evt.ctrlKey || evt.metaKey;
	if(ctrl && c === 83) {
		localStorage.setItem('admin', JSON.stringify(data));
		return false;
	}
}



/*
	GENERAL PURPOSE FUNCTIONS
*/
//clearing cookie will log the user out
function logout() {
	if(confirm('Are you sure you want to logout and forfeit all unsaved changes?')) {
		document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
		document.cookie = 'pass=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
		location.href = '';
	}	
}

//geto is quite self-explanatory, it serves merely as a shortcut to DOM
function geto(id) {
	return document.getElementById(id);
}

//this function loads a JSON from server and executes callback on it
function JSONload(url, callback) {
	let xobj = new XMLHttpRequest();
	xobj.open('GET', url, true);
	xobj.overrideMimeType('application/json');
	xobj.send(null);
	xobj.onreadystatechange = function() {
		if(xobj.readyState === 4 && xobj.status === 200) {
			callback(JSON.parse(xobj.responseText));
		}
	};
}

//this function saves data to the server
function AJAXsave() {
	let xobj = new XMLHttpRequest();
	xobj.open('POST', 'save.php', true);
	xobj.setRequestHeader('Content-type', 'application/json');
	xobj.send(JSON.stringify(data));
	xobj.onreadystatechange = function() {
		if(xobj.readyState === 4) {
			if(xobj.status === 200) {
				localStorage.removeItem('admin');
				alert('OK');
			}
			else {
				alert('ERROR: Your changes have been rejected!\nBackup your changes locally and try to log in again.\nSorry...');
			}
		}
	};
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
