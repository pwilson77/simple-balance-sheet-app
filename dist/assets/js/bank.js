const {ipcRenderer} = require('electron')

var app = new Vue({

    el: "#app",

    data: {
        banks: [],
        bankamount:[]

    },

    methods: {

    }
})




$(document).ready(function () {

        
    $("#bankinfo").on('submit', function () {
        Bank.updateBankInfo();
    })

    $(".button2").click(function () {
        Bank.updateBankTransaction();
    })

    $(".addbutton").click(function(){
        tbid = $(this).attr("bid");
        bname = $(this).attr("bname");
        $("#modal2").modal("show");
               
        });


    $(".cancel").click(function () {
        tbid = $(this).attr("bid"); 
        Bank.deleteBankInfo();
    })

})

    
var Bank = {
    updateBankInfo : function () {
         bname = $("#bname").val();
         bamount =$("#bamount").val();
         bankdata = { b_name: bname ,b_amount: bamount};

         ipcRenderer.send("create-bank-info",bankdata)
        },
    updateBankTransaction : function () {
         tamount = $("#tamount").val();
         tcomment = $("#tcomment").val();
         data = {t_bid : tbid, t_amount:tamount, t_comment :tcomment, b_name:bname};
         ipcRenderer.send("update-bank-transaction",data)
    },
    deleteBankInfo : function () {
        data = {t_bid : tbid}
        console.log(data)
        ipcRenderer.send("delete-bank-info",data)
    }
}

ipcRenderer.send("bankWindowLoaded")
ipcRenderer.on("bankNameSent", function(evt,  bankrows){
    app.banks =  bankrows;
    console.log( bankrows);
});
ipcRenderer.on("bankAmountSent",function (evt, amountrow ) {
    app.bankamount = amountrow;
    console.log(amountrow)
 })
