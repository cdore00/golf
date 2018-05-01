#!/usr/bin/env python
#C:\Users\cdore\AppData\Local\Programs\Python\Python36-32

#import pdb
#; pdb.set_trace()
import sys, os, io, time, re, csv, urllib.parse, urllib.request
#, http.cookies
import smtplib

from http.server import BaseHTTPRequestHandler, HTTPServer
from cgi import parse_header, parse_multipart
from socket import gethostname, gethostbyname 
from urllib.parse import urlparse, parse_qs
from http.cookies import SimpleCookie
from sys import argv
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
MAIL_USER = 'charles.dore@nexio.com' 

#import requests as req
#from io import BytesIO

cookie = SimpleCookie()

def millis():
   """ returns the elapsed milliseconds (1970/1/1) since now """
   dt = datetime.now() - datetime(1970, 1, 1)
   ms = (dt.days * 24 * 60 * 60 + dt.seconds) * 1000 + dt.microseconds / 1000.0
   return ms

HOSTserv = 'http://127.0.0.1:3000/'
HOSTclient = 'http://localhost:8080/'
#'https://cdore00.github.io/golf/'

#Log file
LOG_DIR =os.getcwd() + '/log'
if not os.path.exists(LOG_DIR):
	os.makedirs(LOG_DIR)
LOG_FILE = 'log/' + str(int(millis())) + '.log'

global logPass 
logPass = ""
if os.getenv('PINFO') is not None:
	logPass = os.environ['PINFO']

# MongoDB
import pymongo
from pymongo import MongoClient

if os.environ.get('MONGODB_USER'):
	port = int(os.environ['MONGODB_PORT'])
	user = urllib.parse.quote_plus(os.environ['MONGODB_USER'])
	passw = urllib.parse.quote_plus(os.environ['MONGODB_PASSWORD'])
	domain = urllib.parse.quote_plus(os.environ['MONGODB_SERVICE'])
	dbase = urllib.parse.quote_plus(os.environ['MONGODB_DATABASE'])
	uri = "mongodb://%s:%s@%s/%s?authMechanism=SCRAM-SHA-1" % (user, passw, domain, dbase)
else:
	port = 27017
	uri = "mongodb://localhost"

client = MongoClient(uri, port)
data = client.golf
from bson import ObjectId
from bson.json_util import dumps
from bson.json_util import loads
import json


# HTTPRequestHandler class
class golfHTTPServer(BaseHTTPRequestHandler):
	
	@staticmethod
	def call_Func(strURL):
		fpart = os.path.split(strURL)
		strURL = fpart[len(fpart)-1]
		pos = strURL.find("?")
		if pos == -1:
		  func = strURL[0:]
		else:
		  func = strURL[0:pos]
		return func
	
	@staticmethod
	def return_Res(self,mess):
		if isinstance(mess, (int)) and mess == False:
			return
		else:
			#pdb.set_trace()
			# Send response status code
			self.send_response(200)
			# Send headers
			self.send_header('Content-type','text/html')
			self.send_header('Access-Control-Allow-Origin', '*')
			#  Set cookie
			self.send_header('Set-Cookie','superBig=zag;max-age=31536000')
			self.end_headers()
			# Write content as utf-8 data
			self.wfile.write(bytes(mess, "utf8"))
			
			return

	# GET
	def do_GET(self):
		"""Manage GET request received"""

		# Send message back to client
		query_components = parse_qs(urlparse(self.path).query)
		url = self.path
		print("GET " + url)
		message = case_Func(self.call_Func(url), query_components, self)
		self.return_Res(self,message)
		return

		
	# POST	
	def do_POST(self):
		"""Manage POST request received"""
		content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
		post_data = self.rfile.read(content_length) # <--- Gets the data itself

		cook =  self.headers["Cookie"]
		print('Cookies2= ' + str(cook))
		#pdb.set_trace()
		
		# Send message back to client
		query_components = parse_qs(urlparse(self.path).query)
		if not query_components:
			query_components = urllib.parse.parse_qsl(str(post_data.decode('utf-8')))
		url = self.path
		print("POST " + url)
		message = case_Func(self.call_Func(url), query_components, self)
		self.return_Res(self,message)
		
		return		

