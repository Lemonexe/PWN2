# Save
save.js is a directly defined object with methods concerning saving and loading.

**savePrepare** - prepares the data that should be saved (State (stripped of console tree and address) and Game.state) as JSON

**loadFinish** - evaluates the loaded data and initiates the console

**saveLocal** - saves the data prepared by savePrepare to localStorage

**loadLocal** - loads data from localStorage and executes loadFinish on them

**purgeLocal** - deletes the localStorage save

**saveFile** - generates a file from the data prepared by savePrepare and offers it for download

**loadFilePopup** - opens the interface for file uploading

**loadFileProcess** - when the user uploads a file, this function reads it and executes loadFinish on it
