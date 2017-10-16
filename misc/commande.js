https://github.com/openshift/nodejs-ex.git

oc login https://api.starter-us-east-1.openshift.com
oc project cd-serv
oc status

https://github.com/cdore00/servDB.git


mongoimport --db golftest --collection regions --jsonArray --file reg.json
mongoexport --db golfDB --collection club --out traffic.json

Connection BD mongoServiceName=MONGODB   DATABASE_SERVICE_NAME.toUpperCase()
mongoHost=172.30.54.12  _SERVICE_HOST
mongoPort=27017         _SERVICE_PORT
mongoDatabase=sampledb  _DATABASE
mongoPassword=tml6fMOcjEdNdBMq  _PASSWORD
mongoUser=user84C               _USER
mongoAdmin=fFw6j3APyvUrhfaQ   MONGODB_ADMIN_PASSWORD

mongodb://user84C:tml6fMOcjEdNdBMq@172.30.54.12:27017/sampledb


select max value
db.club.find({}).sort({"_id":-1}).limit(1)

delete all with empty query
db.products.remove(({}))

 db.products.drop()
// Remove field parcours from club collection
db.club.update({}, {$unset: {parcours:1}} , {multi: true});

db.copyDatabase("golfDB","golfBUP","localhost")
use golfBUP
db.dropDatabase();

db.blocs.createIndex( { PARCOURS_ID: 1, _id: 1})


db.foo.update({_id:doc._id}, {$set:{"event_ts":doc.created}});

// Add Geo lat, lng
function addLoc(){
    db.club.find().forEach(function(doc){
         db.club.update({_id:doc._id}, {$set:{"location": {y: doc.longitude, x: doc.latitude} }});
    });
};

//Add field blocs from Parcours
function addBloc(){
    db.parcours.find().forEach(function(doc){
         db.parcours.update({_id:doc._id}, {$set:{"blocs": db.blocs.find({PARCOURS_ID: doc._id}).toArray() }});
    });
};

//Add field Courses from Parcours
function addParc(){
    db.club.find().forEach(function(doc){
         db.club.update({_id:doc._id}, {$set:{"courses": db.parcours.find({CLUB_ID: doc._id}).toArray() }});
    });
};

// Convert date to time
function addTime(){
    db.score.find().forEach(function(doc){
	tmpD= new Date(doc.score_date);
	time = tmpD.getTime();
         db.score.update({_id:doc._id}, {$set:{"score_date": time }});
    });
};

MongoDB only

