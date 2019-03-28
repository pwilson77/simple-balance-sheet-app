const {ipcRenderer} = require('electron')


ipcRenderer.send("transactionsWindowLoaded")
ipcRenderer.on("transactionDetailsSent", function(evt,  transactionsRows){
    console.log(transactionsRows)
    
    $('#trans').DataTable( {
        data: transactionsRows,
        columns: [
            { "data": "name" },
            { "data": "amount" },
            { "data": "comment" },
            { "data": "type" },
            { "data": "date_created" },
            {"mRender": function (data, type, full, meta) {
                return '<a href="" class="btn btn-dark btn-sm deleteTransaction" tid="' + full.id + '">Delete</a>'
                ;
                }}
           
        
        ],
           

    } );
    
});


$("#trans").click(".deleteTransaction", function deleteTransaction(event) {
    tid =$(event.target).attr("tid")
    data =  { t_id :tid};
    ipcRenderer.send("delete-transaction",data)
})