#End class

def case_Func(fName, param, self):
	if fName == "ose":
		return(ose(self))
	elif fName == "listLog":
		return(listLog(param))
	elif fName == "addUserIdent":
		return(addUserIdent(param))
	elif fName == "confInsc":
		return(confInsc(param))
	elif fName == "identUser":
		return(authUser(param, self))
	elif fName == "getPass":
		return(getPass(param))
	elif fName == "saveUser":
		return(saveUser(param))
	elif fName == "showLog":
		return(showLog(param))
	elif fName == "getRegions":
		print("getRegionsOk")
		return(getRegionList())
	elif fName == "getFav":
		return(getFav(param))
	elif fName == "updateFav":
		return(updateFav(param))		
	elif fName == "searchResult":
		return(searchResult(param))
	elif fName == "getClubList":
		return(getClubList(param))
	elif fName == "getClubParc":
		return(getClubParc(param))
	elif fName == "getBloc":
		return(getBloc(param))
	elif fName == "getClubParcTrous":
		return(getClubParcTrous(param))
	elif fName == "setGolfGPS":
		return(setGolfGPS(param))
	elif fName == "countUserGame":
		return(countUserGame(param))
	elif fName == "getGameList":
		return(getGameList(param, self));
	elif fName == "getGameTab":
		return(getGameTab(param))
	elif fName == "endDelGame":
		return(endDelGame(param, self))
	elif fName == "updateGame":
		return(updateGame(param))
	elif fName == "getGolfGPS":
		return(getGolfGPS(param))
	elif fName == "getGame":
		return(getGame(param))
	else:
		return("DB server2" + str(param))


# Requests
def ose(self):
	print(logPass)
	ostxt = (os.environ)
	#print(str(ostxt))
	
	#f = open('workfile.txt', 'w')
	#f.write("testtt\n")
	#f.close()
	#f = open(LOG_DIR + '/myScore.csv','r')
	# Autre techique
	#x = json.dumps([1, 'simple', 'list'])
	#json.dump(x, f)
			
	log_Info('oseFunct')

	return(logPass)

def getID(strID):
	if len(strID) < 5:
		return int(strID)
	else:	
		return ObjectId(strID)
		
def cursorTOdict(doc):
	strCur = dumps(doc)
	jsonCur = loads(strCur)
	return dict(jsonCur[0])
	
def checkSession(self):
	""" Session ID check for user"""
	strCook =  self.headers["Cookie"]
	if strCook and 'sessID' in strCook and 'userID' in strCook:
		cookie.load(strCook)
		sID = cookie['sessID'].value
		uID = getID(cookie['userID'].value)
		coll = data.users
		doc = coll.find({"_id": uID, "sessID": sID}, ["_id"])
		if doc.count() > 0:
			return True
		else:
			return False
	else:
		return False

def addUserIdent(param):
	""" To add new user account """
	if param:
		if param.get("email") and param.get("pass"):
			email = param["email"][0]
			passw = param["pass"][0]
			user = ""
			if param.get("user"):
				user = param["user"][0]

			coll = data.users
			docs = coll.find({"courriel": email})
			#pdb.set_trace()
			if docs.count() > 0:
				doc = cursorTOdict(docs)
				if doc['actif'] == False:
					if doc['motpass'] == passw:
						sendConfMail( HOSTclient + "confInsc?data=" + email , email, doc['Nom'])
						return dumps({"code":1, "message": "S0050"})	#existInactif(doc)
					else:
						return dumps({"code":3, "message": "S0051"})
				if doc['actif'] == True:
					return dumps({"code":2, "message": "S0058"})
			else:
				res = coll.insert_one({"Nom": user , "courriel": email, "motpass": passw , "niveau": "MEM", "actif": False}, {"new":True})

				name = user
				if name == "":
					name = email
				#"http://localhost/confInsc?data=" +
				sendConfMail( HOSTclient + "confInsc?data=" + email , email, name)
				log_Info("Nouveau compte créé: " + email)
				return dumps({"code":-1, "message": "S0052"})
	else:
		return dumps({'resp': {"result": 0} })	# No param

