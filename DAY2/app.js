var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('./db');
//temp
//team id
//รับข้อมูลลง database
//ทุกอย่างอยู่บน server
var db = mongojs.connect;
var app = express();
app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.send("Sample Code for RESTful API");
})

//Get all user
app.get('/showData', function (req, res) {
  db.temperature.find(function (err, docs) {
    console.log(docs);
    res.send(docs);
  });

})
app.post('/getdataformurl',function(req,res){
  console.log(req.body)
  res.send(req.body)
});
//Get user by ID
// app.get('/user/:id', function (req, res) {
//   var id = req.params.id;
//   console.log(id);
//   db.temperature.findOne({
//     teamID : id
//   }, function (err, dd) {
//     if (dd == null) {
//       console.log(dd);
//       res.send("NULL");
//     } else {
//       console.log(dd)
//       res.send(dd); 
//     }
//   })
// })

//Update user by ID in body
app.put('/editData/:id', function (req, res) {
  var id = req.params.id

  db.temperature.update({teamID:id}, {$set:{temp:req.body.temp}}, function(err, result) {
         if(result != null){
          console.log('Update Done', result);
    res.json(result);
      }
      else{
        console.log("un");
      }
       
});
  // db.temperature.findAndModify({
  //   query: {teamID: id},update: {$inc:{temp:req.body} },new: true}, function (err, docs) {
  //     if(docs != null){
  //        console.log('Update Done', docs);
  //   res.json(docs);
  //     }
  //     else{
  //       console.log("un");
  //     }
   
  // });
})

//Add user
app.post('/addData', function (req, res) {
  var json = req.body;
  db.temperature.insert(json, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });


})

//Delete user by ID
app.delete('/deleteData/:id', function (req, res) {
  var id = req.params.id;
  db.temperature.remove({
    teamID: id
  }, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
})

var server = app.listen(8080, function () {
  var port = server.address().port

  console.log("Sample Code for RESTful API run at ", port)
})