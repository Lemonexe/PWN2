# Time

time.js is a constructor for Time object, which unites all timeouts and intervals into one API.

## Properties and methods
**tick** - integer, it's the smallest game tick, set to 10. The reason for this is because 1ms is unnecessarily small...

**time** - upon initiation it's set to 0 and it acts as number of miliseconds since initiation of the app - each *tick* it's incremented by *tick*.

**events** - the array of timeEvent objects (see below)

**timeEvent** - constructor for timeEvent object. Accepts *name*, *type*, *duration*, *callback*. See example below

**interval** - this method is called each tick. It iterates through *events* and, if they are ripe for execution, executes them (and if it's a timeout, it gets deleted)

## TimeEvent example
```javascript
{
	name: 'this is name, so you can easily remove the timeout',
	type: 'timeout' || 'interval', //timeout is one-use only, interval loops forever
	duration: 1200, //in miliseconds
	zero: 0, //Initiation time of this object - if you use the events constructor, this will be filled automatically.
	callback: function() {
		//here comes the executed code
	}
}
```