def confInsc(param):
	""" To Confirm new account"""
	#pdb.set_trace()
	if param:
		if param.get("data"):
			user = param["data"][0]
			coll = data.users
			docs = coll.find({"courriel": user})
			if docs[0]['actif'] == True:
				return ("<h1>Le compte " + docs[0]['courriel'] + " est d&eacute;j&agrave; actif.</h1>")
			else:
				#activateAccount(loginUser(res, docs[0].courriel, docs[0].motpass))
				res = coll.update({"courriel": user}, { "$set": {"actif": True}})
				log_Info("Nouveau compte activé: " + docs[0]['courriel'])
				redir = """<html><head><script type="text/javascript" language="Javascript">function initPage(){var cliURL = "%s",user = "%s",pass = "%s";document.location.href = cliURL + "login.html?data=" + user + "$pass$" + pass;}</script></head><body onload="initPage()"><h1>Confirmation en cours...</h1></body></html>""" % (HOSTclient, docs[0]['courriel'], docs[0]['motpass'])
				return redir
		else:	
			return("Confirm" + str(param))
	else:
		return dumps({'resp': {"result": 0} })	# No param			
	
def getPass(param):
	""" Recover password by email """
	if param:
		if param.get("data"):
			email = param["data"][0]
			coll = data.users
			docs = coll.find({"courriel": email, "actif": True})
			if docs.count() > 0:
				sendRecupPassMail(docs[0]['courriel'], docs[0]['Nom'], docs[0]['motpass']);
				return dumps({"code":-1, "message": "S0054"})
			else:
				return dumps({"code": 1, "message": "S0055"})
			
	else:
		return dumps({'resp': {"result": 0} })	# No param
	
def authUser(param, self):
	""" To Authenticate & return user info to modify """
	def writeCook(mess, sessID):
		self.send_response(200)
		self.send_header('Content-type','text/html')
		self.send_header('Access-Control-Allow-Origin', '*')
		#  Set cookie
		cookInfo = 'sessID=' + sessID + ';max-age=31536000'
		self.send_header('Set-Cookie', cookInfo)
		self.end_headers()
		# Write content as utf-8 data
		self.wfile.write(bytes(mess, "utf8"))
		return	
	
	if param:
		if param.get("user"):
			user = param["user"][0]
			
			coll = data.users
			doc = coll.find({"courriel": user, "actif": True}, ["_id","Nom", "courriel", "motpass", "niveau"])
			
			def setSessID(mess):
				sessID = str(ObjectId())
				res = coll.update({"courriel": user}, { "$set": {"sessID": sessID}})
				writeCook(mess, sessID)
				
			if doc.count() == 0:
				return dumps({'resp': {"result": 0} })	# Authenticate fail
			else:
				dic = cursorTOdict(doc)
				dic['_id'] = str(dic['_id'])
			if param.get("pass"):
				passw = param["pass"][0]
				if str(dic['motpass']) == passw:
					del dic['motpass']
					docs = {"resp": {"result":True, "user": dic} }
					res = dumps(docs)	# Authenticated
					setSessID(res)
					return False
				else:
					return dumps({'resp': {"result": 0} })	# Authenticate fail
			else:
				del dic['motpass']
				return dumps(dic)  # To modifiy
		else:
			return dumps({'resp': {"result": 0} })	# User is empty
	else:
		return dumps({'resp': {"result": 0} })	# No param

