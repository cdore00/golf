<!--

var HOSTserv = "https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";  // Openshift
// "http://127.0.0.1:3000/";		//Local host
// "http://cdore.ddns.net:8080/";  // VULTR Fedora 26 Server
// "http://192.168.2.188:8080/";  //Ubuntu workstation
//"http://127.0.0.1:3000/";
//"https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";  // Openshift

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

var isTouchDevice = is_touch_device();

function getInfo(path, callback){
var xhr=new XMLHttpRequest();
  xhr.onloadend = function() {
    var text = xhr.responseText;
	if (text == "")
		affNoRep();
	var data=JSON.parse(text);
	if (callback)
		callback(data);
  };
xhr.open("GET", HOSTserv + path ,true);
xhr.send();

	function affNoRep(){
		var eBod = document.getElementsByTagName('body')[0];
		var divErr = document.createElement("div");
		divErr.innerHTML = "Pas de réponse: " + HOSTserv;
		eBod.insertBefore(divErr, eBod.firstChild);
	}
}

function getURLdata(){
var urlInfo = document.location.href;
return decodeURI(urlInfo.substring(urlInfo.indexOf("data=") + 5));
}

//var dt =  new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit"});
function getDateTime(dateTime){
	var intlDateTime ;
	if (dateTime)
		intlDateTime = new Date(dateTime);  //dateTime = Date.now() type
	else
		intlDateTime = new Date();
	
	intlDateTime.setUTCHours(intlDateTime.getUTCHours());
	//intlDateTime = dt.format(intlDateTime);
	intlDateTime = intlDateTime.toLocaleString();
	intlDateTime = intlDateTime.substring(0, 10);
	return intlDateTime;
}

function DelCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
	
function getCookieVal(offset){
var endstr = document.cookie.indexOf(";", offset)
var tostr = ""+document.cookie.indexOf(";", offset)
if (tostr != ""){
if (endstr == -1)
	endstr = document.cookie.length;
return unescape(document.cookie.substring(offset, endstr))
}
}

function GetCookie(name){
var arg = name + "=";
var alen = arg.length;
var clen = document.cookie.length;
var i = 0;
while (i < clen){
	var j = i + alen;
	if (document.cookie.substring(i, j) == arg){
		return getCookieVal (j);
		}
	i = document.cookie.indexOf(" ", i) + 1;
	if (i == 0) break;
	}
	return null;
}

function SetCook(name,value){
	var exp = new Date();
	exp.setTime (exp.getTime() + (1000*60*60*24*720));
	document.cookie = name + "="+ escape(value) + "; expires=" + exp.toGMTString() ;
//alert(name + "="+ value + "; expires=" + exp.toGMTString())
}


function setFontSize(sizeAD, oIncDec){
var fs = document.body.style.fontSize;
var oCtls = document.getElementsByClassName('divFont');

for (i = 0; i < oCtls.length; i++) {
	oCtls[i].style.color = "#efe";
}
if (sizeAD){
	fs = eval(fs.replace("em", "")) + sizeAD; 
	if (sizeAD > 0){
		if (fs >= 2){
			fs = 2;
			if (oIncDec)
				oIncDec.style.color = "#555";
		}
	}
	if (sizeAD < 0){
		if (fs <= 0.8){
			fs = 0.8;
			if (oIncDec)
				oIncDec.style.color = "#555";
		}
	}
	document.body.style.fontSize = fs + "em";
	//SetCook( "_fontSize", fs + "em");
}else{
	setLanguage();
	fs = GetCookie( "_fontSize");
	if (!fs || fs == ""){
		fs = document.body.style.fontSize;
		if (fs == "")
			fs = "1em";
	}
	document.body.style.fontSize = fs;
	var pageZone = document.getElementById('pageZone');
	if (pageZone)
		pageZone.style.visibility = "visible";
}
}



