// servG4.js 
// Google API server for Sheets (V4) and Gmail (V2)
const http = require('http');
const fs = require('fs'); 
const url = require('url');

var ip;

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectId = require('mongodb').ObjectId;

// Connection URL
//var urlDB = 'mongodb://localhost:27017/golfDB';
var urlDB = 'mongodb://localhost:27017/golf';
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
    //console.log("Found the following records");
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


const Mailer = require('./mailer.js');
//const Mailer = new Mail;
tl = require('./tools.js');
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
			switch (filePath) {
			  case "identUser":
				authUser(req, res, url_parts.query);
				break;
			  case "getFav":
				getUserFav(req, res, url_parts.query);
				break;
			  case "updateFav":
				updateFav(req, res, url_parts.query);
				break;
			  case "getRegions":
				getRegionList(req, res);
				break;
			  case "getClubParc":
				getClubParcours(req, res, url_parts.query);
				break;
			  case "getBloc":
				getBlocList(req, res, url_parts.query);
				break;
			  case "getClubList":
				getClubList(req, res, url_parts.query);  //À réutiliser
				break;
			  case "getGolfGPS":
				getGolfGPS(req, res, url_parts.query);
				break;
			  case "searchResult":
				searchResult(req, res, url_parts.query);
				break;				
			  case "load":
				loadF(req, res, url_parts.query);
				break;					
			  case "proc":
				execProc(req, res, url_parts.query);
				break;	
			  case "delTable":
				deleteColl(req, res, url_parts.query);
				break;		
			  case "getGame":
				getGame(req, res, url_parts.query);
				break;
			  case "getGameTab":
				getGameTab(req, res, url_parts.query);
				break;
			  case "updateGame":
				updateGame(req, res, url_parts.query);
				break;
			  case "endDelGame":
				endDelGame(req, res, url_parts.query);
				break;	
			  case "addUserIdent":
				addUserIdent(req, res, url_parts.query);
				break;	
			  case "getGameList":
				getGameList(req, res, url_parts.query);
				break;		
			  case "countUserGame":
				countUserGame(req, res, url_parts.query);
				break;
				
			  default:
				var param = url_parts.query;
				if (param.code)  // New code received to obtain Token
					getNewCode(req, res, url_parts)
				else{  //Cancel unknow request
					res.statusCode = 200;
					res.end("<h1>Received DB</h1>");
				}
			}		

		} //Fin GET
	});
	
	
	
// Start server listening request
	server.listen(port, ip, () => {
		console.log('Server started on port ' + port);
		tl.logFile('Server started on port ' + port);
	});
// END Web Server



//

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

function logErreur(mess){
	tl.logFile(mess);
}

function addUserIdent(req, res, param){
var request = (decodeURI(param.data));
var data = request.split("$");
var user = (data[0]);
var email = (data[1]);
var pass = (data[2]);

var coll = dBase.collection('users'); 
  coll.insertOne({"Nom": user , "courriel": email, "motpass": pass , "niveau": "MEM", "actif": true}, {new:true}, function(err, doc) {
	  		debugger;
	if (err){
		returnRes(res, err);
		console.log(err);
	}else{
		returnRes(res, doc.ops);

		console.log(doc.ops);
	}
  });
}


function countUserGame(req, res, param){
var request = (decodeURI(param.data));
var data = request.split("$");
var user = parseInt(data[0]);
var is18 = parseInt(data[1]);

var coll = dBase.collection('score'); 
var tot = coll.find({USER_ID: user}).count();


if (is18 == 18){
	coll.find({USER_ID: user, T18: { $exists: true, $nin: [ 0 ] }}).count( function(err, count){ 

		returnRes(res, count);	
	});
}else{
	//coll.find({USER_ID: user, T18: { $exists: false, $nin: [ 0 ] }, {$or:[{T18:0}]} }).count( function(err, count){ 
	 coll.find({USER_ID: user, $or:[{T18:0},{T18:null}]  } ).count(function(err, count){ 
		returnRes(res, count);	
	});
}
};

