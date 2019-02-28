var express = require('express');
var router  = express.Router();
var http    = require('http');
var layout  = require('layout.json');
var emptypercents  = require('emptypercents.json');
var halfpercents  = require('halfpercents.json');
var fullpercents  = require('fullpercents.json');
var fakereserves  = require('fakereserves.json');
var b220 = require('b220.json');
var b230 = require('b230.json');
var b240 = require('b240.json');
var b250 = require('b250.json');
var b260 = require('b260.json');
var b270 = require('b270.json');

/* Method Name: readFromAPI
 * Parameters:
 *  options -- object which holds the path name of the api
 *  res -- where to put the parsed results to
 * Return: void
*/
var readFromAPI = function(options,res){
  http.get(options, function(resp){
    console.log('response : ' + resp.statusCode);
    var body = "";
    resp.on('data', function(data){
      body += data;
    });
    resp.on('end', function(){
      body = body.replace(/\},\{/g, ',');
      body = body.replace(/\[\{/g, '{');
      body = body.replace(/\}\]/g, '}');
      body = body.replace(/-/g, '_');
      res.json(JSON.parse(body));
    });
  }).on('error', function(e){
    console.log('error : ' + e.message);
  });
};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* URL: /percents
 * url parameters:
 *  None
 * Reads: http://qt.ucsd.edu/cse120/getPercentages.php
 * Returns: {"EBU3B B220":{"free_space":"27","total_space":"30"},
 *           "EBU3B B230":{"free_space":"13","total_space":"42"}...
 *          }
*/
router.get('/percents', function(req, res, next){
    options = {
      host: 'qt.ucsd.edu',
      port: 80,
      path: '/cse120/getPercentages.php',
    };
    readFromAPI(options,res);
});

/* URL: /layout/:labname
 * url parameters:
 *  labname: labname
 *    ex: EBU3B B230
 * Reads: layout.json
 * Returns:{"length":"8",
            "width":"8",  
            "computers":{ 
              "1":{
                "x":"6",
                "y":"0"},
              "2":{
                "x":"6",
                "y":"1"},...}
           }
*/
router.get('/layout/:labname', function(req, res, next){
  res.json(layout[req.params.labname]);
});

/* URL: /computers/:labname
 * url parameters:
 *  labname: labname
 *    ex: B230
 * Reads: //http://qt.ucsd.edu/cse120/getMap.php?lab_name=EBU3B%20<labname>
 * Returns:{"ACS_CSEB220_01":{  
 *            "state":"OPEN",
 *            "os":"Windows"},
 *          "ACS_CSEB220_02":{
 *            "state":"IN USE",
 *            "os":"Windows"}}
*/
router.get('/computers/:labname', function(req, res, next){
  options = {
    host : 'qt.ucsd.edu',
    port : 80,
    path : '/cse120/getMap.php?lab%20name=' + req.params.labname.replace(" ","%20")
  };
  readFromAPI(options,res);
});

