# Commands
commands.js is a directly defined object that contains all commands and functions that operate them.

## Methods

**select** - gets commands from this object. Without parameters it gets all commands. If you supply an array of tags, it returns all commands that have all those tags

## Commands
Here is an example of command with all obligatory properties:

```javascript
key: {
	command: 'command_keyword',//this is the invoking code. LOWER CASE!!!
	tags: ['tag1', 'tag2'],
	description: 'Here goes the description of the command (used in help).',
	callback: function() {
		//here comes the executed code
	}
}
```

The identifier (key) doesn't have to agree with command. It is just an ID, a reference of the command... The property 'command' mustn't contain any whitespace characters, or it won't be possible to invoke it!

The command can also have property *arg*, which can be:
- undefined (as seen above), the parameter is interpreted as a string and is as such passed to the callback function
- 'string' - same as undefined, but the parameter is mandatory - it's not possible to invoke the command with an empty parameter
- 'array' - parameter is interpreted as an array (any number of whitespaces acts as separator).

If you choose to create a command with array argument, you can add a property 'argCount', whose value is an integer and means that you have to supply precisely that many arguments

### Tag list
- **general**: commands that are available in the root directory
- **dev**: for development only