def saveUser(param):
	""" To modify user account info"""
	if param:
		if param.get("cour") and param.get("pass") and param.get("id"):
			user = param["cour"][0]
			passw = param["pass"][0]
			id = param["id"][0]
			name = param["name"][0]

			coll = data.users
			
			def updUser(doc):
				if str(doc['motpass']) == passw:
					if param.get("newpass"):
						Npass = param["newpass"][0]
						coll.update({"_id": o_id, "actif": True}, { "$set": {'Nom': name, 'courriel': user, 'motpass': Npass } })
					else:
						coll.update({"_id": o_id, "actif": True}, { "$set": {'Nom': name, 'courriel': user} })
					return dumps({"resp": {"result":True} })
				else:
					return dumps({"resp": {"result":False, "message": "S0059"} }) # Invalid password
			
			def checkEmailExist(doc):
				docs = coll.find({"courriel": user, "_id": {"$ne": o_id}})
				if docs.count() > 0:
					return dumps({"resp": {"result":False, "message": "S0056"} }) # The new email allredy exist
				else:
					return updUser(doc)
			
			if len(id) < 5:
				o_id = int(id)
			else:	
				o_id = ObjectId(id)
			
			docs = coll.find({"_id": o_id, "actif": True})
			
			if docs.count() > 0:
				dic = cursorTOdict(docs)
				return checkEmailExist(dic);
			else:
				return dumps({resp: {"result":False, "message": "S0057"} }) # The new email allredy exist
		
			return dumps({ })	# modified
		else:
			return dumps({'resp': {"result": 0} })	# A param is empty
	else:
		return dumps({'resp': {"result": 0} })	# No param
	

def getRegionList():
	col = data.regions
	docs = col.find({})
	res = dumps(docs)
	return res
	
def searchResult(param):
	#print(str(param))
	if param.get("qn"):
		qNom = param["qn"][0]
		qVille = param["qv"][0]
	if param.get("qr"):
		qReg = int(param["qr"][0])
	if param.get("qd"):
		dist = float(param["qd"][0])
		lng = float(param["qlt"][0])
		lat = float(param["qln"][0])
	qT = []
	col = data.club
	
	if 'qNom' in locals():
		regxN = re.compile(qNom, re.IGNORECASE)
		regxV = re.compile(qVille, re.IGNORECASE)
		q1 = {"$or": [ {"nom": {"$regex": regxN } } , {"municipal": {"$regex": regxV} } ]}
		qT.append(q1)
	
	if 'qReg' in locals():
		q2 = {'region': qReg}
		qT.append(q2)

	if 'dist' in locals():
		q3 = {"location": { "$near" : {"$geometry": { "type": "Point",  "coordinates": [ lng , lat ] }, "$maxDistance": dist }}};
		qT.append(q3)
		
	query = { "$and": qT }
	docs = col.find(query).sort("nom")
	res = dumps(docs)
	return res

def getFav(param):
	if param:
		if param.get("data"):
			userID = getID(param["data"][0])
			coll = data.userFavoris
			docs = coll.find({"USER_ID": userID}, ["CLUB_ID"])
			
			def getClubNameList(clubList):
				coll = data.club
				favDocs = coll.find({"_id":{"$in": clubList }},["_id","nom"]).sort("nom")
				return dumps(favDocs)
			
			ids = []
			for x in docs:
				ids.append(x['CLUB_ID'])			

			return getClubNameList(ids)
	else:
		return dumps({'resp': {"result": 0} })	# No param		
	
def updateFav(param):
	if param:
		if param.get("data"):
			clubList = param["data"][0]
			ids = [x for x in clubList.split("$")]
			clubID = int(ids[0])
			userID = getID(ids[1])
			action = int(ids[2])

			coll = data.userFavoris

			if action == 1:
				docs = coll.insert_one({"CLUB_ID": clubID , "USER_ID": userID})
				if docs.acknowledged:
					r = {'n': 0, 'ok': 1.0}
				else:
					r = {'n': 0, 'ok': 0}
			else:
				docs = coll.remove({"CLUB_ID": clubID , "USER_ID": userID})
				r = docs
			return dumps(r)
	else:
		return dumps({'resp': {"result": 0} })	# No param			
	
def getClubList(param):
	""" To get clubs list info"""
	if param:
		if param.get("data"):
			clubList = param["data"][0]
			ids = [int(x) for x in clubList.split(",")]

			coll = data.club
			docs = coll.find({"_id": {"$in": ids }}, {"_id": 1,"nom": 1, "adresse": 1, "municipal": 1, "telephone": 1, "telephone2": 1, "telephone3": 1, "location": 1, "courses.TROUS": 1}).sort("nom")
			
			return dumps(docs)
	else:
		return dumps({'resp': {"result": 0} })	# No param

