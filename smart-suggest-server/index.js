const express =  require("express");
const mysql = require("mysql");
const app = express();

app.get('/', function(req, res){
    res.send('Hey there!');
});

app.listen(3001, function() {
    console.log("Server runnning on port 3001");
});