//The fadeOut function uses a Timeout to call itself every 100ms with an object Id and an opacity. The opacity is specified as a percentage and decreased 10% at a time. The loop stops once the opacity reaches 100%:

function fadeOut(objId,opacity) {
  if (document.getElementById) {
    obj = document.getElementById(objId);
    if (opacity >= 0) {
      setOpacity(obj, opacity);
      opacity -= 10;
      window.setTimeout("fadeOut('"+objId+"',"+opacity+")", 100);
	} else {
	obj.style.visibility = 'hidden';
	setOpacity(obj, 100);
    }
  }
}

//The setOpacity function is passed an object and an opacity value. It then sets the opacity of the supplied object using four proprietary ways. It also prevents a flicker in Firefox caused when opacity is set to 100%, by setting the value to 99.999% instead.

function setOpacity(obj, opacity) {
  opacity = (opacity == 0)?0.009:opacity;
  
  // IE/Win
  obj.style.filter = "alpha(opacity:"+opacity+")";
  
  // Safari<1.2, Konqueror
  obj.style.KHTMLOpacity = opacity/100;
  
  // Older Mozilla and Firefox
  obj.style.MozOpacity = opacity/100;
  
  // Safari 1.2, newer Firefox and Mozilla, CSS3
  obj.style.opacity = opacity/100;
}

function posY(obj) {                       
var p = posObj(obj);             
//alert("X:" + p.x + " Y:" + p.y); 
return p.y;
}

function posX(obj) {                       
var p = posObj(obj);             
//alert("X:" + p.x + " Y:" + p.y); 
return p.x;
}

function posObj(htmlelement){

var e = htmlelement; 
var offset = {x:0,y:0}; 
while (e) 
{ 
    offset.x += e.offsetLeft; 
    offset.y += e.offsetTop; 
    e = e.offsetParent; 
} 
return (offset);
}

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) )
    {
        _x += el.offsetLeft - el.scrollLeft + el.clientLeft;
        _y += el.offsetTop - el.scrollTop + el.clientTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function adjustScreen(hauteurUtil){
	var divMap, dispH, pxRatio
	
	pxRatio = 1;
	if( window.devicePixelRatio )
		pxRatio = window.devicePixelRatio;
		
	dispH = document.getElementsByTagName('body')[0].clientHeight - (hauteurUtil * pxRatio);
	divMap = document.getElementById("map_canvas");
	divMap.style.height = dispH + "px";
	//alert(dispH);

}

function zoomMap(p_m){
var mapZoom = map.getZoom();

map.setZoom(mapZoom + p_m);

}

function setHole(map, location) {
  var image = {url:'images/flag.png',
			size: new google.maps.Size(50, 50),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(5, 20)};
  var shape = {
      coord: [1, 1, 50, 50],
      type: 'rect'
  };
    holeMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon: image,
		draggable: true,
        shape: shape
		});
	//holeMarker.position_changed = holePosChange;
};

function validEmail(email){
	var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	var valid = emailReg.test(email);
	if(valid) 
        return true;
     else 
    	return false;
}