function getGameList(req, res, param){
var request = (decodeURI(param.data));
var data = request.split("$");
var user = parseInt(data[0]);
var skip = parseInt(data[1]);
var limit = parseInt(data[2]);
var is18 = parseInt(data[3]);

var cur =new Array();

var coll = dBase.collection('score'); 
function addName(cur, coll, is18){
	debugger;
if (is18 == 18){
	coll.find({USER_ID: user, T18: { $exists: true, $nin: [ 0 ] } }).sort({score_date:-1}).skip(skip).limit(limit).forEach(function(doc){ 
		addCur(doc);
	//returnRes(res, doc);	
	});
}else{
	//coll.find({USER_ID: user, T18: { $exists: true, $nin: [ 0 ] } }).sort({score_date:-1}).skip(skip).limit(limit).forEach(function(doc){
	coll.find({USER_ID: user, $or:[{T18:0},{T18:null}]  } ).sort({score_date:-1}).skip(skip).limit(limit).forEach(function(doc){
		addCur(doc);
	//returnRes(res, doc);	
	});
}
};  

function addCur(doc){
	doc.score_date = tl.getDateTime(doc.score_date);
	cur[cur.length]=doc;
	if (cur.length == limit)
		returnRes(res, cur);
}

addName(cur, coll, is18);



}

function endDelGame(req, res, param){
var request = (decodeURI(param.data));
var data = request.split("$");
var gID = (data[0]);	
var o_id = new ObjectId(gID);
var action = (data[1]);

var coll = dBase.collection('score');
if (action == 0){
   coll.remove({_id:o_id}, function(err, docr) {
		if (err) {
			logErreur('Erreur remove score _id : ');
		}
		returnRes(res, docr);
	});
}
if (action == 1){
	var dateTime = Date.now();
	coll.update({_id:o_id}, { $set: { score_date: dateTime} }, function(err, docr) {
		if (err) {
			logErreur('Erreur end score _id : ');
		}
		returnRes(res, docr);
	  });
}

}

function getGameTab(req, res, param){
var request = (decodeURI(param.data));
var data = request.split("$");
var gID = (data[0]);
//var parc = parseInt(data[1]);
if (parseInt(gID) < 500)
	var o_id = parseInt(gID);
else	
	var o_id = new ObjectId(gID);

var coll = dBase.collection('score');
coll.find({_id:o_id}).toArray(function(err, doc) {

getBloc(res, doc)
  });
}

function getBloc(res, doc){

	var coll = dBase.collection('blocs'); 
	coll.find({"PARCOURS_ID": doc[0].PARCOURS_ID }).toArray(function(err, blocs) {
	for (var i= 0; i < blocs.length; i++){
		if (blocs[i].Bloc == "Normale"){
			doc[0].par = blocs[i];
			break;
		}
	}
	debugger;
	returnRes(res, doc);	
  });
}


function getGame(req, res, param, user, parc){
if (!user){  // else call by updateGame
	var request = (decodeURI(param.data));
	var data = request.split("$");
	var user = parseInt(data[0]);
	var parc = parseInt(data[1]);
}
var coll = dBase.collection('score');
coll.find({ USER_ID: user, PARCOURS_ID: parc, score_date: null }).toArray(function(err, docs) {
	returnRes(res, docs);
  });
}

//Non utilisé
function getGame2(res, user, parc){

var coll = dBase.collection('score');
coll.find({ USER_ID: user, PARCOURS_ID: parc, score_date: null }).toArray(function(err, docs) {
	returnRes(res, docs);
  });
}

