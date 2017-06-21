# Admin app
## Controlling files:
These php scripts commune with the user:

**index.php** handles logging in (done via cookies) and serves user either the frontend (*main.php*), or the logging screen (*login.php*). Authentication data is hardcoded in *index.php*

**save.php** saves changes made by the user

## Content files
These files are stored in the *includes* folder, which should be restricted by server configuration:

**login.php** contains the login screen

**main.php** contains the admin application itself. Also contains *main.js* and some javascript from the game app

**main.js** is javascript file for the admin application, contains functions related to its user interface
