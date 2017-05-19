// servG4.js 
// Google API server for Sheets (V4) and Gmail (V2)
const http = require('http');
const fs = require('fs'); 
const util = require('util');

var ip;
var url = require('url');
var port = 3000;

var hostname = '';
var hostURL = '';
var HOSTclient = 'https://cdore00.github.io/lou/';
//'http://cdore.no-ip.biz/lou/';
//'https://cdore00.github.io/lou/';
//'http://192.168.2.10/lou/';
// For hyperlink in mails ans user Web pages.

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var urlDB = 'mongodb://localhost:27017/golfDB';
var dBase;

// Use connect method to connect to the server
MongoClient.connect(urlDB, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB server");
	setDbase(db);

  //db.close();
});

function setDbase(db){
	dBase = db;	
		//debugger;
var coll = dBase.collection('club');
  // Find some documents
  coll.find({"_id" : 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    //console.log(docs)
    //callback(docs);
  });
  }

const args = process.argv;
if (args[2] && args[2] == 3000){
	port = args[2];
	hostURL = 'http://cdore.no-ip.biz/nod/';
}else{
	var port = 8080;
	hostURL = 'https://googserv4-goog-server.1d35.starter-us-east-1.openshiftapps.com/';
}
console.log(hostURL + " args[0]=" + args[0] + " args[1]=" + args[1] + " args[2]=" + args[2]);

tl = require('./tools.js');
const Mailer = require('./mailer.js');
//const Mailer = new Mail;

var infoBup = new Array();
var subWeb = '';
var subNod = 'nod/';

// Instantiate Web Server
	const server = http.createServer((req, res) => {
			//debugger;
		var url_parts = url.parse(req.url,true);
		var arrPath = url_parts.pathname.split("/");
		var filePath = arrPath[arrPath.length - 1];
		subWeb = arrPath[arrPath.length - 2] + '/';
console.log(url_parts.pathname);
		if (req.method == 'POST') {
			if (filePath == "listLog"){
				tl.listLog2(req, res, Mailer.pass);
			}else{
			if (filePath == "commPic"){
				sendImage(url_parts.query, req, res);
			}else{
				res.end();
			}}
		}else{  // method == 'GET'
		if (filePath == "getFav"){
			getUserFav(req, res, url_parts.query);
		}else{
		if (filePath == "getRegions"){
			getRegionList(req, res);
		}else{
		if (filePath == "getClubParc"){
			getClubParcours(req, res, url_parts.query);
		}else{
		if (filePath == "getBloc"){
			getBlocList(req, res, url_parts.query);
		}else{
		if (filePath == "getRow"){
			getSheetInfo(req, res);
		}else{
		if (filePath == "app.js"){
			writeToSheet(readQuery(req),req, res);
			}else{ 
				//console.log(url_parts.pathname + " subWeb= " + subWeb + " filePath= " + filePath);
				var param = url_parts.query;
				if (param.code)  // New code received to obtain Token
					getNewCode(req, res, url_parts)
				else{  //Cancel unknow request
					res.statusCode = 200;
					res.end("<h1>Received</h1>");
				}
			}
		}}}}}
		} //Fin GET
	});
// Start server listening request
	server.listen(port, hostname, () => {
		console.log('Server started on port ' + port);
		tl.logFile('Server started on port ' + port);
	});
// END Web Server


// Parse received Request
function readQuery(req, query, img64){
if (query){
	var param = query;
}else{
	var url_parts = url.parse(req.url,true);
	var param = url_parts.query;
	console.log(url_parts.query);
}
var InfoArr = new Array();
var M1 = new Array();
var M3 = new Array();

if (param.L1){
	var M1info = param.L1.split("$"); 
	var M3info = param.L3.split("$");
	M1[M1.length] = M1info[0];
	M3[M3.length] = M3info[0];
}
	if (req.headers['x-forwarded-for']) {
		ip = req.headers['x-forwarded-for'].split(",")[0];
	} else if (req.connection && req.connection.remoteAddress) {
		ip = req.connection.remoteAddress;
	} else {
		ip = req.ip;
	}//console.log("client IP is *********************" + ip);

InfoArr[InfoArr.length] = Date.now();
InfoArr[InfoArr.length] = tl.getDateTime(); 
InfoArr[InfoArr.length] = ip ;	
InfoArr[InfoArr.length] = ((param.nam != null) ? param.nam:"" ) ;
InfoArr[InfoArr.length] = ((param.adr != null) ? param.adr:"" ) ;
InfoArr[InfoArr.length] = ((param.em != null) ? param.em:"" ) ;
InfoArr[InfoArr.length] = ((param.range != null) ? param.range:"" ) ;

//return { InfoArr: InfoArr, m1: M1, m3: M3, m1info: param.L1, m3info: param.L3, photo: img64 };
}

//
function getUserFav(req, res, param){
//var strClub = "";
var arrC = new Array;

var coll = dBase.collection('userFavoris');
  // Find some documents
  coll.find({}, ["CLUB_ID"]).toArray(function(err, docs) {
    assert.equal(err, null);
	    console.log(docs);

for (var i = 0; i < docs.length; i++) {
  //strClub += "," + docs[i].CLUB_ID;
  arrC[arrC.length] = docs[i].CLUB_ID;
}
getClubNameList(res, arrC)

  });	
  	
  
}

function getClubNameList(res, clubList){
//var query = 
var a=clubList[0], b=clubList[1], c=clubList[2], d=clubList[3], e=clubList[4], f=clubList[5], g=clubList[6], h=clubList[7], i=clubList[8], j=clubList[9];
	var coll = dBase.collection('club'); 
coll.find({"_id":{$in:[ a,b,c,d,e,f,g,h,i,j ]}},["_id","nom"]).toArray(function(err, docs) {
//{"CLUB_ID":{$in:[429,424]}} 
    assert.equal(err, null);
returnRes(res, docs);
  });  
}

function returnRes(res, docs){
	
	if (res.data){
		var clubInfo = res.data;
		clubInfo[0].parc = docs;
		docs = clubInfo;
	}
		
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	//	res.setHeader('Access-Control-Allow-Credentials', true);
    res.end(JSON.stringify(docs));
}

function getRegionList(req, res){
	var coll = dBase.collection('regions'); 
coll.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
	returnRes(res, docs);
  });  
}

function getClubParcours(req, res, param){
var clubID = 424;

	var coll = dBase.collection('club'); 
coll.find({"_id": clubID }).toArray(function(err, docs) {
    assert.equal(err, null);
res.data = docs;
addParcours(res, docs, true);
  });  
	
}

function addParcours(res, clubInfo){

var a= clubInfo[0]._id;
	var coll = dBase.collection('parcours'); 
coll.find({"CLUB_ID": a }).toArray( function(err, docs) { 
    assert.equal(err, null);
returnRes(res, docs);
  });  
}

function getBlocList(req, res, param){
var arrBlock = param.data;
arrBlock = arrBlock.split("$");
//debugger;
var a=parseInt(arrBlock[0]), b=parseInt(arrBlock[1]), c=parseInt(arrBlock[2]), d=parseInt(arrBlock[3]), e=parseInt(arrBlock[4]);
	var coll = dBase.collection('blocs'); 
coll.find({"PARCOURS_ID":{$in:[ a,b,c,d,e ]}}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following blocs");
    console.log(docs)
returnRes(res, docs);
  });
	
}