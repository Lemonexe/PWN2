/*
MAIN.JS
	This file contains javascript that is specifically related to admin app.
	Admin app doesn't have much code overall, so it isn't as tidy as tje game app - functions here are mostly global
*/

var time, classes, config, map, textures;

window.onload = function() {
	time = new Time();
	time.addEvent('FPS', 'interval', 1000/20, renderFPS);

	//load game files
	JSONload('../data/classes.json', function(data){classes = data;});
	JSONload('../data/config.json', function(data){config = data;});
	JSONload('../data/map.json', function(data){map = data;});
	JSONload('../data/textures.json', function(data){textures = data;});
};

//clearing cookie will log the user out
function logout() {
	document.cookie = 'user=;pass=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	location.href = '';
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
function AJAXsave(data) {
	let xobj = new XMLHttpRequest();
	xobj.open('POST', 'save.php', true);
	xobj.setRequestHeader('Content-type', 'application/json');
	xobj.send(JSON.stringify(data));
	xobj.onreadystatechange = function() {
		if(xobj.readyState === 4 && xobj.status !== 200) {
			alert('ERROR: Your changes have been rejected!\nBackup your data if there is any and try to log in again.\nSorry...');
		}
	};
}

//preview animations
function renderFPS() {

}
