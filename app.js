/**
 * Mock api for use in development
 */ 
var express = require('express');
var path = require('path');
var url = require('url');

var app = express();

var recording = require('./mockrecording.js');

/**
 * Set static folder
 */
 app.use(express.static(path.join(__dirname, 'dist')));

/*
 * Mock /grid/list request
 */
 app.get('/grid/list', function(req, res){
  var query = getQuery(req);
  var list = [
  {
    _id: "5741bbad9555af960f499766",
    name: "Rotterdam",
    grid_id: "G0001"
  },
  {
    _id: "57e3eebbe4b0e01fc5e5bc33",
    name: "Spangen",
    grid_id: "G0002"
  }
  ];
  console.log(req.url);
  writeJsonp(res,query["callback"],list);
});


/*
 * Mock /grid/list request
 */
 app.get('/recording/list', function(req, res){
  var query = getQuery(req);
  var list = [
  {
    _id: "56ae00b88947dcbe1345ce24",
    description: "recording 1",
    endtime: "12345678",
    grid_id: "G0001",
    recording_id: "R1454244024350",
    starttime: 1454244024
  },
  {
    _id: "56b5fe64689ab95c4df81502",
    description: "recording 2",
    endtime: 1454770510,
    grid_id: "G0001",
    recording_id: "R1454767716450",
    starttime: 1454767716
  },
  {
    _id: "58121f39019c32a433a01bfc",
    description: "recording 3",
    endtime: 1477582655,
    grid_id: "G0001",
    recording_id: "R1477582649558",
    starttime: 1477582649
  },
  {
    _id: "56b7588ff163f51c1da2021a",
    description: "recording 4",
    endtime: null,
    grid_id: "G0001",
    recording_id: "R1454856335270",
    starttime: 1454856335
  }
  ];
  console.log(req.url);
  writeJsonp(res,query["callback"],list);
});

 /*
 * Mock /recording/find request
 */
 app.get('/recording/find', function(req, res){
  var query = getQuery(req);
  console.log(req.url);
  writeJsonp(res,query["callback"],recording);
});


/*
 * Mock /grid/find request
 */
 app.get('/grid/find', function(req, res){
  var query = getQuery(req);
  console.log(req.url);
  writeJsonp(res,query["callback"],query["grid_id"] == "G0001"? grid1 : grid2);
});

/*
 * Mock /play request
 */
 app.get('/play', function(req, res){
  var query = getQuery(req);
  console.log(req.url);
  writeJsonp(res,query["callback"],{ play: "OK" });
});



/**
 * Get array of query parameters from the request
 *
 * @param req
 * @returns {*}
 */
 var getQuery = function (req) {
  var url_parts = url.parse(req.url, true);
  return url_parts.query;
};

/**
 * Write output as jsonp (for app)
 *
 * @param res
 * @param callback
 * @param data
 */
 var writeJsonp = function (res, callback, data) {
  res.writeHead(200, {'Content-Type':'application/javascript'});
  res.end(callback + "(" + JSON.stringify(data) + ")");
};

module.exports = app;

/** DATA **/
grid1 = [{name:"Rotterdam",points:[{note:64,lat:51.92837,lon:4.41509},{note:67,lat:51.92837,lon:4.44777},{note:70,lat:51.92837,lon:4.48046},{note:61,lat:51.92837,lon:4.51314},{note:71,lat:51.91086,lon:4.43145},{note:62,lat:51.91086,lon:4.46413},{note:65,lat:51.91086,lon:4.49682},{note:68,lat:51.91086,lon:4.5295},{note:66,lat:51.89335,lon:4.4478},{note:69,lat:51.89335,lon:4.48048},{note:60,lat:51.89335,lon:4.51317},{note:63,lat:51.89335,lon:4.54585}],size:2250,grid_id:"G0001"}];
grid2 = [{name:"Spangen",size:500,grid_id:"G0002",points:[{note:64,lat:51.9219,lon:4.42344},{note:67,lat:51.923436,lon:4.430284},{note:70,lat:51.924972,lon:4.437128},{note:61,lat:51.926507,lon:4.443973},{note:71,lat:51.919013,lon:4.429019},{note:62,lat:51.920549,lon:4.435862},{note:65,lat:51.922085,lon:4.442706},{note:68,lat:51.92362,lon:4.449551},{note:66,lat:51.916125,lon:4.434597},{note:69,lat:51.917661,lon:4.44144},{note:60,lat:51.919197,lon:4.448283},{note:63,lat:51.920732,lon:4.455127}]}];
  