function updateGame(req, res, param){
var request = (decodeURI(param.data));
var data = request.split("$");
var user = parseInt(data[0]);
var parc = parseInt(data[1]);
var hole = parseInt(data[2]);
var stroke = parseInt(data[3]);
var put = parseInt(data[4]);
var lost = parseInt(data[5]);
var name = (data[6]);

var coll = dBase.collection('score');

switch (hole) {
  case 1:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T1: stroke, P1: put, L1: lost, name: name} }, { upsert : true }, callResult );
	break;
  case 2:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T2: stroke, P2: put, L2: lost} }, { upsert : true }, callResult );
	break;
  case 3:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T3: stroke, P3: put, L3: lost} }, { upsert : true }, callResult );
	break;
  case 4:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T4: stroke, P4: put, L4: lost} }, { upsert : true }, callResult );
	break;
  case 5:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T5: stroke, P5: put, L5: lost} }, { upsert : true }, callResult );
	break;
  case 6:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T6: stroke, P6: put, L6: lost} }, { upsert : true }, callResult );
	break;
  case 7:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T7: stroke, P7: put, L7: lost} }, { upsert : true }, callResult );
	break;
  case 8:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T8: stroke, P8: put, L8: lost} }, { upsert : true }, callResult );
	break;
  case 9:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T9: stroke, P9: put, L9: lost} }, { upsert : true }, callResult );
	break;
  case 10:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T10: stroke, P10: put, L10: lost} }, { upsert : true }, callResult );
	break;
  case 11:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T11: stroke, P11: put, L11: lost} }, { upsert : true }, callResult );
	break;
  case 12:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T12: stroke, P5: put, L12: lost} }, { upsert : true }, callResult );
	break;
  case 13:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T13: stroke, P3: put, L13: lost} }, { upsert : true }, callResult );
	break;
  case 14:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T14: stroke, P14: put, L14: lost} }, { upsert : true }, callResult );
	break;
  case 15:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T15: stroke, P15: put, L15: lost} }, { upsert : true }, callResult );
	break;
  case 16:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T16: stroke, P16: put, L16: lost} }, { upsert : true }, callResult );
	break;
  case 17:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T17: stroke, P17: put, L17: lost} }, { upsert : true }, callResult );
	break;
  case 18:
	coll.update({ USER_ID: user, PARCOURS_ID: parc, score_date: null }, { $set: {USER_ID: user, PARCOURS_ID: parc, score_date: null, T18: stroke, P18: put, L18: lost} }, { upsert : true }, callResult );
	break;
	
//dBase.score.update({ USER_ID: "cdore00@yahoo.ca", PARCOURS_ID: 407, score_date: new Date("2016/05/10") }, { $set: {T1: 8} }, { upsert : true } );
}

function callResult(err, docr){
	//debugger;
	getGame(false, res, false, user, parc);
	//returnRes(res, docr.ops)
	//console.log(docr);
}
//returnRes(res, doc.ops[{"result":true}]);

}

function authUser(req, res, param){
var request = (decodeURI(param.data));
var req = request.split("$pass$");
var user = req[0];
var pass = req[1];

	var coll = dBase.collection('users'); 
coll.find({"courriel": user}).toArray(function(err, docs) {
	//debugger;
	if (docs[0]){
		if (pass == docs[0].motpass) 
			returnRes(res, [{"result":docs[0]._id}]);
		else
			returnRes(res, [{"result":false}]);
	}else{
		returnRes(res, [{"result":false}]);
	}
  });
}

function getUserFav(req, res, param){
var userID = (decodeURI(param.data));
var coll = dBase.collection('userFavoris');
  // Find some documents              "USER_ID": parseInt(userID)
  coll.find({"USER_ID": parseInt(userID)}, ["CLUB_ID"]).toArray(function(err, docs) {
	    //console.log(docs);
getClubNameList(res, docs)
  });
}

function getClubNameList(res, clubList){
var ids = new Array();
	for (var i = 0; i < clubList.length; i++) {
		ids[ids.length] = parseInt(clubList[i].CLUB_ID);
	}
//var ids = clubList.map(function(id) { return parseInt(id); });
	var coll = dBase.collection('club'); 
  coll.find({"_id":{$in: ids }},["_id","nom"]).toArray(function(err, docs) {
	returnRes(res, docs);
  });  
}

