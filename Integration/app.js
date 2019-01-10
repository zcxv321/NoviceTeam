var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('./db');
var p_in = 0;
var p_out = 0;
var moment = require('moment-timezone');
var fromDatetime = new Date("2014/1/30 11:11:00"); 
fromDatetime=fromDatetime.toDateString()
var datatable = {};
datatable.date=getTimestamp();
datatable.data=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var d = new Date(2018, 11, 24, 10+7, 33, 30);
var dd = new Date(2018, 11, 24, 10+8, 33, 30);
var toDatetime = new Date("10/21/2014 07:59:59");
//console.log(d>dd);
var formatHour = 'HH';
var formatYMD = 'YYYY-MM-DD';
var datee = new Date()
var newTimeHour_old = moment(datee, formatHour).tz("Asia/Bangkok").format(formatHour);
var newTimeYMD_old = moment(datee, formatYMD).tz("Asia/Bangkok").format(formatYMD);


//temp
//team id
//รับข้อมูลลง database
//ทุกอย่างอยู่บน server
var db = mongojs.connect;
var app = express();
app.use(bodyParser.json());

function decodeCayennePayload(payload_hex){
  var start = 0;
  var data = {};
  //var data = JSON.parse(datajson);
  data.Timestamp = getTimestamp();
  var end = payload_hex.length;

  do
  {
    var channel = payload_hex.substring(0,2);
    var dataType = payload_hex.substring(2,4);
    if(dataType=="00"){
      //Digital Input 1 byte
      var value = payload_hex.substring(4,6);
    //  console.log('Digital Input hex: '+value);
      var dec  = hexToInt(value);
   //   console.log('Digital Input dec: '+dec);

      start = 6;
    }
    else if(dataType=="01"){
      // Digital Output
      // 1 byte
      var value = payload_hex.substring(4,6);
   //   console.log('Digital Output hex: '+value);
      var dec  = hexToInt(value);
   //   console.log('Digital Output dec: '+dec);

      start = 6;
    }else if(dataType=="02"){
      //Analog Input
      //2 byte 0.01 Signed
      var value = payload_hex.substring(4,8);
   //   console.log('Analog Input hex : '+value);
      var dec  = hexToInt(value)*0.01;
   //   console.log('Analog Input dec : '+dec);

      start = 8;
    }else if(dataType=="03"){
      //Analog Output
      //2 byte 0.01 Signed
      var value = payload_hex.substring(4,8);
   //   console.log('Analog Output hex : '+value);
      var dec  = hexToInt(value)*0.01;
    //  console.log('Analog Output dec : '+dec);

      start = 8;
    }else if(dataType=="65"){
      //Illuminance Sensor
      //2 byte 1 Lux Unsigned MSB
      var value = payload_hex.substring(4,8);
    //  console.log('Illuminance Sensor hex : '+value);
      var dec  = hexToInt(value);
    //  console.log('Illuminance Sensor dec : '+dec);

      start = 8;
    }else if(dataType=="66"){
      //Presence Sensor 1 byte
      var value = payload_hex.substring(4,6);
     // console.log('Presence Sensor hex : '+value);
      var dec  = hexToInt(value);
    //  console.log('Presence Sensor dec : '+dec);
      

      start = 6;
    }else if(dataType=="67"){
      //Temperature Sensor
      //2 byte 0.1 °C Signed MSB
      var value = payload_hex.substring(4,8);
    //  console.log('Temperature Sensor hex : '+value);
      var dec  = hexToInt(value)*0.1;
      data.Temperature = dec;
   //   console.log('Temperature Sensor dec : '+dec);

      start = 8;
    }else if(dataType=="68"){
      //Humidity Sensor
      //1 byte 0.5 % Unsigned
      var value = payload_hex.substring(4,6);
     // console.log('Humidity Sensor hex: '+value);
      var dec  = hexToInt(value)*0.5;
      //console.log('Humidity Sensor dec: '+dec);
      data.Humidity = dec;

      start = 6;
    }else if(dataType=="71"){
      //Accelerometer
      //6 byte 0.001 G Signed MSB per axis
      var valueX = payload_hex.substring(4,8);
      var valueY = payload_hex.substring(8,12);
      var valueZ = payload_hex.substring(12,16);
      // console.log('Accelerometer X hex: '+valueX);
      // console.log('Accelerometer X hex: '+valueY);
      // console.log('Accelerometer X hex: '+valueZ);


      var decX  = hexToInt(valueX)*0.001;
      var decY  = hexToInt(valueY)*0.001;
      var decZ  = hexToInt(valueZ)*0.001;

      // console.log('Accelerometer X dec: '+decX);
      // console.log('Accelerometer X dec: '+decY);
      // console.log('Accelerometer X dec: '+decZ);

      start = 16;
    }else if(dataType=="73"){
      //Barometer
      //2 byte 0.1 hPa Unsigned MSB
      var value = payload_hex.substring(4,8);
    //  console.log('Barometer hex: '+value);
      var dec  = hexToInt(value)*0.1;
     // console.log('Barometer Dec: '+dec);

      start = 8;
    }else if(dataType=="86"){
      //Gyrometer
      //6 byte 0.01 °/s Signed MSB per axis
      var valueX = payload_hex.substring(4,8);
      var valueY = payload_hex.substring(8,12);
      var valueZ = payload_hex.substring(12,16);
      // console.log('Accelerometer X Hex: '+valueX);
      // console.log('Accelerometer Y Hex: '+valueY);
      // console.log('Accelerometer Z Hex: '+valueZ);

      var decX  = hexToInt(valueX)*0.01;
      var decY  = hexToInt(valueY)*0.01;
      var decZ  = hexToInt(valueZ)*0.01;
      // console.log('Accelerometer X Dec: '+decX);
      // console.log('Accelerometer X Dec: '+decY);
      // console.log('Accelerometer X Dec: '+decZ);

      start = 16;
    }else if(dataType=="88"){
      // GPS Location
      // 9 byte
      // Latitude : 0.0001 ° Signed MSB
      // Longitude : 0.0001 ° Signed MSB
      // Altitude : 0.01 meter Signed MSB
      var valueLatitude = payload_hex.substring(4,10);
      var valueLongitude = payload_hex.substring(10,16);
      var valueAltitude = payload_hex.substring(16,22);
      // console.log('GPS Location Latitude hex : '+valueLatitude);
      // console.log('GPS Location Longitude hex: '+valueLongitude);
      // console.log('GPS Location Altitude hex: '+valueAltitude);

      /*
      var decLatitude  = parseInt(valueLatitude, 16)*0.0001;
      var decLongitude  = parseInt(valueLongitude, 16)*0.0001;
      var decAltitude  = parseInt(valueAltitude, 16)*0.01;
      */
      var decLatitude  = hexToInt(valueLatitude)*0.0001;
      var decLongitude  = hexToInt(valueLongitude)*0.0001;
      var decAltitude  = hexToInt(valueAltitude)*0.01;


      // console.log('GPS Location Latitude dec : '+decLatitude);
      // console.log('GPS Location Longitude dec: '+decLongitude);
      // console.log('GPS Location Altitude dec: '+decAltitude);

      start = 22;

    }else {
      //console.log('Error');
      break;
    }


    payload_hex = payload_hex.substring(start,end);
    start = 0;
    end = payload_hex.length;

  }while(end>1);
  console.log('_____');
  
  return data;
}

