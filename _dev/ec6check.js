
try {
	eval('const pole=[1,2];const str =`asdf ${pole[0]}`;for(let item of pole){let arrow=pole.filter(item2 => item2===item);}');
}
catch(err) {
	document.write('<h1>PWN cannot be executed in your internet browser :-(</h1>'
		+ 'Your browser is probably old and doesn\'t support EC6 javascript.<br>'
		+ 'Update your browser in order to play PWN (PWN works in latest Chrome, Firefox or Edge).');
	window.onload = function(){};
}