function getRegionList(req, res){
	var coll = dBase.collection('regions'); 
coll.find({}).toArray(function(err, docs) {
	returnRes(res, docs);
  });  
}

function getClubParcours(req, res, param){
var query = (decodeURI(param.data));
var ids = query.split('$');
var clubID = parseInt(ids[0]);
var userID = ids[1];

	var coll = dBase.collection('club'); 
coll.find({"_id": clubID }).toArray(function(err, docs) {
	//console.log(docs)
	isFavorite(res, docs, userID)
	//returnRes(res, docs);
  });  
}

function isFavorite(res, clubDoc, userID){
var coll = dBase.collection('userFavoris');
  coll.find({"CLUB_ID": clubDoc[0]._id , "USER_ID": parseInt(userID)}, ["CLUB_ID"]).toArray(function(err, docs) {
	    //console.log(docs);
	if (docs[0])
		clubDoc[0].isFavorite = true;
	else
		clubDoc[0].isFavorite = false;
	
	returnRes(res, clubDoc);
  });	
}


function updateFav(req, res, param){
var query = (decodeURI(param.data));
var ids = query.split('$');
var clubID = parseInt(ids[0]);
var userID = ids[1];
var action = ids[2];

var coll = dBase.collection('userFavoris');
debugger;
  // Find some documents
if (action == "0"){
  coll.remove({"CLUB_ID": parseInt(clubID) , "USER_ID": parseInt(userID)}, function(err, docs) {
	    console.log(docs);

	returnRes(res);
  });	
}
if (action == "1"){
  coll.insertOne({"CLUB_ID": parseInt(clubID) , "USER_ID": parseInt(userID)}, function(err, docs) {
	    console.log(docs);

	returnRes(res);
  });	
}
}


function getBlocList(req, res, param){
var query = (decodeURI(param.data));
var ids = query.split('$');
ids = ids.map(function(id) { return parseInt(id); });
var coll = dBase.collection('blocs'); 
coll.find({"PARCOURS_ID":{$in: ids }}).toArray(function(err, docs) {
    console.log("Found the following blocs");
    //console.log(docs)
returnRes(res, docs);
  });
	
}

function getClubList(req, res, param){
var query = (decodeURI(param.data));
var ids = query.split(',');
ids = ids.map(function(id) { return parseInt(id); });
var coll = dBase.collection('club');
coll.find({_id: {$in: ids }}, ["_id","nom", "adresse", "municipal", "telephone", "telephone2", "telephone3", "location", "courses.TROUS"]).toArray(function(err, docs) {
    console.log("Found the following list clubs");
   // console.log(docs)
returnRes(res, docs);
  });
}

function getGolfGPS(req, res, param){
var courseID = parseInt(param.data);
	var coll = dBase.collection('golfGPS'); 
coll.find({"Parcours_id": courseID }, {"sort": "trou"}).toArray(function(err, docs) {
	res.data = docs;   //  ADD ON RES OBJ
	getBlocGPS(res, courseID);
  });
}

function getBlocGPS(res, courseID){
	var coll = dBase.collection('blocs'); 
coll.find({"PARCOURS_ID": courseID }, {"sort": "_id"}).toArray(function(err, docs) {
	returnRes(res, docs);
  });
}


