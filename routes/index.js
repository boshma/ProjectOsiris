var express = require('express');
var router = express.Router();
const fs = require('node:fs');
const Twilio = require('twilio');

var sqlmanager = require('./sqlmanager.js');

// Main page
router.get('/', function(req, res, next) {
  var datavals = {};

  fs.readFile('data.csv', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    var lines = data.split('\r\n');
  
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].split(',');
      var longitude = line[0];
      var latitude = line[1];
      var risk = parseFloat(line[2]);
      var time = line[3];

      if (datavals[time] === undefined) {
        datavals[time] = [];
      }
      datavals[time].push({ 'longitude': longitude, 'latitude': latitude, 'risk': risk});
    }
    
    console.log(datavals);
    res.render('index', { datavals, title: 'Express' });
  });
});

router.get('/index.ejs', function(req, res, next) {
  res.redirect('/');
});

// // Notification subscriptions
// router.get('/subscribe/:selection/:input/:latitude/:longitude', function(req, res, next) {
//   if (req.params.selection == "email") {
//     (async () => {
//       // Check if email is already in database
//       var query = "SELECT email FROM emails WHERE email='" + req.params.input + "';";
//       var response = await sqlmanager.executeQuery(query);

//       // Not in database, add email and send success response
//       if (response['rows'].length == 0) {
//         // Adds email to database
//         var query = "INSERT INTO emails (email, latitude, longitude) VALUES ('" + req.params.input + "', " + req.params.latitude + ", " + req.params.longitude + ");";
//         sqlmanager.executeQuery(query);
//         res.send(JSON.stringify("Success"));
//       }
//       // Already in database, send failed response (must be run again with override to work)
//       else {
//         res.send(JSON.stringify("Failed"));
//       }
//     })();
//   }
//   else if (req.params.selection == "number") {
//     (async () => {
//       // Check if number is already in database
//       var query = "SELECT phone_number FROM numbers WHERE phone_number='" + req.params.input + "';";
//       var response = await sqlmanager.executeQuery(query);

//       // Not in database, add number and send success response
//       if (response['rows'].length == 0) {
//         // Adds number to database
//         var query = "INSERT INTO numbers (phone_number, latitude, longitude) VALUES (" + req.params.input + ", " + req.params.latitude + ", " + req.params.longitude + ");";
//         sqlmanager.executeQuery(query);
//         res.send(JSON.stringify("Success"));
//       }
//       // Already in database, send failed response (must be run again with override to work)
//       else {
//         res.send(JSON.stringify("Failed"));
//       }
//     })();
//   }
//   else {
//     res.send("Invalid input");
//   }
// });
// // If override is set
// router.get('/subscribe/:selection/:input/:latitude/:longitude/override', function(req, res, next) {
//   if (req.params.selection == "email") {
//     // Adds email to database without checking if it already exists
//     var query = "INSERT INTO emails (email, latitude, longitude) VALUES ('" + req.params.input + "', " + req.params.latitude + ", " + req.params.longitude + ");";
//     sqlmanager.executeQuery(query);
//     res.end(JSON.stringify("Success"));
//   }
//   else if (req.params.selection == "number") {
//     // Adds email to database without checking if it already exists
//     var query = "INSERT INTO numbers (phone_number, latitude, longitude) VALUES (" + req.params.input + ", " + req.params.latitude + ", " + req.params.longitude + ");";
//     sqlmanager.executeQuery(query);
//     res.end(JSON.stringify("Success"));
//   }
//   else {
//     res.send("Invalid input");
//   }
// });

// // Unsubscribe
// router.get('/unsubscribe/:selection/:input', function(req, res, next) {
//   if (req.params.selection == "email") {
//     // Delete email from the database
//     var query = "DELETE FROM emails WHERE email='" + req.params.input + "';";
//     sqlmanager.executeQuery(query);
//     res.send("Success");
//   }
//   else if (req.params.selection == "number") {
//     // Delete number from the database
//     var query = "DELETE FROM numbers WHERE phone_number=" + req.params.input + ";";
//     sqlmanager.executeQuery(query);
//     res.end("Success");
//   }
//   else {
//     res.send("Invalid input");
//   }
// });

// Otherwise
router.get('/:id', function(req, res, next) {
  // If it's the link to a page
  if (isNaN(parseInt(req.params.id))) {
    res.render(req.params.id, { title: 'Express' });
  }
  // If it's a request for data
  else {
    var time = parseInt(req.params.id);

    (async () => {
      try {
        // Gets data from SQL server
        var query = "SELECT latitude, longitude, risk FROM fires WHERE time='" + time + "';"
        var result = await sqlmanager.executeQuery(query);
        var json = JSON.stringify(result['rows']);
  
        // Sends data
        res.send(json);
      }
      catch (error) {
        res.send(error.toString());
      }
    })();
  }
  }
);


// 

module.exports = router;
