
var HOSTserv = "https://pytgolf-cd-serv.1d35.starter-us-east-1.openshiftapps.com/"; // Openshift mon_golf34
// "http://127.0.0.1:3000/";		//Portable Windows 10 Local host Node JS v6.10.0
// "http://192.168.2.195:3000/";    //Ubuntu workstation 16.04
// "http://192.168.2.195:8080/";    //Ubuntu workstation 16.04 docker 1.12.6 Node JS v4.2.3  MongoDB server v3.4.9
// "http://192.168.2.190:8080/";    //Fedora workstation 26 Mongo 3.2.16 docker 1.13.1 Node JS v4.2.3 MongoDB server v3.4.6
// "https://nodegolf-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";  // Openshift mon_golf34
// "https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";  // Openshift default docker Node Js -v 6.11.3
// "https://cdore.ddns.net/node/";  // VULTR Ubuntu Server 16.04 docker Node Js -v 6.11.3
// "https://cdore.ddns.net/pyt/";  // VULTR Ubuntu Server 16.04 docker Python 3.6.4

var progressBar, langSet;
var THCall = "POST";
var tryLog = 0;

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

var isTouchDevice = is_touch_device();

function getInfo(path, callback){
var dat = new FormData();
dat.append('info', path);

var xhr=new XMLHttpRequest();
  xhr.onloadend = function() {
    var text = xhr.responseText;
	if (text == "")
		affNoRep();
	var data=JSON.parse(text);
	if (callback)
		callback(data);
  };
xhr.open(THCall, HOSTserv + path ,true);
//xhr.withCredentials = true;
xhr.send(dat);

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
if (sizeAD && typeof sizeAD == "number"){
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
	if (!sizeAD){
		setLanguage();
		fs = GetCookie( "_fontSize");
		if (!fs || fs == ""){
			fs = document.body.style.fontSize;
			if (fs == ""){
				fs = "1.4em";
				SetCook("_fontSize",fs);
			}
		}
	}else{
		fs = sizeAD;
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

function showProgress(init){
if (init)
	progressBar.value = init;
else
	progressBar.value += 0.005;

if (progressBar.value <= 0.9){
	setTimeout("showProgress()", 10);
	}
if (progressBar.value >= 1){
	var chargement = document.getElementById('chargement');
	chargement.style.display = "none";
	}
}

function authentif(){
var formAuth = document.getElementById('formAuth');
var userCour = formAuth.nameUser.value;
var userPass = formAuth.passwordUser.value;
getInfo("identUser?user=" + userCour + "&pass=" + userPass, validUser);
}

function validUser(rep){
var formAuth = document.getElementById('formAuth');
var userCour = formAuth.nameUser.value;
if (rep.resp.result){
	var modalDiv = document.getElementById('modalDiv');
	var identLayer = document.getElementById('identLayer');
	var authLayer = document.getElementById('authLayer');
	modalDiv.style.visibility="hidden";
	authLayer.style.visibility="hidden";
	identLayer.style.display="none";
	SetCook("userID",rep.resp.user._id + "");
	SetCook("userName",rep.resp.user.Nom);
	SetCook("userMail",rep.resp.user.courriel);
	SetCook("userRole",rep.resp.user.niveau);
	userId = rep.resp.user._id;
	userName = rep.resp.user.Nom;

}else{
	userId = null;
	setIdent();
	DelCookie("userID");
	alert(langLbl["M0004"]);
	tryLog++;
	if (tryLog > 2){
		if (confirm(langLbl["M0005"])) {
			getInfo("getPass?data=" + formAuth.nameUser.value , repMailPass);
		}
	}
}
	identified();
}

function repMailPass(oRep){
var formAuth = document.getElementById('formAuth');
var mess = langLbl[oRep.message];
	alert(mess.replace("%1", formAuth.nameUser.value));
}


function authentifier(){
var authLayer = document.getElementById('authLayer');
var userMail = GetCookie("userMail");

var xmlhttp = new XMLHttpRequest();
  xmlhttp.onloadend = function() {
    authLayer.innerHTML = xmlhttp.responseText;
	  setLanguage();
	  if (userMail){
		 var nameUser = document.getElementById('nameUser');
		 nameUser.value = userMail;
	  }
	 authLayer.style.visibility="visible";
  }

xmlhttp.open("GET","authentifier.html",false);
xmlhttp.send();

}

function closeAuthent(){
	var modalDiv = document.getElementById('modalDiv');
	var authLayer = document.getElementById('authLayer');
	var identLayer = document.getElementById('identLayer');
	
	modalDiv.style.visibility="hidden";
	authLayer.style.visibility="hidden";
	identLayer.style.visibility="hidden";
}


var langLbl = [];
function initLang(){
progressBar = document.getElementById("progressQ");
if (progressBar)
	showProgress(0);

var langP = GetCookie("langP");
var langSet = "EN", lang = "";

if (!langP || langP == "0")
	lang = window.navigator.userLanguage || window.navigator.language;

if ((langP && langP == "2") || lang.toUpperCase().indexOf("FR") != -1)
	langSet = "FR";
if ((langP && langP == "3") || lang.toUpperCase().indexOf("ES") != -1)
	langSet = "ES";

	switch (langSet) {
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
		langLbl["_next"] = "Parties suivantes";
		langLbl["langu"] = "Langue";
		langLbl["defau"] = "D&eacute;faut";
		langLbl["small"] = "Petite";
		langLbl["middl"] = "Moyenne";
		langLbl["large"] = "Grande";
		langLbl["psize"] = "Taille de police";
		langLbl["ldela"] = "D&eacute;lai de localisation";
		langLbl["pplay"] = "Mes parties";
		langLbl["macco"] = "Mon compte";
		langLbl["niden"] = "Nouvelle identification";
		langLbl["aiden"] = "Authentification";
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
		langLbl["M0010"] = "Supprimer cette partie?";
		langLbl["I0001"] = "&nbsp;&#224; moins de ";
		langLbl["I0002"] = "&nbsp;kilom&#232;tres du code postal &#171;&nbsp;";
		langLbl["I0003"] = "&nbsp;dans la r&eacute;gion &#171;";
		langLbl["I00ET"] = "&nbsp;ET";
		langLbl["Iou00"] = "o&#249; &#171;";
		langLbl["I0004"] = "&#187; est contenu dans le ";
		langLbl["I0005"] = "&nbsp;ou le nom de la ville du club ";
		langLbl["I0006"] = "&nbsp;le nom de la ville du club ";
		langLbl["I0007"] = " nom du club de golf";
		
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
		langLbl["cyard"] = " verges&nbsp;&nbsp;";
		langLbl["cours"] = "Parcours&nbsp;:&nbsp;";
		langLbl["detai"] = "D&eacute;tail";
		langLbl["modio"] = "Modifier l'origine";
		langLbl["modid"] = "Modifier la destination";
		langLbl["medit"] = "&Eacute;diter";
		langLbl["mcent"] = "Centrer";
		langLbl["mrefr"] = "Actualiser";
		langLbl["mopti"] = "Options";
		langLbl["mdown"] = "T&eacute;l&eacute;charger";
		langLbl["mWatc"] = "Suivre";
		langLbl["mLoca"] = "Rep&eacute;rer";
		langLbl["mFoll"] = "Continue";
		langLbl["mSpea"] = "Parler";
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
		langLbl["S0060"] = "Vous devez vous authentifier pour terminer la partie.";
		langLbl["S0061"] = "Vous devez vous authentifier pour supprimer la partie.";
		
		langLbl["Bleu"] = "Bleu";
		langLbl["Hdcp"] = "Hdcp";
		langLbl["Rouge"] = "Rouge";
		langLbl["Normale"] = "Normale";
		langLbl["Orange"] = "Orange";
		langLbl["Blanc"] = "Blanc";
		langLbl["Or"] = "Or";
		langLbl["Vert"] = "Vert";
		langLbl["Jaune"] = "Jaune";
		langLbl["Noir"] = "Noir";
		langLbl["Bronze"] = "Bronze";
		langLbl["Argent"] = "Argent";
		langLbl["Cuivre"] = "Cuivre";
		langLbl["Gris"] = "Gris";
		langLbl["Rose"] = "Rose";
		langLbl["hole"] = "Trou";
		langLbl["goout"] = "Aller";
		langLbl["goin"] = "Retour";
			break;
	  case "ES":
		langLbl["title"] = "Golfs de Quebec";
		langLbl["motcl"] = "Palabra clave";
		langLbl["clubn"] = "Nombre del club";
		langLbl["clubc"] = "Ciudad";
		langLbl["regio"] = "Regi&oacute;n";
		langLbl["toute"] = "Todas";
		langLbl["proxi"] = "Proximidad";
		langLbl["posta"] = "C&oacute;digo postal";
		langLbl["locat"] = "Ubicación";
		langLbl["local"] = "Localizar";
		langLbl["loca."] = "Localiza";
		langLbl["searc"] = "Buscar";
		langLbl["prefe"] = "Preferencias";
		langLbl["ident"] = "Identidad";
		langLbl["_okok"] = "Ok";
		langLbl["_canc"] = "Cancelar";
		langLbl["_next"] = "Nexts juegos";
		langLbl["langu"] = "Idioma";
		langLbl["defau"] = "Defecto";
		langLbl["small"] = "Pequeña";
		langLbl["middl"] = "Medio";
		langLbl["large"] = "Grande";
		langLbl["psize"] = "Tamaño de fuente";
		langLbl["ldela"] = "Localizar demora";
		langLbl["pplay"] = "Mis juegos";
		langLbl["macco"] = "Mi cuenta";
		langLbl["niden"] = "Nueva cuenta";
		langLbl["aiden"] = "Autenticaci&oacute;n";
		langLbl["email"] = "Correo electr&oacute;nico";
		langLbl["uname"] = "Nombre";
		langLbl["passw"] = "Contraseña";
		langLbl["npass"] = "Nueva contraseña";
		langLbl["cpass"] = "Contraseña válida"
		langLbl["M0001"] = "Se requiere la contraseña actual.";
		langLbl["M0002"] = "La contraseña debe tener al menos 3 caracteres.";
		langLbl["M0003"] = "La confirmación de la nueva contraseña no es válida.";
		langLbl["M0004"] = "Usuario o contraseña no válidos.";
		langLbl["M0005"] = "¿Contraseña olvidada? \n\r¿Quiere recuperar su contraseña por correo electrónico?";
		langLbl["M0006"] = "Debe permitir el uso de cookies para configurar sus preferencias.";
		langLbl["M0007"] = "Elija una distancia para el c&oacute;digo postal.";
		langLbl["M0008"] = "Código postal no encontrado:";
		langLbl["M0009"] = "La dirección de correo electrónico es inválida.";
		langLbl["M0010"] = "¿Eliminar esa puntuación?";
		langLbl["I0001"] = "&nbsp;a menos de ";
		langLbl["I0002"] = "&nbsp;kil&oacute;metros del c&oacute;digo postal&nbsp;&#171;&nbsp;";
		langLbl["I0003"] = "&nbsp;en la regi&oacute;n &#171;";
		langLbl["I00ET"] = "&nbsp;ET";
		langLbl["Iou00"] = "donde &#171;";
		langLbl["I0004"] = "&#187; figura en el ";
		langLbl["I0005"] = "&nbsp;o en el nombre de la ciudad del club ";
		langLbl["I0006"] = "&nbsp;el nombre de la ciudad del club ";
		langLbl["I0007"] = " nombre del club de golf";
	
		langLbl["searc"] = "Buscando";
		langLbl["load"] = "Cargando";
		langLbl["mlist"] = "Lista";
		langLbl["mmaps"] = "Mapa";
		langLbl["close"] = "Cerca";
		langLbl["direc"] = "Direcci&oacute;n";
		langLbl["bplay"] = "Jugar";
		langLbl["holes"] = "&nbsp;agujeros";
		langLbl["since"] = "&nbsp;ya que&nbsp;";
		langLbl["ccpar"] = ",&nbsp;par&nbsp;";
		langLbl["cyard"] = " yardas&nbsp;&nbsp;";
		langLbl["cours"] = "Campo&nbsp;:&nbsp;";
		langLbl["detai"] = "Detalle";
		langLbl["modio"] = "Cambio origen";
		langLbl["modid"] = "Cambiar destino";
		langLbl["medit"] = "Editar";
		langLbl["mcent"] = "Centrar";
		langLbl["mrefr"] = "Refrescar";
		langLbl["mopti"] = "Opciones";
		langLbl["mdown"] = "Descargar";
		langLbl["mWatc"] = "Sigue";
		langLbl["mLoca"] = "Localizar";
		langLbl["mFoll"] = "Seguir";
		langLbl["mSpea"] = "Hablar";
		langLbl["S0050"] = "Esta cuenta existe y está inactiva. Se envió una confirmación de correo electrónico a: %1. \ r \ nPor favor, confirme el registro de esta cuenta por el enlace en el correo electrónico.";
		langLbl["S0051"] = "Esta cuenta existe y está inactiva con una contraseña diferente.";
		langLbl["S0052"] = "Se envió una confirmación de correo electrónico a %1. \ r \ nPor favor, confirme su registro a través del enlace en el correo electrónico.";
		langLbl["S0054"] = "Correo electrónico de recuperación de contraseña enviado a : %1.";
		langLbl["S0055"] = "No hay cuenta con la dirección de correo electrónico: %1." ;
		langLbl["S0056"] = "Una cuenta ya utiliza esta dirección de correo electrónico.";
		langLbl["S0057"] = "El usuario no existe.";
		langLbl["S0058"] = "Esta cuenta ya existe.";
		langLbl["S0059"] = "Contraseña actual incorrecta.";
		langLbl["S0060"] = "Debes autenticarte para completar el juego.";
		langLbl["S0061"] = "Debes autenticarte para eliminar el juego.";
		
		langLbl["Bleu"] = "Azul";
		langLbl["Hdcp"] = "Hdcp";
		langLbl["Rouge"] = "Rojo";
		langLbl["Normale"] = "Par";
		langLbl["Orange"] = "Naranja";
		langLbl["Blanc"] = "Blanco";
		langLbl["Or"] = "Oro";
		langLbl["Vert"] = "Verde";
		langLbl["Jaune"] = "Amarillo";
		langLbl["Noir"] = "Negro";
		langLbl["Bronze"] = "Bronce";
		langLbl["Argent"] = "Plata";
		langLbl["Cuivre"] = "Cobre";
		langLbl["Gris"] = "Gris";
		langLbl["Rose"] = "Rosado";
		langLbl["hole"] = "Agujero";
		langLbl["goout"] = "Out";
		langLbl["goin"] = "In";
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
		langLbl["_next"] = "Nexts games";
		langLbl["langu"] = "Language";
		langLbl["defau"] = "Default";
		langLbl["small"] = "Small";
		langLbl["middl"] = "Middle";
		langLbl["large"] = "Large";
		langLbl["psize"] = "Font size";
		langLbl["ldela"] = "Locate delay";
		langLbl["pplay"] = "My games";
		langLbl["macco"] = "My account";
		langLbl["niden"] = "New account";
		langLbl["aiden"] = "Authentication";
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
		langLbl["M0010"] = "Delete that score?";
		langLbl["I0001"] = "&nbsp;within ";
		langLbl["I0002"] = "&nbsp;kilometers of the postal code &#171;&nbsp;";		
		langLbl["I0003"] = "&nbsp;in the region &#171;";
		langLbl["I00ET"] = "&nbsp;AND";
		langLbl["Iou00"] = "where &#171;";
		langLbl["I0004"] = "&#187; is contained in the ";
		langLbl["I0005"] = "&nbsp;or the name of the city of the club ";
		langLbl["I0006"] = "&nbsp;the name of the city of the club ";
		langLbl["I0007"] = " name of the golf club";

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
		langLbl["cyard"] = " yards&nbsp;&nbsp;";
		langLbl["cours"] = "Course&nbsp;:&nbsp;";
		langLbl["detai"] = "Detail";
		langLbl["modio"] = "Change origin";
		langLbl["modid"] = "Change destination";
		langLbl["medit"] = "Edit";
		langLbl["mcent"] = "Center";
		langLbl["mrefr"] = "Refresh";
		langLbl["mopti"] = "Options";
		langLbl["mdown"] = "Download";
		langLbl["mWatc"] = "Watch";
		langLbl["mLoca"] = "Locate";
		langLbl["mFoll"] = "Follow";
		langLbl["mSpea"] = "Speak";
		langLbl["S0050"] = "This account exists and is inactive. Email confirmation sent to: %1. \r\nPlease confirm the registration of this account by the link in the email.";
		langLbl["S0051"] = "This account exists and is inactive with a different password.";
		langLbl["S0052"] = "Email confirmation sent to %1. \r\nPlease confirm your registration through the link in the email.";
		langLbl["S0054"] = "Password recovery email sent to: %1.";
		langLbl["S0055"] = "There is no account with the email address: %1." ;
		langLbl["S0056"] = "An account already uses this email address.";
		langLbl["S0057"] = "User does not exist.";
		langLbl["S0058"] = "This account already exists.";
		langLbl["S0059"] = "Incorrect current password.";
		langLbl["S0060"] = "You must authenticate to complete the game.";
		langLbl["S0061"] = "You must authenticate to remove the game.";
		
		langLbl["Bleu"] = "Blue";
		langLbl["Hdcp"] = "Hdcp";
		langLbl["Rouge"] = "Red";
		langLbl["Normale"] = "Par";
		langLbl["Orange"] = "Orange";
		langLbl["Blanc"] = "White";
		langLbl["Or"] = "Gold";
		langLbl["Vert"] = "Green";
		langLbl["Jaune"] = "Yellow";
		langLbl["Noir"] = "Black";
		langLbl["Bronze"] = "Bronze";
		langLbl["Argent"] = "Silver";
		langLbl["Cuivre"] = "Copper";
		langLbl["Gris"] = "Grey";
		langLbl["Rose"] = "Pink";
		langLbl["hole"] = "Hole";
		langLbl["goout"] = "Out";
		langLbl["goin"] = "In";
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