/* URL: /reservations
 * url parameters:
 *  None
 * Reads: http://www.google.com/calendar/feeds/2n9d5sl0jcmkgaclqd2dp5ea5c@group.calendar.google.com/public/basic?alt=jsonc
 * Returns:{"EBU3B B220":{
 *            "title": "CSE 110",
 *            "start": TODO,
 *            "end": TODO},...
 *         }
*/
router.get('/reservations', function(req, res, next){
  options = {
    host : 'www.google.com',
    port : '80',
    path : '/calendar/feeds/2n9d5sl0jcmkgaclqd2dp5ea5c@group.calendar.google.com/public/basic?alt=jsonc'
  };

  http.get(options, function(resp){
    console.log('response : ' + resp.statusCode);
    var body = "";
    resp.on('data', function(data){
      body += data;
    });
    resp.on('end', function(){
      var reservations = JSON.parse(body).data.items;
      var parsedData = {};
      for ( var i = 0 ; i < reservations.length; i++){
        var details = reservations[i].details.split("\n");
        var recurring = (details[0].indexOf("Recurring") != -1 );
        if (recurring){
          var startTime = new Date(details[1].substring(13));
          var duration = parseInt(details[3].substring(10));
          var endTime = new Date(startTime.getTime() + duration*1000);

          var occurrences = 0;
          if(details[8] != null){
            occurrences = parseInt(details[8].substring(25));
          }
          var now = new Date();
          var oneWeek = 604800000;
          if (!(now.getTime() < startTime.getTime()) &&
            !(now.getTime > (endTime.getTime() + occurrences*oneWeek))){
            while(now.getTime() > endTime.getTime()){
              startTime = new Date(startTime.getTime() + oneWeek);
              endTime = new Date(startTime.getTime() + duration*1000);
            }

            if (now.getTime() > startTime.getTime() && now.getTime() < endTime.getTime()){
              var reserved = true;
              var labname = details[6].substring(13);
              parsedData[labname] = {};
              parsedData[labname].title = reservations[i].title;
              parsedData[labname].start = startTime.getTime();
              parsedData[labname].end = endTime.getTime();
            }
            else{
            }
          }
          else{
          }
        }
        else{
          /* IN PROGRESS */
        }
      }
      res.json(parsedData);
    });
  }).on('error', function(e){
    console.log('error : ' + e.message);
  });
});

/***** FOR TESTING *****
 * URL: /fake/percents/:style
 * url parameters:
 *  String style -- full, empty, or half
 * Reads: fullpercents.json, emptypercents.json, or halfpercents.json
 * Returns: {"EBU3B B220":{"free_space":"27","total_space":"30"},
 *           "EBU3B B230":{"free_space":"13","total_space":"42"}...
 *          }
*/
router.get('/fake/percents/:style', function(req, res, next){
  if (req.params.style === "full"){
    res.json(fullpercents);
  }
  else if (req.params.style === "empty"){
    res.json(emptypercents);
  }
  else if (req.params.style === "half"){
    res.json(halfpercents);
  }
});

/***** FOR TESTING *****
 * URL: /fake/computers/:labname/:taken/:broken
 * url parameters:
 *  labname: labname
 *    ex: EBU3B B230
 *  taken: true or false
 *  broken: true or false
 * Reads: b220.json, b230.json, b240.json, b250.json, b260.json, or b270.json
 * Returns:{"ACS-CSEB220-01":{  
 *            "state":"OPEN",
 *            "os":"Windows"},
 *          "ACS-CSEB220-02":{
 *            "state":"IN USE",
 *            "os":"Windows"}}
*/
router.get('/fake/computers/:labname/:taken/:broken', function(req, res, next){
  var json;
  if (req.params.labname === "EBU3B B220"){
    json = b220;
  }
  else if (req.params.labname === "EBU3B B230"){
    json = b230;
  }
  else if (req.params.labname === "EBU3B B240"){
    json = b240;
  }
  else if (req.params.labname === "EBU3B B250"){
    json = b250;
  }
  else if (req.params.labname === "EBU3B B260"){
    json = b260;
  }
  else if (req.params.labname === "EBU3B B270"){
    json = b270;
  }
  if (req.params.taken === "true"){
    json['ACS-CSE'+req.params.labname.split(" ").pop()+'-12']['state'] = "IN USE";
  }
  else{
    json['ACS-CSE'+req.params.labname.split(" ").pop()+'-12']['state'] = "OPEN";
  }
  if (req.params.broken === "true"){
    json['ACS-CSE'+req.params.labname.split(" ").pop()+'-14']['state'] = "IN REPAIR";
  }
  else{
    json['ACS-CSE'+req.params.labname.split(" ").pop()+'-14']['state'] = "OPEN";
  }
  res.json(json);
});

/***** FOR TESTING *****
 * URL: /fake/reservations
 * url parameters:
 *  None
 * Reads: fakreserves.json
 * Returns:{"EBU3B B220":{
 *            "title": "CSE 110",
 *            "start": TODO,
 *            "end": TODO},...
 *         }
*/
router.get('/fake/reservations', function(req, res, next){
    res.json(fakereserves);
});

module.exports = router;
