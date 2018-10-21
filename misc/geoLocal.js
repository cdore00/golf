<!--

function getLocalisationErr(){
	if (navigator.geolocation) {

			//var options = { enableHighAccuracy:true, maximumAge:10000, timeout:10000, frequency: 2000 };
			var options = { enableHighAccuracy:true, maximumAge:500, timeout:10000, frequency: 20};

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
	            alert("Délai dépassé");
	        break;
			}
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
	if ( d > 1760){
	  d = d / 1760;
	  d = Math.round(d * 100) / 100;
	  d = d + 'M';
	  }
	return d;
}

//-->