 var express = require('express');
 var bodyParser = require('body-parser')
 var fs = require('fs')
 var app = express();
 
 app.use(bodyParser.json());
app.get('/', function (req, res) {  
  res.send("Hello NOVICE")
})

 app.get('/listUsers', function (req, res) {
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     console.log( data );
     res.end( data );
  });
})

// app.get('/showbyID/:id', function (req, res) {
//   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//      var users = JSON.parse( data );
//      var user = users["user" + req.params.id] 
//      console.log( user );
//      res.end( JSON.stringify(user));
//   });
// })

app.post('/addUser', function (req, res) {
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     data = JSON.parse( data );
     data["user5"] = req.body;
     data["user5"].id = 5
     console.log( data );
     res.end( JSON.stringify(data));
  });
})

app.get('/showbyID/:id',function(req,res){
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    var users = JSON.parse(data)

    for(i in users){
      if(users[i].id == req.params.id){
        var asd = users[i];
        console.log(asd)
        res.end( JSON.stringify(asd));
        break;
      }
    }
 });
})
//
  //add multi user
  app.post('/addMultiUser', function(req,res) {

    var be = "user";
    var i = 4;
    // console.log(req)
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    data = JSON.parse( data );
    // data["user5"] = req.body[0];
    // console.log( data );
    var countt = req.body.length;
    // console.log(countt)
    // console.log(req.body[0])
    var n=0;
    for(n=0; n<countt; n++)
    {
      i++;
      istr = i.toString();
      data["user"+istr] = req.body[n];
      data["user"+istr]["id"] = i; 
    }
  
    res.end( JSON.stringify(data));
   });
  })
//
app.delete('/deleteUser/:id', function (req, res) {
  var id = req.params.id
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     data = JSON.parse( data );
     //delete data["user" + id];      
     //console.log( data );

     for(i in data){
      if(data[i].id == req.params.id){
        var asd = data[i];
        delete data[i];  
        console.log(asd)
        res.end( JSON.stringify(data));
        break;
      }
    }
     //res.end( JSON.stringify(data));
  });
})

 var server = app.listen(8080,function(){
  var port = server.address().port

  console.log("Sample Code for RESTful API run at",port)
 });

