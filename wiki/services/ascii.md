# Ascii
fileLoader.js is a directly defined object with methods concerning loading game data files.

**colormap** - colormap that links ANSI SGR to RGB colors

**convert** - a *very* complicated function that converts .ans file (string argument) to HTML (returned as string).
As of now, the convert function creates somewhat opaque images - the text has opaque background *rgb(30,30,30)*. That aslo applies also to spaces in formatted sections - these should be transparent, but are not. Unformatted spaces are, however, transparent.
