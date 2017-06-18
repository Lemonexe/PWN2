# FileLoader
fileLoader.js is a directly defined object with methods concerning loading game data files.

**files** - how many files have been loaded already (except the mandatory config.json)

**filesLength** - how many files are there to load in total

**init** - the main function. It loads config.json, extracts information for loading other files, loads those files and processes them

**finish** - it is executed upon each successfully loaded file. It checks whether all files are loaded and if so, it executes a final code

**remapGameMap** - it is executed by *finish*, it crawls through game.map and links the items there to their texture objects

**processMap**, **processClasses**, **processTextures** are functions that are used to process files (in config.json the functions are attributed to files)
