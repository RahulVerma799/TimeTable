var mysql = require('mysql2');
var connection = mysql.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12744994',
  password : 'mp2gUUZdPp',
  database : 'sql12744994',
  multipleStatements: true

});

connection.connect((err)=>{
  if(!err)
  {
    console.log("connected");
  }else{
    console.log("Connection Failed");
  }

});
module.exports = connection;