def getClubParc(param):
	""" To get club and his courses info"""
	if param:
		if param.get("data"):
			clubList = param["data"][0]
			ids = [x for x in clubList.split("$")]
			clubID = int(ids[0])
			userID = ids[1]
			if len(userID) < 5:
				userID = int(userID)
			else:	
				userID = ObjectId(userID)
			
			def isFavorite(doc):
				coll = data.userFavoris
				favDoc = coll.find({"CLUB_ID": clubID , "USER_ID": userID}, ["CLUB_ID"])
				if favDoc.count() > 0:
					doc['isFavorite'] = True
				else:
					doc['isFavorite'] = False
				return doc
			coll = data.club
			docs = coll.find({"_id": clubID })
			dic = cursorTOdict(docs)
			x = dumps([(isFavorite(dic))])
			return (x)
	else:
		return dumps({'resp': {"result": 0} })	# No param

def getBloc(param):
	if param:
		if param.get("data"):
			blocList = param["data"][0]
			ids = [int(x) for x in blocList.split("$")]
			coll = data.blocs 
			docs = coll.find({"PARCOURS_ID":{"$in": ids }}).sort("PARCOURS_ID")
			return dumps(docs)
	else:
		return dumps({'resp': {"result": 0} })	# No param
		
def getClubParcTrous(param):
	if param:
		if param.get("data"):
			param = param["data"][0]
			ids = [int(x) for x in param.split("$")]
			clubID = ids[0]
			courseID = ids[1]

			coll = data.club
			doc = coll.find({"_id": clubID }, ["_id","nom", "courses", "latitude", "longitude"])

			if doc.count() > 0:
				coll = data.golfGPS
				docs = coll.find({"Parcours_id": courseID }).sort("trou")
				if docs.count() > 0:
					dic = cursorTOdict(doc)
					res = [dic]				
					res[0]['trous'] = docs
					return dumps(res)
				else:
					return dumps(doc)

	else:
		return dumps({'resp': {"result": 0} })	# No param

def setGolfGPS(param):
	if param:
		if param.get("data"):
			param = param["data"][0]
			para = [x for x in param.split("$")]
			courseId = int(para[0])
			trou = int(para[1])
			lat = float(para[2])
			lng = float(para[3])
			toInit = int(para[4])
			clubId = int(para[5])
			
			coll = data.golfGPS
			if toInit == 0:
				docr = coll.update({ 'Parcours_id': courseId, 'trou': trou }, { '$set': {'Parcours_id': courseId, 'trou': trou, 'latitude': lat, 'longitude': lng } },  upsert=True )
				return dumps(docr)
			else:
				for i in range(toInit):
					holeNo = i + 1
					#print(holeNo)
					resp = coll.update({ 'Parcours_id': courseId, 'trou': holeNo }, { '$set': {'Parcours_id': courseId, 'trou': holeNo, 'latitude': lat, 'longitude': lng } },  upsert=True)
					if holeNo == toInit:
						coll = data.parcours
						pRep = coll.update({"_id":courseId}, {"$set":{"GPS": True }})
						pa = coll.find({'CLUB_ID': clubId})
						strCur = dumps(pa)
						cur = loads(strCur)
						coll = data.club
						res = coll.update({'_id': clubId}, {'$set':{"courses": cur }})
						return dumps(res)
	else:
		return dumps({'resp': {"result": 0} })	# No param
		
def countUserGame(param):
	if param:
		if param.get("data"):
			param = param["data"][0]
			para = [x for x in param.split("$")]
			user = int(para[0])
			is18 = int(para[1])

			coll = data.score

			if (is18 == 18):
				count = coll.find({"USER_ID": user, "T18": { "$exists": True, "$nin": [ 0 ] }}).count()
				return (str(count))
			else:
				count = coll.find({"USER_ID": user, "$or":[{"T18":0},{"T18":None}]  } ).count()
				return (str(count))
	else:
		return dumps({'resp': {"result": 0} })	# No param
		
		
