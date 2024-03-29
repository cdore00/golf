https://github.com/openshift/nodejs-ex.git
https://www.mongodb.com/download-center/community/releases

oc login https://api.starter-us-east-1.openshift.com
oc project cd-serv
oc status

oc delete all -l app=django-ex


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

sudo apt install mongo-tools



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

// Delete Geo lat, lng
function delLoc(){
    db.club.find().forEach(function(doc){
         db.club.update({_id:doc._id}, { $unset: { location: ""} });
    });
};

// Add Geo lat, lng
function addLoc(){
    db.club.find().forEach(function(doc){
         db.club.update({_id:doc._id}, {$set:{"location": {type: "Point", coordinates: [ doc.longitude, doc.latitude ]} }});
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

function addState(){
    db.recettes.find().forEach(function(doc){
         db.recettes.update({_id:doc._id}, {$set:{"state": 1 }});
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



db.changeUserPassword("accountUser", passwordPrompt())

db.createUser({user:"tuser",pwd:"123",roles:["readWrite","dbAdmin"]}) 
db.createUser(
       {
         user: "MyAdmin",
         pwd: "MyAdminPassw0rd",
         roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
       }
     )

     db.createUser(
       {
         user: "MyRoot",
         pwd: "MyRootPassw0rd",
         roles: [ { role: "root", db: "admin" } ]
       }
     )

     db.createUser(
       {
         user: "MyUser",
         pwd: "MyUserPassw0rd",
         roles: [ { role: "readWrite", db: "mydb" } ]
       }
     )
db.createUser({ user: "MyUser", pwd: "pass",roles: [ { role: "readWrite", db: "mydb" } ]})

    // if done later; reconnect as "MyAdmin" and allow "MyUser" read on authentication database "admin"

     use admin
     db.grantRolesToUser(
     "MyUser",
     [
       { role: "read", db: "admin" }
     ]
     )

db.grantRolesToUser( "MyUser", [{ role: "read", db: "admin" }])
 
List all users
	 db.getUsers();
	 
tt=db.club.find({}).sort({nom:1}).skip(10).limit(1).toArray();

mongo -u $MONGODB_USER -p $MONGODB_PASSWORD sampledb
mongodump --host 192.168.2.160 --port 27017 -d golf --out mdump
mongodump -u $MONGODB_USER -p $MONGODB_PASSWORD -d sampledb --out /tmp/mdump
mongorestore -u $MONGODB_USER -p $MONGODB_PASSWORD --authenticationDatabase=admin -d sampledb mdump/golf
mongorestore -d golf mdump/golf	

mongoexport --db=golf --collection=regions --type csv --fieldFile fields.txt --out reg.txt
mongoimport --db golf --collection parcours --jsonArray --file parcours.json 
mongo --norc -u $MONGODB_USER -p $MONGODB_PASSWORD sampledb
cd ~/&&ls -al
sudo rm .mongorc.js
bash /home/bin/cpdb


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

UBUNTU version
lsb_release -a

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
delClub(666)

SHUTDOWN
$ ./mongo
use admin
db.shutdownServer()

RESTART MONGODB
sudo rm /var/lib/mongodb/mongod.lock
sudo systemctl restart mongod
or
sudo chown -R mongodb:mongodb /var/run/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb

ACCES SERVER SHELL
https://doc.ubuntu-fr.org/ssh
ssh-copy-id -i ~/.ssh/id_rsa.pub root@45.76.9.19
Sur serveur distant:
cat ~/.ssh/authorized_keys

ssh root@45.76.9.19
COPY FILE TO SERVER
sudo scp -r sampledb root@45.76.9.19:/home/mdump/golf

REPLICA SET
mongod --port 27017 --dbpath /data/db/db0 --replSet rs0
rs.conf()
2017-10-18T17:53:34.981-0400 E QUERY    [thread1] Error: Could not retrieve replica set config: {
        "info" : "run rs.initiate(...) if not yet done for the set",
        "ok" : 0,
        "errmsg" : "no replset config has been received",
        "code" : 94,
"codeName" : "NotYetInitialized"}
 rs.initiate()
 
 CHANGE HOST
 $ mongo 
cfg = rs.conf()
cfg.members[0].host = "<new_node_name>:27017"
rs.reconfig(cfg) 

REMOVE SERVER
use admin
db.shutdownServer();  //On secondary
rs.remove("ServerC")  //On primary

REMOVE replica set
db.system.replset.remove({})


SET replica set
on slave
mongod --port 27017 --dbpath /home/cdore/data --replSet rsg
on primary
mongod --port 27017 --dbpath /data/db/replica --replSet rsg
rs.initiate({    _id : "rsg",    members: [ { _id : 0, host : "192.168.2.160:27017" } ] }) 
rs.add("192.168.2.188:27017")
rs.conf()
rs.status()
on primary and slave
rs.slaveOk()

rs.initiate({"_id" : "rsg","members":[{"_id" : 0, "host":"cdore.ddns.net:6600"} ] })
sudo docker run -d -p 192.168.10.11:8080:27017 -p 6600:27017 -v /home:/data --name="m_golf" cdore00/mongo_golf:v2 --replSet "rsg" 


UNINSTALL MONGOBD
sudo apt-get autoremove --purge mongodb
dpkg -l | grep mongo
sudo apt purge mongo*

Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
     Active: failed (Result: exit-code)
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
Solution:
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock




PYTHON
import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
data = client.golf
col = data.regions
col.count()
tt = col.find_one({"_id":1})
tt = col.find({})
from bson.json_util import dumps
dumps(tt)

python -m pip install requests
import pkg_resources
pkg_resources.get_distribution("pymongo").version

http://api.mongodb.com/python/current/api/pymongo/results.html



mongosh -u admin -p pass --authenticationDatabase=admin test

db.createUser(
  {
    user: "username",
    pwd: "pass",
    roles: [
       { role: "readWrite", db: "dbname" }
    ]
  }
)

db.dropUser("userName")


db.createRole(
   {
     role: "manResto", 
     privileges: [
       { resource: { db: "resto", collection: "" }, actions: [
        'changeStream',
        'collStats',
        'compactStructuredEncryptionData',
        'convertToCapped',
        'createCollection',
        'createIndex',
        'dbHash',
        'dbStats',
        'dropCollection',
        'dropIndex',
        'find',
        'insert',
        'killCursors',
        'listCollections',
        'listIndexes',
        'planCacheRead',
        'remove',
        'renameCollectionSameDB',
        'update'
      ]
 }
     ],
     roles: []
   }
)


db.revokeRolesFromUser(
    "cdore",
    [
      { role: "readWrite", db: "resto" }
    ]
)

db.grantRolesToUser(
    "cdore",
    [
      { role: "manResto", db: "resto" }
    ]
)

db.revokePrivilegesFromRole('manResto', [{resource: {db:"resto", collection : ""}, actions: ["dropDatabase"]}])
db.grantPrivilegesToRole(
    "makebup",
    [
        { resource: {db:"", collection : ""}, actions: [  'find', 'listCollections', 'listIndexes'  ] }
    ]
)

db.getRole( "read", { showPrivileges: true } )

View All User-Defined Roles for a Database
db.runCommand(
    {
      rolesInfo: 1,
      showPrivileges: true
    }
)

db.grantRolesToUser( "cdore", [ "DBuser" ] )

db.dropRole("manDB")

[{'_id': 'admin.DBuser', 'role': 'DBuser', 'db': 'admin', 'privileges': [{'resource': {'db': '', 'collection': ''}, 'actions': ['createCollection', 'createIndex', 'dropIndex', 'find', 'insert', 'killCursors', 'remove', 'update']}], 'roles': []}, 
{'_id': 'admin.makebup', 'role': 'makebup', 'db': 'admin', 'privileges': [{'resource': {'db': '', 'collection': ''}, 'actions': ['find', 'listCollections', 'listIndexes']}], 'roles': []}]

mongoexport -u=user -p=pass --db=resto --collection=news --jsonArray --out news.json
mongoimport -u=user -p=pass --db=traiteur --collection news --jsonArray --file news.json

count group by
 tt=db.score.aggregate([ {"$match" : {"USER_ID":80}}, {"$group" : {"_id":{"name":"$name","parcours":"$PARCOURS_ID"}, "count":{"$sum":1}}} ])
tt=coll.aggregate([ {"$match" : {"USER_ID": user, "T18": { "$exists": True, "$nin": [ 0 ] }}}, {"$group" : {"_id":{"name":"$name","parcours":"$PARCOURS_ID"}, "count":{"$sum":1}}} ])


db.club.insert({ "_id" : 2, "nom" : "", "url_club" : "", "prive" : false, "depuis" : "", "municipal" : "", "url_ville" : "", "telephone" : "", "telephone2" : "", "telephone3" : "", "adresse" : "", "codepostal2" : "", "region" : 0, "codepostal" : "", "longitude" : "", "latitude" : "", "courses" : [ { "_id" : 3, "CLUB_ID" : 2, "POINTS" : "", "PARCOURS" : "", "DEPUIS" : "", "TROUS" : 18, "NORMALE" : 72, "VERGES" : 6000, "GPS" : false } ]  })


db.blocs.insert({ "_id" : 3, "PARCOURS_ID" : 3, "Bloc" : "Normale", "T1" : "", "T2" : "", "T3" : "", "T4" : "", "T5" : "", "T6" : "", "T7" : "", "T8" : "", "T9" : "", "Aller" : "", "T10" : "", "T11" : "", "T12" : "", "T13" : "", "T14" : "", "T15" : "", "T16" : "", "T17" : "", "T18" : "", "Retour" : "", "Total" : "", "Eval" : "", "Slope" : "" })

db.regions.insert({"_id": 19, "Nom": "Europe", "Nom2": "Europe"})

Current user
db.runCommand({connectionStatus : 1})

db.getSiblingDB("$external").runCommand( { createUser: "CN=x509user,OU=myOrgUnit,O=myOrg,L=Quebec,ST=QC,C=CA", roles: [ { role: 'readWrite', db: 'test' }, { role: 'userAdminAnyDatabase', db: 'admin' }], writeConcern: { w: "majority", wtimeout: 5000 } } )


MongoDb Container user/roles

admin> db.getUsers()
{
  users: [
    {
      _id: 'admin.CDadmin',
      userId: new UUID("5a2d3180-b898-4c88-9358-0f249c678a3e"),
      user: 'CDadmin',
      db: 'admin',
      roles: [ { role: 'root', db: 'admin' } ],
      mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
    },
    {
      _id: 'admin.bupUser',
      userId: new UUID("cae8d1e3-949c-41af-a3d7-57927bb772cd"),
      user: 'bupUser',
      db: 'admin',
      roles: [ { role: 'makebup', db: 'admin' } ],
      mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
    }
  ],
  ok: 1
}

golf> db.getUsers()
{
  users: [
    {
      _id: 'golf.cdGolf',
      userId: new UUID("88827e91-e966-4c62-bea5-bc0f6d7407ef"),
      user: 'cdGolf',
      db: 'golf',
      roles: [ { role: 'manGolf', db: 'golf' } ],
      mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
    },
    {
      _id: 'golf.cdore',
      userId: new UUID("d3fccdfb-5258-4d71-87e1-576548f72e29"),
      user: 'cdore',
      db: 'golf',
      roles: [ { role: 'manGolf', db: 'golf' } ],
      mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
    }
  ],
  ok: 1
}

