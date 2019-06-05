<!--

function getLocalisationErr(){
	if (navigator.geolocation) {

			//var options = { enableHighAccuracy:true, maximumAge:10000, timeout:10000, frequency: 2000 };
			//var options = { enableHighAccuracy:true, maximumAge:500, timeout:10000, frequency: 20};
			var options = { enableHighAccuracy:true, maximumAge:10000, timeout:10000};
		watchId = navigator.geolocation.watchPosition(onLocSuccess, onLocAffError, options);
		//watchId = navigator.geolocation.watchPosition(onLocSuccess);
	}						

}

function onLocError(error) { 
	setResult(error.code);
	clearGeo(false);
}

function onLocAffError(error) { 
			clearGeo(false);
		  	switch(error.code) {
	        case error.UNKNOWN_ERROR:
	            alert("Erreur inconnue");
	        break;
	        case error.PERMISSION_DENIED:
				permRefuse();
	        break;
	        case error.POSITION_UNAVAILABLE:
	            alert("Position non disponible");
	        break;
	        case error.TIMEOUT:
	            //alert("Delai dépassé");
				if (localiser){
					setTimeout("localiser();", 2000);	
				if (flashLoc)
					flashLoc();
				}
	        break;
			}
			if (setResult)
				setResult(error.code);
			//alert("Erreur:"+ error.code)
}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "Version"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

function permRefuse(){
var message = "les paramètres de localisation de votre navigateur.";
BrowserDetect.init();

//alert(BrowserDetect.browser + " OS=" + BrowserDetect.OS);

if (BrowserDetect.browser == 'Firefox' & BrowserDetect.OS == 'Linux')
	message = "Site Settings>Share location";
if (BrowserDetect.browser == 'Firefox'  & BrowserDetect.OS == 'Windows')
	message = "Outils>Informations sur la page>Pemissions>Partager la localisation.";
if (BrowserDetect.OS == 'iPhone/iPod')
	message = "Réglages>Général>Réinitialiser>Réinitialiser localisation.";
if (BrowserDetect.browser == 'Mozilla' & BrowserDetect.OS == 'Linux')
	message = "More>Settings>Privacy & Personnal data>Activate location.";
	
var rep=confirm("Permission refusée pour la géolocalisation avec " + BrowserDetect.browser + ' v' + BrowserDetect.version + ' sur ' + BrowserDetect.OS + ".\n\n Voulez-vous désactiver la fonction de localisation pour Golfs du Québec ?");

if (rep){
	SetCook("LocTime",0);
	initPref();
	alert("Vous pouvez réactiver cette fonction en sélectionnant un 'Délai de localisation' dans vos préférences.");
}else{
	alert("Pour réactiver cette fonction allez dans " + message );
	}

}