def getGameList(param, self):
	"""Return game list result """
	if param:
		if param.get("user"):
			user = int(param["user"][0])
			skip = int(param["skip"][0])
			limit = int(param["limit"][0])
			is18 = int(param["is18"][0])
			intDate = int(param["date"][0])
			if param.get("tele"):
				intTele = int(param["tele"][0])
			else:
				intTele = 0
			if intDate == 0:   # ou 0 ???
				intDate = 9999999999999

			cur = []
			coll = data.score
			
			def addCur(doc):
				
				for x in doc:
					if intTele != 2:  # If Not JSON then convert millisecond to date and ObjectId
						ts = x['score_date'] / 1000
						x['score_date'] = datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
						x['_id'] = str(x['_id'])
					cur.append(x)
				
				if (intTele > 0):
					self.send_response(200)
					self.send_header('Content-type','text/html')
					self.send_header('Access-Control-Allow-Origin', '*')
					if (intTele == 2):	# JSON file
						self.send_header('Content-disposition', 'attachment; filename=myScore.json')
						self.end_headers()
						self.wfile.write(bytes(dumps(cur), "utf8"))
					if (intTele == 1):	# CSV file
						outFile = io.StringIO()
						output = csv.writer(outFile)
						output.writerow(cur[0].keys())	#Column names
						for x in cur:
							output.writerow(x.values())

						contents = outFile.getvalue()
						outFile.close()
						self.send_header('Content-disposition', 'attachment; filename=myScore.csv')
						self.end_headers()
						self.wfile.write(bytes(contents, "utf8"))
					return False
				else:
					return dumps(cur)
				
			if is18 == 18:
				doc = coll.find({"USER_ID": user, "score_date": {"$lt":intDate}, "T18": { "$exists": True, "$nin": [ 0 ] } }).sort("score_date",-1).skip(skip).limit(limit)
			else:
				doc = coll.find({"USER_ID": user, "score_date": {"$lt":intDate}, "$or":[{"T18":0},{"T18":None}]  } ).sort("score_date",-1).skip(skip).limit(limit)			
			
			#docs = cursorTOdict(doc)
			return addCur(doc)
			
			#return str(intDate)
	else:
		return dumps({'resp': {"result": 0} })	# No param
	
def getGameTab(param):
	if param:
		if param.get("data"):
			
			gID = getID(param["data"][0])

			def getBloc(doc):
				coll = data.blocs
				blocs = coll.find({"PARCOURS_ID": doc['PARCOURS_ID'] })
				for x in blocs:
					if x['Bloc'] == "Normale":
						doc['par'] = x
				return dumps([doc]) 
			
			coll = data.score
			doc = coll.find({"_id":gID})
			if doc.count() > 0:
				doc = cursorTOdict(doc)
				if doc['score_date'] != None:
					ts = doc['score_date'] / 1000
					doc['score_date'] = datetime.fromtimestamp(ts).strftime('%Y-%m-%d')
						
				return(getBloc(doc))
	
	else:
		return dumps({'resp': {"result": 0} })	# No param
		

def endDelGame(param, self):
	if param:
		if param.get("data"):
			param = param["data"][0]
			para = [x for x in param.split("$")]
			gID = para[0]
			o_id = getID(gID)
			action = int(para[1])
			resErr = '{"n":0,"ok":0, "message":'
			
			coll = data.score
			if checkSession(self):
				if action == 0:	# Delete game
				   res = coll.remove({"_id":o_id})

				if action == 1:  # End Game
					dateTime = int(millis())
					log_Info("End game: " + gID)
					res = coll.update({"_id":o_id}, { "$set": { "score_date": dateTime} })
				return dumps(res)
			else: 
				resErr += "\"S0061\"}" if action == 0 else "\"S0060\"}"
				return (resErr)
	else:
		return dumps({'resp': {"result": 0} })	# No param
		
