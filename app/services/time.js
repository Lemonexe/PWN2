/*
TIME.JS
	This is a constructor for time object, which unites all timeouts and intervals into one API
*/

function Time() {
	//smallest time tick (milisecond is unnecessarily small...)
	this.tick = 10;
	window.setInterval(function() {time.interval();}, this.tick);

	//general time in miliseconds (from the initiation)
	this.time = 0;

	/*Timed event EXAMPLE:
	{
		name: 'this is name, so you can easily remove the timeout',
		type: 'timeout' OR 'interval'
		duration: 1200, //in miliseconds
		zero: 0, //Initiation time - if you use the events constructor, this will be filled automatically.
		callback: function() {}
	}
	*/
	this.events = [
		{
			name: 'renderFPS',
			type: 'interval',
			duration: 50,
			zero: 0,
			callback: function() {
				//controller.log('fps');
			}
		}
	];

	//CONSTRUCTOR for timed events. Always use with the 'new' operator!
	this.timeEvent = function (name, type, duration, callback) {
		this.name = name;
		this.type = type;
		this.duration = duration;
		this.zero = time.time;
		this.callback = callback;
	};

	//this function is fired each game tick and iterates through all time events (and execute them)
	this.interval = function() {
		this.time += this.tick;
		let time = this.time;

		this.events = this.events.filter(function(item) {
			if((time - item.zero) % item.duration === 0) {
				item.callback();
				return (item.type !== 'timeout');
			}
			return true;
		});
	};
}
