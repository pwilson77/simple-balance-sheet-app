const {ipcRenderer} = require('electron')

ipcRenderer.send("overview-loaded")
ipcRenderer.on("overviewbankdata-loaded", function () {
	
})
ipcRenderer.on("overviewoffer-loaded", function () {
	
})

  


	