def updateGame(param):
	if param:
		if param.get("data"):
			param = param["data"][0]
			para = [x for x in param.split("$")]
			user = int(para[0])
			parc = int(para[1])
			hole = int(para[2])
			stroke = int(para[3])
			put = int(para[4])
			lost = int(para[5])
			name = (para[6])
			
			Tno = "T" + str(hole)
			Pno = "P" + str(hole)
			Lno = "L" + str(hole)

			coll = data.score

			res = coll.update({ "USER_ID": user, "PARCOURS_ID": parc, "score_date": None }, { "$set": {"USER_ID": user, "PARCOURS_ID": parc, "score_date": None, Tno: stroke, Pno: put, Lno: lost, "name": name} },  upsert=True)
			
			return getGame(None, userID = user, parcID = parc)

	else:
		return dumps({'resp': {"result": 0} })	# No param
		
def getGolfGPS(param):
	if param:
		if param.get("data"):
			courseID = int(param["data"][0])
			coll = data.golfGPS
			
			def getBlocGPS(gData):
				coll = data.blocs
				doc = coll.find({"PARCOURS_ID": courseID })
				Pdoc =dumps(gData)
				Pdoc=loads(Pdoc)
				Pdoc[0]['parc'] = doc
				return dumps(Pdoc)

			doc = coll.find({"Parcours_id": courseID }).sort("trou")

			return getBlocGPS(doc)

	else:
		return dumps({'resp': {"result": 0} })	# No param
	
def getGame(param, userID = False, parcID = False):
	
	def getG(user, parc):
		coll = data.score
		#pdb.set_trace()
		doc = coll.find({ "USER_ID": user, "PARCOURS_ID": parc, "score_date": None })
		cur = cursorTOdict(doc)
		cur['_id'] = str(cur['_id'])
		return dumps([cur]) 

	if param:
		if param.get("data"):
			param = param["data"][0]
			para = [x for x in param.split("$")]
			user = int(para[0])
			parc = int(para[1])
			return getG(user, parc)
	else:
		return getG(userID, parcID)


# Manage logs

def log_Info(mess):
	ip = gethostbyname(gethostname()) 
	t = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
	strMess = t + "\t" + ip + "\t" + mess + "\n"
	with open(LOG_FILE,'a') as f:
		f.write(strMess)

def listLog(param):

	if param:
		#print("call=" + str(param))
		#print("type=" + str(type(param)))
		res = dict(param)
		passw = ""
		if "pass" in res:
			passw = res["pass"]
		if logPass == passw:
			return(listLogs())
		else:
			log_Info('listLog Unauthorized: ' + passw)
			return('<h2>Unauthorized</h2>')
	else:
		htmlCode = '<!DOCTYPE html><html lang="en-CA"><head><meta name="viewport" content="width=device-width" /></head><body><form action="/listLog" method="post"><input type="password" name="pass"><input type="submit" name="submit"></form></body></html>'
		return(htmlCode)

def listLogs():

	fileList = os.listdir(LOG_DIR)
	cont = '<h2>Log files</h2>'
	for line in fileList:
		f = os.stat(LOG_DIR + '/' + line)
		t = time.ctime(f.st_ctime)
		s = f.st_size
		cont = cont + '<a target="_blank" href="./showLog?nam=' + line + '">' + line + "\t" + t + "\t" + str(int(s/1024) + 1) + " ko" '</a></br>'
	#print(fileList)
	return(str(cont))
	
def showLog(param):
	print(str(param))
	if param.get("nam"):
		fileName = param["nam"][0]
	lines = [line.rstrip('\n') for line in open(LOG_DIR + "/" + fileName)]
	f = os.stat(LOG_DIR + '/' + fileName)
	cont = '<h2>' + fileName + "  " + time.ctime(f.st_ctime) + '</h2>'
	for line in lines:
		cont = cont + line + '</br>'
	return(str(cont))

	

# Send mail
def sendRecupPassMail(eMail, name, passw):
	text = ''
	#pdb.set_trace()
	name = name if name != '' else eMail
	html = """\
	<html><body><div style="text-align: center;"><div style="background-color: #3A9D23;height: 34px;"><div style="margin: 3px;float:left;"><img alt="Image Golf du Québec" width="25" height="25" src="https://cdore00.github.io/golf/images/golf.png" /></div><div style="font-size: 22px;font-weight: bold;color: #ccf;padding-top: 5px;">Golfs du Qu&eacute;bec</div></div></br><p style="width: 100; text-align: left;">Bonjour %s,</p><p></p><p style="width: 100; text-align: left;">Votre mot de passe est : %s </p><p></p><p><div id="copyright">Copyright &copy; 2005-2017</div></p></div></body></html>
	"""  % (name, passw)
	fromuser = "Golf du Québec"
	subject = "Golf du Québec - Récupérer mot de passe de " + name 
	log_Info("Récupérer mot de passe de " + name + " : " + eMail)
	send_email(fromuser, eMail, subject, text, html)

