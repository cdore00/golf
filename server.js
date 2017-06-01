//  OpenShift sample Node application

const http = require('http');
const fs = require('fs'); 
//const util = require('util');

var ip;
var url = require('url');    
//Object.assign=require('object-assign')

tl = require('./tools.js');

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
// End  Instantiate Web Server


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();
var ObjectId = require('mongodb').ObjectId;

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
	console.log("Connection BD mongoServiceName=" + mongoServiceName);
	console.log("mongoHost=" + mongoHost);
	console.log("mongoPort=" + mongoPort);
	console.log("mongoDatabase=" + mongoDatabase);
	console.log("mongoPassword=" + mongoPassword);
	console.log("mongoUser=" + mongoUser);
	console.log("mongoAdmin=" + process.env[mongoServiceName + '_ADMIN_PASSWORD']);
	initBD();
  });
};

var dBase;

function initBD(){

  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
	dBase = db;
    // Create a document with request IP and current time of request
    //col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){

	  console.log("Page compte11= " + count);
    });
  }
}

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

// Start server listening request
	server.listen(port, ip, () => {
		console.log('Server started on port ' + port);
		tl.logFile('Server started on port ' + port);
	});
// END Web Server

//
//Request functions
//

//
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

function authUser(req, res, param){
var request = (decodeURI(param.data));
var req = request.split("$pass$");
var user = req[0];
var pass = req[1];

	var coll = dBase.collection('users'); 
coll.find({"courriel": user}).toArray(function(err, docs) {
	debugger;
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
//var strClub = "";
var arrC = new Array;

var coll = dBase.collection('userFavoris');
  // Find some documents
  coll.find({}, ["CLUB_ID"]).toArray(function(err, docs) {
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
//var clubID = clubDoc._id;
var coll = dBase.collection('userFavoris');

  // Find some documents
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
coll.find({_id: {$in: ids }}, ["_id","nom", "adresse", "municipal", "telephone", "telephone2", "telephone3", "courses.TROUS"]).toArray(function(err, docs) {
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
coll.find({"PARCOURS_ID": courseID }).toArray(function(err, docs) {
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

console.log(qNom + qVille);
//.collation( { locale: "fr" } ) avant .toArry
coll.find({ $or:[ {nom: {'$regex': new RegExp(qNom, "ig")} }, {municipal: {'$regex': new RegExp(qVille, "ig")} } ]}, {"sort": "nom"}).toArray(function(err, docs) {
    console.log("Found the following search clubs");
   // console.log(docs)
returnRes(res, docs);
  });
}
	
function listByRegion(query){
var ids = query.split(',');
debugger;
ids = ids.map(function(id) { return parseInt(id); });

coll.find({region: {$in: ids }}, {"sort": "nom"}).toArray(function(err, docs) {
    console.log("Found the following search clubs");
   // console.log(docs)
returnRes(res, docs);
  });
}

function listByDistance(lng, lat, dist){
console.log("lng=" + lng + "  lat=" + lat + "  dist=" + dist);
//			{ "loc": {  "$near": {"$geometry": {"type": "Point", "coordinates": [ 121.001, 31.001 ] }  }, "$maxDistance": 2000 }}
coll.find({ "location": { "$near" : {"$geometry": { "type": "Point",  "coordinates": [ lng , lat ] }, "$maxDistance": dist }}}, {"sort": "nom"}).toArray(function(err, docs) {
    console.log("Found the following near clubs");
	if (err){
		console.log(err.message);
	}
	else{
		console.log(docs);
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

	coll.insertOne( {"_id": eval(data._id), "nom": data.nom, "prive": eval(data.prive), "depuis": data.depuis, "municipal": data.municipal, "url_ville": data.url_ville, "telephone": data.telephone, "telephone2": data.telephone2, "telephone3": data.telephone3, "adresse": data.adresse, "codepostal2": data.codepostal2, "region": eval(data.region), "codepostal": data.codepostal, "longitude": eval(data.longitude), "latitude": eval(data.latitude)}, function(err, result) {
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

console.log("Index Created");
res.end();
}
