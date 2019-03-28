const {app,BrowserWindow,ipcMain} = require("electron")


var knex = require("knex")({
    client: "sqlite3",
    connection : {
        filename : "CAS.sqlite3"
    }
})

app.on("ready", () => {
    let mainWindow = new BrowserWindow ({height:800, width:800, show:false})
    mainWindow.loadURL(`file://${__dirname}/main.html`)
    mainwWindow.once("ready-to-show", () => {mainWindow.show()}) 

    ipcMain.on("mainWindowLoaded",function () {
        let result = knex.select("*").from("transactions")
        result.then((rows) => {
            mainWindow.webContents.send("transactions",rows)
        })
    })
})

app.on("window-all-closed", () => {app.quit() })