def sendConfMail(link, email, name):

	recipient = email
	subject = "Golf du Québec - Confirmer l'inscription de cdore00@yahoo.com"
	
	fromuser = "Golf du Québec"

	# Create the body of the message (a plain-text and an HTML version).
	text = "Hi %s!\nCliquer ce lien pour confirmer l\'inscription de votre compte:\n%s\n\nGolf du Québec" % (name, link)
	print(text)
	html = """\
	<html><body><div style="text-align: center;"><div style="background-color: #3A9D23;height: 34px;"><div style="margin: 3px;float:left;"><img alt="Image Golf du Québec" width="25" height="25" src="https://cdore00.github.io/golf/images/golf.png" /></div><div style="font-size: 22px;font-weight: bold;color: #ccf;padding-top: 5px;">Golfs du Qu&eacute;bec</div></div></br><a href="%s" style="font-size: 20px;font-weight: bold;">Cliquer ce lien pour confirmer l\'inscription de votre compte:<p>%s</p> </a></br></br></br><p><div id="copyright">Copyright &copy; 2005-2018</div></p></div></body></html>
	""" % (link, email)
	send_email(fromuser, recipient, subject, text, html)

def send_email(fromuser, recipient, subject, text, html):

	# Create message container - the correct MIME type is multipart/alternative.
	msg = MIMEMultipart('alternative')
	msg['Subject'] = subject
	msg['From'] = fromuser
	#pdb.set_trace()
	msg['To'] = recipient 

	# Record the MIME types of both parts - text/plain and text/html.
	part1 = MIMEText(text, 'plain')
	part2 = MIMEText(html, 'html')

	# Attach parts into message container.
	# According to RFC 2046, the last part of a multipart message, in this case
	# the HTML message, is best and preferred.
	msg.attach(part1)
	msg.attach(part2)

	mail = smtplib.SMTP('smtp.gmail.com', 587)
	mail.ehlo()
	mail.starttls()
	mail.login(MAIL_USER, logPass)
	mail.sendmail(fromuser, recipient, msg.as_string())
	mail.quit()


# Start server listening request
def run(server_class=HTTPServer, handler_class=golfHTTPServer, port=8080, domain = ''):
	# Server settings
	print(str(port))
	server_address = (domain, port)
	httpd = HTTPServer(server_address, handler_class)
	print('running server...(' + domain + ":" + str(port) + ')')
	httpd.serve_forever()
	return

def build_arg_dict(arg):
	argd = dict()
	def add_dict(item):
		i = 0
		for x in arg:
			if x == item:
			  argd[x] = arg[i+1]
			else:
			  i+= 1

	if "port" in arg:
		add_dict("port")
	if "domain" in arg:
		add_dict("domain")
	if "pass" in arg:
		add_dict("pass")
		
	#print("DIC=" + str(argd) + str(len(arg)) + str(len(argd)))
	if (len(arg) / 2) != len(argd):
		return False
	else:
		return argd

if __name__ == "__main__":
	print(argv[0])
	if len(argv) > 1:
		arg = [x for x in argv]
		del arg[0]
		param = build_arg_dict(arg)
		#print(str(param))
		if param:
			if "pass" in param:
				#global logPass 
				logPass = param["pass"]
				if len(argv) == 3:
					run()
				if "domain" in param and "port" in param:
					run(domain=(param["domain"]), port=int(param["port"]))
				elif "domain" in param:
					run(domain=(param["domain"]))
				elif "port" in param:
					run(port=int(param["port"]))
		else:
			print("[domain VALUE] [port VALUE] [pass VALUE]")
	else:
		run()

