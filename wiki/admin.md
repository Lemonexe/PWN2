# Admin app
## Controlling files
These php scripts commune with the user:

**admin.php** is the page itself.
Handles logging in (done via cookies) and serves user either the frontend (*main.php*), or the logging screen (*login.php*).

**auth.php** handles the first login (via logging screen) - either sets cookie or displays error

**save.php** saves changes made by the user (if authorized)

## Content files
These files are stored in the *includes* folder, which should be restricted by server configuration:

**users.php** - authentication data is hardcoded here

**login.php** contains the login screen

**main.php** contains the admin application itself. Also contains *main.js* and some javascript from the game app

**Javascript files** for the admin application - access to them is restricted to authorized users, which isn't really necessary, but why not...
- **main.js** contains generic functions, infrastructure
- **gui.js** contains view and controller (for editing itself)