function hexToInt(hex) {
  if (hex.length % 2 != 0) {
      hex = "0" + hex;
  }
  var num = parseInt(hex, 16);
  var maxVal = Math.pow(2, hex.length / 2 * 8);
  if (num > maxVal / 2 - 1) {
      num = num - maxVal
  }
  return num;
}
//getTimestamp()

function getTimestamp(req, res)
{
      var datee = new Date();
      var formatf = 'YYYY-MM-DD HH:mm:ss'
      var newTime = moment(datee, formatf).tz("Asia/Bangkok").format(formatf);
      // var useTime = newTime.replace('/', "-")
     // console.log(newTime)
      // console.log(useTime)
     // console.log(fromDatetime)
  return newTime
}


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



  app.post('/SensorData', function (req, res) {
     var json = req.body;
     
     var payload = json.DevEUI_uplink.payload_hex;
     console.log(payload)
    //let payload = "0073277a0167011602687b0371011601160116048601160116011605028324";
    
    var data= decodeCayennePayload(payload)
    // .Timestamp = getTimestamp()
    db.SensorData.insert(data, function (err, docs) {
      console.log(docs);
      res.send(docs);
    });
  })

  app.get('/showSensorData', function (req, res) {
    db.SensorData.find(function (err, docs) {
      console.log(docs);
      res.send(docs);
    });
  })

  app.post('/BeaconData', function (req, res) {
    var json = req.body;
    console.log(json)
    if(json.People == 'enter'){
      p_in ++;
    }
    if(json.People == "leave"){
      p_out ++;
    }

    //console.log(p_in);
    //console.log(p_out)
    var data ={};
    data.Timestamp = getTimestamp()
    data.p_in = p_in
    data.p_out = p_out
    
   var currenttime = getTimestamp()
   currenttime = currenttime.substring(0,10)

   var dataTime = json.timestamp
   dataTime = dataTime.substring(0,10)
   var datahour = json.timestamp
   datahour = datahour.substring(11,13)
   
console.log(newTimeYMD_old,dataTime);
    console.log("DATE",newTimeYMD_old<dataTime)
    if(newTimeYMD_old < dataTime){

      newTimeYMD_old = dataTime
      newTimeHour_old = "00";
      datatable={}
      datatable.data=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      console.log("New DATE",newTimeYMD_old);
      datatable.date = newTimeYMD_old
      //insert database
      db.dataTableBeacon.insert(datatable, function (err, docs) {
        console.log(docs);
        res.send(docs);
    });
     // datatable.date = getTimestamp();
      //สร้างตารางใหม่
    }else{console.log(newTimeHour_old,datahour)
      console.log("TIME",newTimeHour_old<datahour)
      if(newTimeHour_old < datahour){
        newTimeHour_old = datahour
        
        console.log("New Time",newTimeHour_old)
        //datatable.date = getTimestamp();
        if(newTimeHour_old[0] == "0"){
          timehours = newTimeHour_old[1]
        }else{
          timehours = newTimeHour_old
        }
        timehourss = parseInt(newTimeHour_old, 10);
        datatable.data[timehourss] = p_in
        console.log(datatable)
        //update datasbase
        db.dataTableBeacon.update({date:newTimeYMD_old}, {$set:{data:datatable.data}}, function(err, result) {
          if(result != null){
           console.log('Update Done', result);
     res.json(result);
       }
       else{
         console.log("un");
       }
        
 });
        //ใส่ของเข้าไปในช่องที่ n
      }
    
      
    }
    //console.log(datatable)
   // res.send(datatable)
    // db.BeaconData.insert(data, function (err, docs) {
    //   console.log(docs);
       //res.send(docs);
    // });
  })


  app.get('/getdatatable/:id',function(req,res){
    db.dataTableBeacon.find(function (err, docs) {
      var dataarrays=[];
      for( i in docs){
        dataarrays = dataarrays.concat(docs[i].data);
        
        // console.log("doci",docs[i].data)
        // console.log("asd")
      }
     // console.log("dataarrays",dataarrays[1])
      //console.log(docs);
      var enddata=""
      for(var i = dataarrays.length;i>dataarrays.length-req.params.id;i-- ){
        console.log(dataarrays[i-1]);
       // console.log(i)
      
         enddata+=(dataarrays[i-1]+",")
       }
       
      
    
      res.send(enddata);
    });
  });

  app.get('/showBeaconData', function (req, res) {
    db.BeaconData.find(function (err, docs) {
      db.BeaconData.count({},(err, data) => {
        console.log(docs[data-1]);
      res.end( JSON.stringify(docs[data-1]));
})
      
    });
  })
  function savesenser(decodeCayennePayload) {
    
    db.SensorData.insert(decodeCayennePayload, function (err, docs) {
      console.log(docs);
      res.send(docs);
    });
    

    
  }
  

var server = app.listen(8080, function () {
var port = server.address().port

  console.log("Sample Code for RESTful API run at ", port)
})