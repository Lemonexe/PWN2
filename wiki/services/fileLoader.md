# FileLoader
fileLoader.js is a directly defined object with methods concerning loading game data files.

**files** - how many files have been loaded already

**filesLength** - how many files are there to load in total = 4

**init** - the main function. It loads all JSON files and processes them. Also tries to load localStorage save (see [save.js](services/save.md)) and if that fails, it initiates a new game from config.json

**finish** - it is executed upon each successfully loaded file. It checks whether all files are loaded and if so, it executes a final code

**remapGameMap** - it is executed by *finish*, it crawls through game.map and links the items there to their texture objects

**processMap**, **processClasses**, **processTextures** are functions that are used to process files