function searchResult(req, res, param){
var request = (decodeURI(param.data));
var req = request.split("$");
var coll = dBase.collection('club');
	
switch (req[0]) {
  case "1":
	listByName(req[1], req[2]);
	break;
  case "2":
	listByRegion(req[1]);
	break;
  case "3":
	listByDistance(parseFloat(req[1]), parseFloat(req[2]), parseInt(req[3]));
	break;
  default:
	res.statusCode = 200;
	res.end("No action");
}

function listByName(qNom, qVille){

coll.find({ $or:[ {nom: {'$regex': new RegExp(qNom, "ig")} }, {municipal: {'$regex': new RegExp(qVille, "ig")} } ]}, {"sort": "nom"}).toArray(function(err, docs) {
	returnRes(res, docs);
  });
}
	
function listByRegion(query){
var ids = query.split(',');
debugger;
ids = ids.map(function(id) { return parseInt(id); });

coll.find({region: {$in: ids }}, {"sort": "nom"}).toArray(function(err, docs) {
	returnRes(res, docs);
  });
}

function listByDistance(lng, lat, dist){
//console.log("lng=" + lng + "  lat=" + lat + "  dist=" + dist);
coll.find({ "location": { "$near" : {"$geometry": { "type": "Point",  "coordinates": [ lng , lat ] }, "$maxDistance": dist }}}, {"sort": "nom"}).toArray(function(err, docs) {
	if (err){
		console.log(err.message);
	}
returnRes(res, docs);
  });
}

}

//
// LOAD & format DATA

function loadF(req, res, param){
var fileName = (decodeURI(param.data));
var collName = fileName.substring(0, fileName.indexOf("."));
console.log(collName);


switch (collName) {
  case "users":
	var  insertdata = insertUsers;
	break;
  case "userFavoris":
	var  insertdata = insertuserFavoris;
	break;
  case "regions":
	var  insertdata = insertRegions;
	break;
  case "golfGPS":
	var  insertdata = insertGolfGPS;
	break;
  case "blocs":
	var  insertdata = insertBlocs;
	break;
  case "parcours":
	var  insertdata = insertParc;
	break;
  case "club":
	var  insertdata = insertClub;
	break;
  case "score":
	var  insertdata = insertScore;
	break;
}


	fs.readFile(fileName, "utf8", (err, data) => {
		if(err){
			tl.logFile(err.message);
			throw err;
		}else{
			res.statusCode = 200;
			res.setHeader('Content-type', 'text/html');
			//console.log(data);
			var arrObj = JSON.parse(data);
			var coll = dBase.collection(collName); 
			console.log(coll.namespace);
			for (var p = 0; p < arrObj.length; p++) {
				if (p == arrObj.length - 1)
					insertdata(coll, arrObj[p], res);
				else
					insertdata(coll, arrObj[p]);
				//console.log("Insert data " + p);
				res.write("Insert data _id:" + arrObj[p]._id + "</br>");
			}
			}
	});	
}

