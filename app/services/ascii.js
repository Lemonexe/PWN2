/*
ASCII.JS
	This is a single object with a function that converts ANSI-coded ASCII art to HTML
*/

const ascii = {
	//colormap[brightness][color]
	colormap: [
		//0;30-37
		[
			'rgb(0,0,0)',
			'rgb(171,0,0)',
			'rgb(0,171,0)',
			'rgb(171,87,0)',
			'rgb(0,0,171)',
			'rgb(171,0,171)',
			'rgb(0,171,171)',
			'rgb(171,171,171)'
		],
		//1;30-37
		[
			'rgb(87,87,87)',
			'rgb(255,87,87)',
			'rgb(87,255,87)',
			'rgb(255,255,87)',
			'rgb(87,87,255)',
			'rgb(255,87,255)',
			'rgb(87,255,255)',
			'rgb(255,255,255)'
		]
	],
	charWidth: 8,

	//function that converts string (ANS file) to a HTML string
	convert: function(file) {
		let html = '';
		let last = '';
		let openSpan = false;
		let brightness = 0;
		let color = 7;

		//deletes the sauce, converts both HTML special chars and converts linebreaks to <br>
		file = file
			.replace(/\x1A.*$/, '')
			.replace(/[\n\r]*$/, '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/\r\n|\n|\r/g, '<br>')
			.replace(/ /g, '&nbsp;');

		//while file lasts, we'll eat substrings delimited by CSIs one by one
		while(file.length > 0) {
			let firstEsc = file.search(/\x1B/);

			//no CSI, convert entire file as plaintext
			if(firstEsc === -1) {
				html += file;
				break;
			}

			//CSI at the beginning. Let's find out its meaning
			else if(firstEsc === 0) {
				let CSEnd = file.search(/[^0-9;\[\x1B]/);

				if(openSpan) {
					html += '</span>';
					openSpan = false;
				}

				//CSI means Cursor Forward, so we'll create spaces
				if(file[CSEnd] === 'C') {
					let spaces = file
						.slice(0, CSEnd)
						.match(/\d+/);

					spaces = spaces ? parseInt(spaces[0]) : 0;
					html += '&nbsp;'.repeat(spaces);
					file = file.slice(CSEnd + 1);
				}
				//CSI means Select Graphic Rendition, so we'll do formatting
				else if(file[CSEnd] === 'm') {
					let params = file
						.slice(0, CSEnd)
						.match(/[0-9;]+/);
					
					params = params ? params[0].split(';').map(item => parseInt(item)) : [];
					params.forEach(function(p) {
						if(p === 0) {
							brightness = 0;
							color = 7;
						}
						else if(p === 1) {
							brightness = 1;
						}
						else if(p >= 30 && p <= 37) {
							color = p - 30;
						}
					});
					html += `<span style="color: ${ascii.colormap[brightness][color]};background-color: rgb(30,30,30);">`;
					openSpan = true;
					file = file.slice(CSEnd + 1);
				}
			}

			//CSI is not at the beginning, let's just convert the plaintext to get to it
			else if(firstEsc > 0) {
				html += file.slice(0, firstEsc);
				file = file.slice(firstEsc)
			}

			//failsafe to prevent infinite cycle
			if(file === last) {break;}
			last = file;
		}
		//while feast has ended! Now we'll just add some final touches to the generated html
		if(openSpan) {
			html += '</span>';
			openSpan = false;
		}
		return html;
	}
};
