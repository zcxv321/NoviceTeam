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

function decodeCayennePayload(payload_hex){
  var start = 0;
  var datajson = '{"Temperature":""}';
  var data = JSON.parse(datajson);
  data.Timestamp = getTimestamp();
  var end = payload_hex.length;

  do
  {
    var channel = payload_hex.substring(0,2);
    var dataType = payload_hex.substring(2,4);
    if(dataType=="00"){
      //Digital Input 1 byte
      var value = payload_hex.substring(4,6);
      console.log('Digital Input hex: '+value);
      var dec  = hexToInt(value);
      console.log('Digital Input dec: '+dec);

      start = 6;
    }
    else if(dataType=="01"){
      // Digital Output
      // 1 byte
      var value = payload_hex.substring(4,6);
      console.log('Digital Output hex: '+value);
      var dec  = hexToInt(value);
      console.log('Digital Output dec: '+dec);

      start = 6;
    }else if(dataType=="02"){
      //Analog Input
      //2 byte 0.01 Signed
      var value = payload_hex.substring(4,8);
      console.log('Analog Input hex : '+value);
      var dec  = hexToInt(value)*0.01;
      console.log('Analog Input dec : '+dec);

      start = 8;
    }else if(dataType=="03"){
      //Analog Output
      //2 byte 0.01 Signed
      var value = payload_hex.substring(4,8);
      console.log('Analog Output hex : '+value);
      var dec  = hexToInt(value)*0.01;
      console.log('Analog Output dec : '+dec);

      start = 8;
    }else if(dataType=="65"){
      //Illuminance Sensor
      //2 byte 1 Lux Unsigned MSB
      var value = payload_hex.substring(4,8);
      console.log('Illuminance Sensor hex : '+value);
      var dec  = hexToInt(value);
      console.log('Illuminance Sensor dec : '+dec);

      start = 8;
    }else if(dataType=="66"){
      //Presence Sensor 1 byte
      var value = payload_hex.substring(4,6);
      console.log('Presence Sensor hex : '+value);
      var dec  = hexToInt(value);
      console.log('Presence Sensor dec : '+dec);
      

      start = 6;
    }else if(dataType=="67"){
      //Temperature Sensor
      //2 byte 0.1 °C Signed MSB
      var value = payload_hex.substring(4,8);
      console.log('Temperature Sensor hex : '+value);
      var dec  = hexToInt(value)*0.1;
      data.Temperature = dec;
      console.log('Temperature Sensor dec : '+dec);

      start = 8;
    }else if(dataType=="68"){
      //Humidity Sensor
      //1 byte 0.5 % Unsigned
      var value = payload_hex.substring(4,6);
      console.log('Humidity Sensor hex: '+value);
      var dec  = hexToInt(value)*0.5;
      console.log('Humidity Sensor dec: '+dec);
      data.Humidity = dec;

      start = 6;
    }else if(dataType=="71"){
      //Accelerometer
      //6 byte 0.001 G Signed MSB per axis
      var valueX = payload_hex.substring(4,8);
      var valueY = payload_hex.substring(8,12);
      var valueZ = payload_hex.substring(12,16);
      console.log('Accelerometer X hex: '+valueX);
      console.log('Accelerometer X hex: '+valueY);
      console.log('Accelerometer X hex: '+valueZ);


      var decX  = hexToInt(valueX)*0.001;
      var decY  = hexToInt(valueY)*0.001;
      var decZ  = hexToInt(valueZ)*0.001;

      console.log('Accelerometer X dec: '+decX);
      console.log('Accelerometer X dec: '+decY);
      console.log('Accelerometer X dec: '+decZ);

      start = 16;
    }else if(dataType=="73"){
      //Barometer
      //2 byte 0.1 hPa Unsigned MSB
      var value = payload_hex.substring(4,8);
      console.log('Barometer hex: '+value);
      var dec  = hexToInt(value)*0.1;
      console.log('Barometer Dec: '+dec);

      start = 8;
    }else if(dataType=="86"){
      //Gyrometer
      //6 byte 0.01 °/s Signed MSB per axis
      var valueX = payload_hex.substring(4,8);
      var valueY = payload_hex.substring(8,12);
      var valueZ = payload_hex.substring(12,16);
      console.log('Accelerometer X Hex: '+valueX);
      console.log('Accelerometer Y Hex: '+valueY);
      console.log('Accelerometer Z Hex: '+valueZ);

      var decX  = hexToInt(valueX)*0.01;
      var decY  = hexToInt(valueY)*0.01;
      var decZ  = hexToInt(valueZ)*0.01;
      console.log('Accelerometer X Dec: '+decX);
      console.log('Accelerometer X Dec: '+decY);
      console.log('Accelerometer X Dec: '+decZ);

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
      console.log('GPS Location Latitude hex : '+valueLatitude);
      console.log('GPS Location Longitude hex: '+valueLongitude);
      console.log('GPS Location Altitude hex: '+valueAltitude);

      /*
      var decLatitude  = parseInt(valueLatitude, 16)*0.0001;
      var decLongitude  = parseInt(valueLongitude, 16)*0.0001;
      var decAltitude  = parseInt(valueAltitude, 16)*0.01;
      */
      var decLatitude  = hexToInt(valueLatitude)*0.0001;
      var decLongitude  = hexToInt(valueLongitude)*0.0001;
      var decAltitude  = hexToInt(valueAltitude)*0.01;


      console.log('GPS Location Latitude dec : '+decLatitude);
      console.log('GPS Location Longitude dec: '+decLongitude);
      console.log('GPS Location Altitude dec: '+decAltitude);

      start = 22;

    }else {
      console.log('Error');
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

function getTimestamp(req, res)
{
  var cdate = new Date();
  var day = cdate.getDate();
  var month = cdate.getMonth()+1;
  var year = cdate.getFullYear();
  var hour = cdate.getHours();
  var min = cdate.getMinutes();
  
  var data =year+"-"+month+"-"+day+" "+hour+":"+min
  //console.log(data)
  return data
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



  app.get('/SensorData', function (req, res) {
    // var json = req.body;
    // var payload = json.DevEUI_uplink.payload_hex;
    let payload = "0073277a0167011602687b0371011601160116048601160116011605028324";
    
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
    json.Timestamp = getTimestamp()
    db.BeaconData.insert(json, function (err, docs) {
      console.log(docs);
      res.send(docs);
    });
  })

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