var cur =new Array();
function addName(cur){ db.score.find({}).sort({score_date:-1}).skip(4).limit(1).forEach(function(doc){ 
var cName = db.club.find({"courses._id": 407}).toArray();  
doc.name = cName[0].nom;  
cur[cur.length]=doc; });  
}; 

	coll.count({USER_ID: user}, function(doc){ 
	cur[cur.length] = doc;	

function addName(){ 
db.score.find({}).forEach(function(doc){ 
var cName = db.club.find({"courses._id": doc.PARCOURS_ID}).toArray();  
var name = cName[0].nom; 
for (var p = 0; p < cName[0].courses.length; p++) {
	if (cName[0].courses[p]._id == doc.PARCOURS_ID){
		if (cName[0].courses[p].PARCOURS != "")
			name += " - " +  cName[0].courses[p].PARCOURS;
	}
}
db.score.update({_id:doc._id}, {$set:{"name": name }});  
}); 
}

db.score.find({USER_ID: 80, $or:[{T18:0},{T18:null}]  } ).sort({score_date:-1}).skip(0)


db.club.find({ location: { $near : {$geometry: { type: "Point",  coordinates: [ -71.2293677, 46.803678 ] }, $minDistance: 0, $maxDistance: 5000 } } })


 qNom="alba"
 lng=-71.21672360000002
 lat=46.8051462
 dist=12500
db.club.find({ $and:[{ $or:[ {nom: {"$regex": new RegExp(qNom, "ig")} }, {municipal: {"$regex": new RegExp(qNom, "ig")} } ]}  ,  {region: 14}  ,  
{ "location": { "$near" : {"$geometry": { "type": "Point",  "coordinates": [ lng , lat ] }, "$maxDistance": dist }}}]})

http://127.0.0.1:3000/delTable?data=users

CREATE DATABASE
load?data=users.json
load?data=userFavoris.json
load?data=regions.json
load?data=club.json
load?data=parcours.json
load?data=blocs.json
load?data=golfGPS.json
load?data=score.json

proc?data=addToParc   // Non requis
proc?data=creLoc
proc?data=creParcClub
proc?data=convTime
proc?data=indexData


http://127.0.0.1:3000/load?data=score.json

tt=db.score.aggregate([ { $match: { USER_ID: 80, PARCOURS_ID: 412, score_date: null } }, { $project : { 'Otot' : {'$add' : [ '$T1', '$T2', "$T3", "$T4", "$T5", "$T6", "$T7", "$T8", "$T9"]} }  }]).toArray();
 tt[0].total


 db.score.update({"score_date": 1497150283743}, {$set:{ "score_date": null}}) 

mongo -u $MONGODB_USER -p $MONGODB_PASSWORD sampledb
mongo -u admin -p $MONGODB_ADMIN_PASSWORD admin
mongoexport -u 'user84C' -p 'tml6fMOcjEdNdBMq' --db sampledb --collection users --jsonArray --out tuser.json
mongoexport --host cdore.no-ip.biz:27017 --db golf --collection users --jsonArray --out users.json
mongoimport -u 'tuser' -p '123' --db tdb --collection users --jsonArray --file tuser.json 
db.createUser({user:"tuser",pwd:"123",roles:["readWrite","dbAdmin"]}) 

tt=db.club.find({}).sort({nom:1}).skip(10).limit(1).toArray();

mongodump --host 192.168.2.160 --port 27017 -d golf --out mdump
mongodump -u $MONGODB_USER -p $MONGODB_PASSWORD -d sampledb --out mdump
mongorestore -d golf mdump/golf

mongoexport --db=golf --collection=regions --type csv --fieldFile fields.txt --out reg.txt
mongoimport --db golf --collection parcours --jsonArray --file parcours.json 

COPY DIR
oc cp mongodb-1-ck6bk:/tmp/bup /data/bup

To listen on port 8888 locally and forward to 5000 in the pod, run:
$ oc port-forward <pod> 8888:5000


var fs = require('fs');

// Where fileName is name of the file and response is Node.js Reponse. 
function responseFile(fileName, response) {
  var filePath =  "/path/to/archive.rar" // or any file format

  // Check if file specified by the filePath exists 
  fs.exists(filePath, function(exists){
      if (exists) {     
        // Content-type is very interesting part that guarantee that
        // Web browser will handle response in an appropriate manner.
        response.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Disposition" : "attachment; filename=" + file});
        fs.createReadStream(filePath).pipe(response);
      } else {
        response.writeHead(400, {"Content-Type": "text/plain"});
        response.end("ERROR File does NOT Exists");
      }
    });
  }
}

https://docs.mongodb.com/v3.4/tutorial/store-javascript-function-on-server/
db.system.js.save(
   {
     _id : "addParc" ,
     value : function (){ db.club.find().forEach(function(doc){
         db.club.update({_id:doc._id}, {$set:{"courses": db.parcours.find({CLUB_ID: doc._id}).toArray() }});
    }); }
   }
);
db.loadServerScripts();
addParc()

db.system.js.save(
   {
     _id : "addGPS" ,
     value : function (parcID){ 
		if (parcID){
		 db.parcours.find({_id:parcID}).forEach(function(doc){
			checkGPS(doc);
			}); 
		}else{
		 db.parcours.find().forEach(function(doc){
			checkGPS(doc);
			});
		}
	
	function checkGPS(doc){
	   var id = doc._id;
	   var gps = db.golfGPS.find({"Parcours_id": id }).toArray();
		if (gps.length > 0){
			 db.parcours.update({_id:id}, {$set:{"GPS": true }});
		}else{
			 db.parcours.update({_id:id}, {$set:{"GPS": false }});
		}
	}
	}
   }
);
db.loadServerScripts();
addGPS()


vi command 	description
i 	insert at the current position
I 	insert at the beginning of line
a 	append just after the current cursor position
A 	append at the end of line
o 	Open a new line below the current line
O 	Open a new line above the current line

ADD to sudores

su -
usermod username -a -G wheel


MongoDB Installation Fedora
https://developer.fedoraproject.org/tech/database/mongodb/about.html


VULTR SERVER
Docker
NGINX
GIT
OPENSSL


db.system.js.save(
   {
     _id : "delClub" ,
     value : function (clubID){
		var rc = db.club.find({ "_id": clubID });
			print ( rc[0]._id + " : " + rc[0].nom );
			delParc(rc[0].courses);
			db.club.remove(({_id:clubID}));
	
	function delParc(parcList){
		for (var p = 0; p < parcList.length; p++) {
			print ( parcList[p]._id );
			db.blocs.remove(({PARCOURS_ID:parcList[p]._id}));
			db.parcours.remove(({_id:parcList[p]._id}));
		}
	}
	}
   }
);
db.loadServerScripts();
delClub()

RESTART MONGODB
sudo rm /var/lib/mongodb/mongod.lock
sudo systemctl restart mongod

ACCES SERVER SHELL
ssh root@45.76.9.19
COPY FILE TO SERVER
sudo scp -r sampledb root@45.76.9.19:/home/mdump/golf


