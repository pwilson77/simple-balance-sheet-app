const { app, BrowserWindow, ipcMain } = require("electron");

var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./CAS.sqlite"
  },
  useNullAsDefault: true
});

app.on("ready", () => {
  let mainWindow = new BrowserWindow({ height: 800, width: 1280, show: false });
  mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  ipcMain.on("bankWindowLoaded", function(event) {
    knex.select("*").from("banks")
      .then(function(bankrows) {
        event.sender.send("bankNameSent", bankrows);
      })
    knex.select().groupBy("bank_id").whereNotNull("bank_id").sum("amount as total").from("transactions").then(function (amountrow){
        event.sender.send("bankAmountSent",amountrow)
    })
  });

  ipcMain.on("offerWindowLoaded", function(event) {
    knex.select("*").from("offertories")
      .then(function (collections) {
        event.sender.send("offerNameSent",collections)
      })
    knex.select().groupBy("offer_id").whereNotNull("offer_id").sum("amount as total").from("transactions").then(function (collectionsAmount){
      event.sender.send("offerAmountSent",collectionsAmount)
    })
  });

  ipcMain.on("transactionsWindowLoaded", function (event) {
    knex.select("id","name","amount","comment","type","date_created").from("transactions").then(function (transactionsRows) {
      event.sender.send("transactionDetailsSent",transactionsRows)
    })
  })

  ipcMain.on("overview-loaded", function (params) {
    
  })
})

//closing windows
app.on("window-all-closed", () => {
  app.quit();
});

var currentDate = new Date();

var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var year = currentDate.getFullYear();

var dateString = date + "-" +(month + 1) + "-" + year;

// create Bank, Offertory and Transaction object
var Bank = {
  updateBankInfo: function(event,data) {
    knex
      .insert({
        name: data.b_name,
        date_created: dateString,
        user_id: 1
      })
      .into("banks")
      .then(function(id) {
        knex
          .insert({
            amount: data.b_amount,
            comment: "This is the initial amount",
            user_id: 1,
            type: "Bank",
            bank_id: id[0],
            name: data.b_name,
            date_created: dateString
          })
          .into("transactions")
          .then(function() {});
      });
  },
  updateBankTransaction: function(event,data) {
    knex
      .insert({
        amount: data.t_amount,
        comment: data.t_comment,
        user_id: 1,
        type: "Bank",
        bank_id: data.t_bid,
        name: data.b_name,
        date_created: new Date()
      })
      .into("transactions")
      .then(function(id) {});
  },
  deleteBankInfo: function(event, data) {
    console.log(data.t_bid)
    knex("banks")
      .where('id', data.t_bid )
      .del().then(function () {});
    knex("transactions")
      .where('bank_id', data.t_bid )
      .del().then(function () {});
  }
};

var Offertory = {
  updateOfferInfo: function(event, data) {
    knex("offertories")
      .insert({
        name: data.o_name,
        user_id: 1,
        date_created: dateString
      })
      .into("offertories")
      .then(function(id) {
        knex
          .insert({
            amount: data.o_amount,
            comment: "This is the initial amount",
            user_id: 1,
            type: "O&O",
            offer_id: id[0],
            name: data.o_name,
            date_created: dateString
          })
          .into("transactions")
          .then(function(id) {});
      });
  },
  updateOfferTransaction: function(event, data) {
    knex
      .insert({
        amount: data.t_amount,
        comment: data.t_comment,
        user_id: 1,
        type: "O&O",
        offer_id: data.t_oid,
        name: data.o_name,
        date_created: dateString
      })
      .into("transactions")
      .then(function() {});
  },
  deleteOfferTransaction: function(event, data) {
    knex("offertories")
      .where({ id: data.t_oid })
      .del().then( function () {});
    knex("transactions")
      .where({ offer_id: data.t_oid })
      .del().then(function () { });
  }
};

var Transaction = {
  deleteTransaction: function(e, data) {
    console.log(data.t_id)
    knex("transactions").where({ id: data.t_id }).del().then(function () {});
  }
};

// for creating bank-info,updating transactions and deleting transactions from database
ipcMain.on("create-bank-info",Bank.updateBankInfo);

ipcMain.on("update-bank-transaction",Bank.updateBankTransaction);

ipcMain.on("delete-bank-info", Bank.deleteBankInfo);

ipcMain.on("create-offer-info",Offertory.updateOfferInfo);

ipcMain.on("update-offer-transaction",Offertory.updateOfferTransaction);

ipcMain.on("delete-offer-transaction", Offertory.deleteOfferTransaction);

ipcMain.on("delete-transaction",Transaction.deleteTransaction);
