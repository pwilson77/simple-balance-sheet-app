const {ipcRenderer, webContents} = require('electron')


$(document).ready(function () {

    $(".modal1").click(function(){
        $("#modal1").modal("show");
    });

    $(".addbutton").click(function(){
        $("#modal2").modal("show");
                tbid = $(this).attr("bid");
                bname = $(this).attr("bname");
        });
        
    $("#bankinfo").on('submit', function () {
            Bank.updateBankInfo();
        })

    


//code for creating and updating bank information and transactions
var Bank = {
    updateBankInfo : function (e) {
         bname = $("#bname").val();
          bamount =$("#bamount").val();
         data = { b_name: bname ,b_amount: bamount};

         ipcRenderer.send("create-bank-info",data)
        },
    updateBankTransaction : function (e) {
         tamount = $("#tamount").val();
         tcomment = $("#tcomment").val();
         data ={t_bid : tbid, t_amount:tamount, t_comment :tcomment,b_name:bname};

         ipcRenderer.send("update-bank-transaction",data)
    },
    deleteBankInfo : function (e) {
        tbid = $(this).attr("bid"); 
        data = {t_bid : tbid}
        ipcRenderer.send("delete-bank-info",data)
    }
}


    ipcRenderer.send("bankWindowLoaded")
    ipcRenderer.on("resultSent", function(evt, result){
        let bankName = $("h5.text-center.bankname");
        let bankAmount = $(".bankamount");
        console.log(result);
        for(var i = 0; i < result.length;i++){
            bankName.html(result[i].name.toString() + " bank");
        
        }
    });

})