var langLbl = [];
function initLang(){
var lang = window.navigator.userLanguage || window.navigator.language;
var l = "EN";
if (lang.toUpperCase().indexOf("FR") != -1)
	l = "FR";
if (lang.toUpperCase().indexOf("ES") != -1)
	l = "ES";
	switch (l) {
	  case "FR":
		langLbl["title"] = "Golfs du Qu&eacute;bec";
		langLbl["motcl"] = "Mot cl&eacute;";
		langLbl["clubn"] = "Nom club";
		langLbl["clubc"] = "Ville";
		langLbl["regio"] = "R&eacute;gion";
		langLbl["toute"] = "Toutes";
		langLbl["proxi"] = "Proximit&eacute;";
		langLbl["posta"] = "Code postal";
		langLbl["locat"] = "Localisation";
		langLbl["local"] = "Localiser";
		langLbl["loca."] = "Localise";
		langLbl["searc"] = "Rechercher";
		langLbl["prefe"] = "Pr&eacute;f&eacute;rences";
		langLbl["ident"] = "Identit&eacute;";
		langLbl["_okok"] = "Ok";
		langLbl["_canc"] = "Annuler";
		langLbl["small"] = "Petite";
		langLbl["middl"] = "Moyenne";
		langLbl["large"] = "Grande";
		langLbl["psize"] = "Taille de police";
		langLbl["ldela"] = "D&eacute;lai de localisation";
		langLbl["pplay"] = "Mes parties";
		langLbl["macco"] = "Mon compte";
		langLbl["niden"] = "Nouvelle identification";
		langLbl["email"] = "Courriel";
		langLbl["uname"] = "Nom";
		langLbl["passw"] = "Mot de passe";
		langLbl["npass"] = "Nouveau mot de passe";
		langLbl["cpass"] = "Confirmer mot de passe";
		langLbl["M0001"] = "Le mot de passe actuel est requis.";
		langLbl["M0002"] = "Le mot de passe doit comprendre au moins 3 caractères.";
		langLbl["M0003"] = "La confirmation du nouveau mot de passe n'est pas valide.";
		langLbl["M0004"] = "Utilisateur ou mot de passe non valide.";
		langLbl["M0005"] = "Mot de passe oublié? \n\rVoulez-vous récupérer votre mot de passe par courriel?";
		langLbl["M0006"] = "Vous devez permettre l'utilisation des Cookies pour configurer vos pr&eacute;f&eacute;rences.";
		langLbl["M0007"] = "Choisir une distance pour le code postal.";
		langLbl["M0008"] = "Code postal non retrouv&eacute; : ";
		langLbl["M0009"] = "L'adresse de courriel n'est pas valide.";
		langLbl["searc"] = "Recherche";
		langLbl["load"] = "Chargement";
		langLbl["mlist"] = "Liste";
		langLbl["mmaps"] = "Carte";
		langLbl["close"] = "Fermer";
		langLbl["direc"] = "Trajet";
		langLbl["bplay"] = "Jouer";
		langLbl["holes"] = "&nbsp;trous";
		langLbl["since"] = "&nbsp;depuis&nbsp;";
		langLbl["ccpar"] = ",&nbsp;normale&nbsp;";
		langLbl["cyard"] = "&nbsp;verges&nbsp;&nbsp;";
		langLbl["cours"] = "Parcours&nbsp;:&nbsp;";
		langLbl["medit"] = "&Eacute;diter";
		langLbl["mcent"] = "Centrer";
		langLbl["S0050"] = "Ce compte existe et est inactif. \r\nCourriel de confirmation envoyé à : %1 .\r\nVeuillez confirmer l'inscription de ce compte par le lien dans le courriel.";  //" + email + "
		langLbl["S0051"] = "Ce compte existe et est inactif avec un mot de passe différent";
		//langLbl["S0053"] = "Le compte %1 est d&eacute;j&agrave; actif.";  //" + doc.ops[0].courriel + "
		langLbl["S0052"] = "Courriel de confirmation envoyé à : %1.\r\nVeuillez confirmer votre inscription par le lien dans le courriel.";  //" + doc.ops[0].courriel + "
		langLbl["S0054"] = "Courriel de récupération du mot de passe envoyé à : %1"; //+ email
		langLbl["S0055"] = "Il n'existe aucun compte avec l'adresse de courriel : %1"; // + email
		langLbl["S0056"] = "Un compte utilise déjà cette adresse courriel.";
		langLbl["S0057"] = "Utilisateur inexistant.";
		langLbl["S0058"] = "Ce compte existe déjà.";
		langLbl["S0059"] = "Mote de passe actuel incorrect.";
			break;
	  default:
		langLbl["title"] = "Quebec's Golfs";
		langLbl["motcl"] = "Key Word";
		langLbl["clubn"] = "Club name";
		langLbl["clubc"] = "City";
		langLbl["regio"] = "Country";
		langLbl["toute"] = "All";
		langLbl["proxi"] = "Proximity";
		langLbl["posta"] = "Postal Code";
		langLbl["locat"] = "Location";
		langLbl["local"] = "Locate";
		langLbl["loca."] = "Locate";
		langLbl["searc"] = "Search";
		langLbl["prefe"] = "Preferences";
		langLbl["ident"] = "Identity";
		langLbl["_okok"] = "Ok";
		langLbl["_canc"] = "Cancel";
		langLbl["small"] = "Small";
		langLbl["middl"] = "Middle";
		langLbl["large"] = "Large";
		langLbl["psize"] = "Font size";
		langLbl["ldela"] = "Locate delay";
		langLbl["pplay"] = "My games";
		langLbl["macco"] = "My account";
		langLbl["niden"] = "New account";
		langLbl["email"] = "E-mail";
		langLbl["uname"] = "Name";
		langLbl["passw"] = "Password";
		langLbl["npass"] = "New password";
		langLbl["cpass"] = "Valid Password"
		langLbl["M0001"] = "The current password is required.";
		langLbl["M0002"] = "The password must be at least 3 characters long.";
		langLbl["M0003"] = "The confirmation of the new password is invalid.";
		langLbl["M0004"] = "Invalid user or password.";
		langLbl["M0005"] = "Forgotten password? \n\rDo you want to recover your password by email?";
		langLbl["M0006"] = "You must allow the use of cookies to configure your preferences.";
		langLbl["M0007"] = "Choose a distance for the postal code.";
		langLbl["M0008"] = "Postal code not found :";
		langLbl["M0009"] = "The email address is invalid.";
		langLbl["searc"] = "Searching";
		langLbl["load"] = "Loading";
		langLbl["mlist"] = "List";
		langLbl["mmaps"] = "Map";
		langLbl["close"] = "Close";
		langLbl["direc"] = "Direction";
		langLbl["bplay"] = "Play";
		langLbl["holes"] = "&nbsp;holes";
		langLbl["since"] = "&nbsp;since&nbsp;";
		langLbl["ccpar"] = ",&nbsp;par&nbsp;";
		langLbl["cyard"] = "&nbsp;yards&nbsp;&nbsp;";
		langLbl["cours"] = "Course&nbsp;:&nbsp;";
		langLbl["medit"] = "Edit";
		langLbl["mcent"] = "Center";
		langLbl["S0050"] = "This account exists and is inactive. Email confirmation sent to: %1. \r\nPlease confirm the registration of this account by the link in the email.";
		langLbl["S0051"] = "This account exists and is inactive with a different password.";
		langLbl["S0052"] = "Email confirmation sent to %1. \r\nPlease confirm your registration through the link in the email.";
		langLbl["S0054"] = "Password recovery email sent to: %1.";
		langLbl["S0055"] = "There is no account with the email address: %1." ;
		langLbl["S0056"] = "An account already uses this email address.";
		langLbl["S0057"] = "User does not exist.";
		langLbl["S0058"] = "This account already exists.";
		langLbl["S0059"] = "Incorrect current password.";
		break;
	}
}

function setLanguage(){
var otextColl = document.getElementsByTagName("text");	
var oinputColl = document.getElementsByTagName("input");
initLang();
for (var i = 0; i < otextColl.length; i++) {
	initText(otextColl[i])
}
for (var i = 0; i < oinputColl.length; i++) {
	if (oinputColl[i].value.indexOf("_") == 0){
		oinputColl[i].value = langLbl[oinputColl[i].value];
	}
}
}

function initText(oText){
var textId = oText.id;
textId = textId.substring(0, 5);
if (langLbl[textId])
	oText.innerHTML = langLbl[textId] ;
else	
	alert("Miss: " + textId);
}

// -->