const {ipcRenderer} = require('electron')

var app = new Vue({

    el: "#app",

    data: {
        collections: [],
        collectionsAmount:[]

    },

    methods: {

    }
})

$(document).ready(function () {

    $(".addbutton2").click(function(){
        $("#modal2").modal("show");
                oid = $(this).attr("oid");
                oname = $(this).attr("oname");
     });

     $("#offerinfo").on('submit', function () {
        Offertory.updateOfferInfo();
    })

    $(".obutton").click(function () {
        Offertory.updateOfferTransaction();
    })

    $(".cancel2").click(function () {
    oid = $(this).attr("oid"); 
        Offertory.deleteOfferTransaction();
    })
})

var Offertory = {
    updateOfferInfo : function () {
        var oname = $("#oname").val();
         var oamount =$("#oamount").val();
        data = { o_name: oname ,o_amount: oamount}
        
        ipcRenderer.send("create-offer-info",data)
    }, 
    updateOfferTransaction: function () {
        var oamount = $("#tamount").val();
        var ocomment = $("#ocomment").val();
        data = {t_oid : oid, t_amount:oamount, t_comment :ocomment,o_name:oname };
        console.log(data)
        ipcRenderer.send("update-offer-transaction",data)
    },
    deleteOfferTransaction: function () {
        console.log(oid)
        data = {t_oid : oid};

        ipcRenderer.send("delete-offer-transaction",data)
        
    }
}



ipcRenderer.send("offerWindowLoaded")
ipcRenderer.on("offerNameSent", function(evt, collections){
    app.collections =  collections;
    console.log(  collections);
});
ipcRenderer.on("offerAmountSent",function (evt, collectionsAmount) {
    app.collectionsAmount = collectionsAmount;
    console.log(collectionsAmount)
 })