function calculDistance(pt1, pt2){
var lat1 = pt1.lat();
var lat2 = pt2.lat();
var lon1 = pt1.lng();
var lon2 = pt2.lng();
var R = 6967410.324; // Rayon moyen en verge
var rLat1 = lat1 * (Math.PI / 180);
var rLat2 = lat2 * (Math.PI / 180);
var dLat = (lat2-lat1) * (Math.PI / 180);
var dLon = (lon2-lon1) * (Math.PI / 180);
var a = Math.sin(rLat1) * Math.sin(rLat2) + Math.cos(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
    a = Math.acos(a);
var d = R * a ;
	d = Math.round(d);

	return d;
}




// Picket distance object
// USAGE :
// HTML = <button id="UIid" ...
// window.oPicket = new piquetObject("UIid", Google map object, Hole marker object, [Hole marker object OR default from object distance 0=Position, 1=Hole]);
// window.oPicket.show()
function piquetObject(UIid, map, holeMark, posMarker){
	this.UIcontrol = document.getElementById(UIid);
	this.map = map;
	this.holeMarker = holeMark;
	this.posMarker = posMarker;
	this.path = null;
	this.clicListener = null;
	this.chxDistPiq = 0;
	this.defaultDistObj = (typeof posMarker == "number") ? posMarker:false;
	this.UIpiquetDist = null;
	this.UIchxPiqDist = null;
	this.open = false;
	
	  var polyOptions = {
		strokeColor: '#ffffff',
		clickable: false,
		strokeOpacity: 1.0,
		strokeWeight: 2
		}
	this.polyLine = new google.maps.Polyline(polyOptions);
	this.polyLine.setMap(map);
	
	  var image = {url:'images/piquet.png',
				size: new google.maps.Size(40, 40),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(0, 15)};

	this.piquetMarker = new google.maps.Marker({
		position: map.getCenter(),
		icon: image,
		visible: false,
		draggable: true,
		map: map
	  });	

	this.resize = function (fStop){
		var adj = 0;
		if (this.UIcontrol.baseURI.indexOf('golfGPS') != -1)		
			adj = 4;
		pos = getOffset(this.UIcontrol);	
		this.UIpiquetDist.style.left = (pos.left - this.UIcontrol.offsetWidth*.35) + "px";
		this.UIpiquetDist.style.top = (pos.top + this.UIcontrol.offsetHeight + adj) + "px";
		if (!fStop)
			setTimeout("window.oPicket.resize(true);", 50);
	}
	
		var bodyobj = document.getElementsByTagName('body')[0];
		var odiv = document.createElement("div");
		odiv.setAttribute('id', 'piquetDist');
		odiv.setAttribute('onclick', "window.oPicket.chxPiqDist(this)");
	this.UIpiquetDist = odiv;
		bodyobj.appendChild(odiv);
		pos = getOffset(this.UIcontrol);	
		this.resize(); 
		var odiv = document.createElement("div");
		odiv.setAttribute('id', 'chxPiqDist');
		odiv.innerHTML = '<a href="#" onclick="window.oPicket.setChxPiqDist(0)"><img id="imgLoc" height="16" width="16" alt="Distance de ma position" src="images/ici.png" /></a><a href="#" onclick="window.oPicket.setChxPiqDist(1)"><img id="imgLoc" height="25" width="16" alt="Distance du drapeau" src="images/flag.png" /></a>';
	this.UIchxPiqDist = odiv;
		bodyobj.appendChild(odiv);
		odiv.style.left = this.UIpiquetDist.style.left;
		odiv.style.top = this.UIpiquetDist.style.top;	
	
	
	//	Object functions

	this.show = function (){
		this.UIcontrol.style.visibility="visible";
		//window.addEventListener("resize", window.oPicket.resize());
		
		if (this.open)
			this.UIpiquetDist.style.visibility="visible";
	}
	this.hide = function (){
		this.UIcontrol.style.visibility="hidden";
		this.UIpiquetDist.style.visibility="hidden";
		this.UIchxPiqDist.style.visibility="hidden";
	}
	this.getPiquet = function (bPiq){
		 this.path = this.polyLine.getPath();
		//var imgPiquet = document.getElementById('imgPiquet');
		  if (this.clicListener){
			google.maps.event.removeListener(this.clicListener);
			this.clicListener = null;
			this.UIpiquetDist.style.visibility="hidden";
			this.UIchxPiqDist.style.visibility="hidden";
			this.path.clear();
			this.piquetMarker.setVisible(false);
			imgPiquet.width="3";
			this.holeMarker.position_changed = "";
			this.piquetMarker.position_changed = "";
			this.open = false;
		  }else{
			imgPiquet.width="16";
			this.UIpiquetDist.innerHTML = '';
			this.UIpiquetDist.style.visibility="visible";
			this.clicListener = google.maps.event.addListener(map, 'click', this.addLatLng);
			if (typeof this.defaultDistObj != "number"){
				this.chxPiqDist(this.UIpiquetDist);
			}else{
				this.setChxPiqDist(this.defaultDistObj);
				this.open = true;
			}
		  }
	}
	this.addLatLng = function (event) {
		latLng = (event.latLng);
		window.oPicket.piquetMarker.setPosition(latLng);
		window.oPicket.piquetMarker.setVisible(true);
	}
	this.chxPiqDist = function (oPiqDist){
		if (!this.defaultDistObj){
			this.UIpiquetDist.innerHTML = '';
			this.UIchxPiqDist.style.visibility="visible";
		}}
	this.setChxPiqDist = function (chx){
		this.chxDistPiq = chx;
		this.UIchxPiqDist.style.visibility="hidden";
		if (this.piquetMarker.getVisible())
			this.traceLine(this.piquetMarker.getPosition());
		this.holeMarker.position_changed = this.stopHoleDrag;
		this.piquetMarker.position_changed = this.stopPiquetDrag;
		this.open = true;
		if (chx == 0){ // Distance since last registred position
			lastPos = localStorage.getItem("lastGolfPos");
			if (lastPos)
				this.traceLine(window.oPicket.posMarker.getPosition(), JSON.parse(lastPos));
		}
		}
	this.traceLine = function (piquetLatLng, holeLatLng){
		if (!this.path)
			return false;

		  this.path.clear();
			if (!piquetLatLng)
				piquetLatLng = this.piquetMarker.getPosition();
			if (!holeLatLng)
				holeLatLng = this.holeMarker.getPosition();
		  this.path.push(piquetLatLng);

		  if (this.chxDistPiq == 0){
			this.path.push(this.posMarker.getPosition());
			this.UIpiquetDist.innerHTML = calculDistance(piquetLatLng, this.posMarker.getPosition());
		  }else{
			this.path.push(holeLatLng);
			this.UIpiquetDist.innerHTML = calculDistance(piquetLatLng, holeLatLng);
		  }
		}
	this.stopPiquetDrag = function (){
		window.oPicket.traceLine(this.getPosition());
		}
	this.stopHoleDrag = function (){
		window.oPicket.traceLine(false,this.getPosition());
		return false;
		}
}


//-->