function  insertuserFavoris(coll, data, res){

	coll.insertOne( {"_id": eval(data._id),"USER_ID":data.USER_ID,"CLUB_ID":data.CLUB_ID}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function insertUsers(coll, data, res){

	coll.insertOne( {"_id": eval(data._id),"ident":data.ident,"actif":data.actif,"motpass":data.motpass,"niveau":data.niveau,"Nom":data.Nom,"Prenom":data.Prenom,"courriel":data.courriel,"Telephone":data.Telephone}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function insertRegions(coll, data, res){

	coll.insertOne( {"_id": eval(data._id),"Nom":data.Nom,"Nom2":data.Nom2}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function insertGolfGPS(coll, data, res){

	coll.insertOne( {"_id": eval(data._id),"Parcours_id": eval(data.Parcours_id),"trou": eval(data.trou),"latitude": eval(data.latitude), "longitude": eval(data.longitude)}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function insertBlocs(coll, data, res){

	coll.insertOne( {"_id": eval(data._id),"PARCOURS_ID": eval(data.PARCOURS_ID),"Bloc": data.Bloc,"T1": eval(data.T1), "T2": eval(data.T2),"T3": eval(data.T3), "T4": eval(data.T4),"T5": eval(data.T5), "T6": eval(data.T6),"T7": eval(data.T7),"T8": eval(data.T8), "T9": eval(data.T9), "Aller": eval(data.Aller),"T10": eval(data.T10),"T11": eval(data.T11),"T12": eval(data.T12),"T13": eval(data.T13),"T14": eval(data.T14),"T15": eval(data.T15),"T16": eval(data.T16),"T17": eval(data.T17),"T18": eval(data.T18),"Retour": eval(data.Retour),"Total": eval(data.Total),"Eval": data.Eval,"Slope": data.Slope}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function insertScore(coll, data, res){
var laDate = data.score_date;
laDate = laDate.substring(1);
	coll.insertOne( {"_id": eval(data._id),"USER_ID": eval(data.USER_ID),"PARCOURS_ID": eval(data.PARCOURS_ID),"score_date": new Date(laDate),"T1": eval(data.T1), "T2": eval(data.T2),"T3": eval(data.T3), "T4": eval(data.T4),"T5": eval(data.T5), "T6": eval(data.T6),"T7": eval(data.T7),"T8": eval(data.T8), "T9": eval(data.T9),"T10": eval(data.T10),"T11": eval(data.T11),"T12": eval(data.T12),"T13": eval(data.T13),"T14": eval(data.T14),"T15": eval(data.T15),"T16": eval(data.T16),"T17": eval(data.T17),"T18": eval(data.T18),"P1": eval(data.P1), "P2": eval(data.P2),"P3": eval(data.P3), "P4": eval(data.P4),"P5": eval(data.P5), "P6": eval(data.P6),"P7": eval(data.P7),"P8": eval(data.P8), "P9": eval(data.P9),"P10": eval(data.P10),"P11": eval(data.P11),"P12": eval(data.P12),"P13": eval(data.P13),"P14": eval(data.P14),"P15": eval(data.P15),"P16": eval(data.P16),"P17": eval(data.P17),"P18": eval(data.P18),"L1": eval(data.L1), "L2": eval(data.L2),"L3": eval(data.L3), "L4": eval(data.L4),"L5": eval(data.L5), "L6": eval(data.L6),"L7": eval(data.L7),"L8": eval(data.L8), "L9": eval(data.L9),"L10": eval(data.L10),"L11": eval(data.L11),"L12": eval(data.L12),"L13": eval(data.L13),"L14": eval(data.L14),"L15": eval(data.L15),"L16": eval(data.L16),"L17": eval(data.L17),"L18": eval(data.L18)}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function  insertParc(coll, data, res){

	coll.insertOne( {"_id": eval(data._id),"CLUB_ID": eval(data.CLUB_ID),"PARCOURS":data.PARCOURS,"DEPUIS": data.DEPUIS,"TROUS": eval(data.TROUS),"NORMALE": eval(data.NORMALE),"VERGES": eval(data.VERGES)}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function insertClub(coll, data, res){

	coll.insertOne( {"_id": eval(data._id), "nom": data.nom, "url_club": data.url_golf, "prive": eval(data.prive), "depuis": data.depuis, "municipal": data.municipal, "url_ville": data.url_ville, "telephone": data.telephone, "telephone2": data.telephone2, "telephone3": data.telephone3, "adresse": data.adresse, "codepostal2": data.codepostal2, "region": eval(data.region), "codepostal": data.codepostal, "longitude": eval(data.longitude), "latitude": eval(data.latitude)}, function(err, result) {
		 if(err) { 
			console.log("Insert erreur:" + err.message);
			throw err; 
		}
		 if (res){
			 console.log("Insert data terminate in " + coll.namespace);
			 res.end();
		 }
  });	  
}

function execProc(req, res, param){
var procName = (decodeURI(param.data));
console.log(procName);

switch (procName) {
  case "creLoc":
	addLoc();
	break;
  case "creBlocsParc":
	addBlocsParc();
	break;
  case "creParcClub":
	addParcClub(res);
	break;
  case "delBlocsParc":
	deleteParcClub();
	break;
  case "delClub":
	deleteClub(res);
	break;
  case "indexData":
	createIndex(res);
	break;	
  case "addToParc":
	addFieldParc(res);
	break;
  case "convTime":
	convTime(res);
	break;

}
	
}

function addLoc(){
// Add Geo lat, lng
var coll = dBase.collection('club');
    coll.find().forEach(function(doc){
         coll.update({_id:doc._id}, {$set:{"location": {y: doc.longitude, x: doc.latitude} }});
    });
	console.log("Location created");
}

function addBlocsParc(){
// Add Geo lat, lng
var collParc = dBase.collection('parcours');
var collBloc = dBase.collection('blocs');
debugger;
    collParc.find().forEach(function(doc){
         collParc.update({_id:doc._id}, {$set:{"blocs": collBloc.find({PARCOURS_ID: doc._id}).toArray() }});
    });
	console.log("Blocs add to club");
}

// addParcClub functions
function addParcClub(res){

var collParc = dBase.collection('parcours');

    collParc.find().toArray(function(err, doc){
		//debugger;
		addParcToClub(doc);
    });
res.end();
}

function addParcToClub(arrP){
// Add Geo lat, lng
var collClub = dBase.collection('club');

    collClub.find().forEach(function(doc){
				var noID =  doc._id;
				//debugger;
         collClub.update({_id:doc._id}, {$set:{"courses": addCobj(arrP, doc._id) }});
    });
	console.log("Courses add to club");
}

function addCobj(arrP, id){
var courseObjArr = new Array();
for (var p = 0; p < arrP.length; p++) {

if (arrP[p].CLUB_ID == id){
	courseObjArr[courseObjArr.length] = {"_id": eval(arrP[p]._id), "CLUB_ID" : eval(arrP[p].CLUB_ID), "PARCOURS" : arrP[p].PARCOURS, "DEPUIS" : eval(arrP[p].DEPUIS), "TROUS" : eval(arrP[p].TROUS), "NORMALE" : eval(arrP[p].NORMALE), "VERGES" : eval(arrP[p].VERGES), "golfGPS" : arrP[p].golfGPS };
}
	
}
//strObj += '}';
return courseObjArr;
}

// END addParcClub functions

// Add fields to parcours collection
function addFieldParc(res){
var collParc = dBase.collection('golfGPS');

    collParc.distinct("Parcours_id", function(err, doc){
		//debugger;
		addGolfGPS(doc);
    });
res.end();
	
}

function addGolfGPS(arrG){
var collParc = dBase.collection('parcours');

    collParc.find().forEach(function(doc){
         collParc.update({_id:doc._id}, {$set:{"golfGPS": addGobj(arrG, doc._id) }});
    });
	console.log("GolfGPS to parcours created");
}

function addGobj(arrG, id){

for (var p = 0; p < arrG.length; p++) {
	if (arrG[p] == id){
		return true;
		break;
	}	
}
return false;
}

function convTime(res){
// Add Geo lat, lng
var coll = dBase.collection('score');
    coll.find().forEach(function(doc){
			tmpD= new Date(doc.score_date);
			time = tmpD.getTime();
         coll.update({_id:doc._id}, {$set:{"score_date": time }});
    });
	res.end();
	console.log("Time created");
}


function deleteColl(req, res, param){
var tableName = (decodeURI(param.data));
	
var collTable = dBase.collection(tableName);
collTable.drop();
console.log( tableName + " removed");
res.end();
}



function createIndex(res){

var collClub = dBase.collection('club');
collClub.createIndex( { "region" : 1 } );
collClub.createIndex( { "location" : "2dsphere" } )	;
collClub.createIndex( { "nom" : 1 }, {collation:{ locale: "fr", strength: 2 }} );
collClub.createIndex( { nom: "text", municipal: "text" } )

var collClub = dBase.collection('blocs');
collClub.createIndex( { "PARCOURS_ID" : 1 } );

var collClub = dBase.collection('golfGPS');
collClub.createIndex( { "Parcours_id" : 1 } );

var collClub = dBase.collection('score');
collClub.createIndex( { "joueur_id" : 1, "PARCOURS_ID" : 1, "score_date" : 1 } );
collClub.createIndex( { "joueur_id" : 1, "score_date" : -1 } );

var collClub = dBase.collection('users');
collClub.createIndex( { courriel: 1, actif: 1}, {unique: true} );

console.log("Index Created");
res.end();
}
