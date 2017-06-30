<!--

var HOSTserv = "http://127.0.0.1:3000/";
//"http://127.0.0.1:3000/";
//"https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

var isTouchDevice = is_touch_device();

var arrPol = [{"em":"0em", "im": new Image()}, {"em":"0.9em", "im": new Image()}, {"em":"1.1em", "im": new Image()}, {"em":"1.3em", "im": new Image()} ];
arrPol[1].im.src = "images/taille.png";
arrPol[2].im.src = "images/taille2.png";
arrPol[3].im.src = "images/taille3.png";

if (document.images) {
	img1 = new Image();
	img2 = new Image();
	img3 = new Image();

	img1.src = "images/taille.png";
	img2.src = "images/taille2.png";
	img3.src = "images/taille3.png";

}

function getInfo(path, callback){
var xhr=new XMLHttpRequest();
  xhr.onloadend = function() {
    var text = xhr.responseText;
	var data=JSON.parse(text);
	if (callback)
		callback(data);
  };
xhr.open("GET", HOSTserv + path ,true);
xhr.send();
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

var polSize;

function setFontSize(policeSize){
var bodyobj = document.getElementsByTagName('body')[0];
var pSize;

if (policeSize)
	pSize = arrPol[policeSize].em;
else{
	try {
		polSize = eval(GetCookie("PolSize"));
	} catch (e) {
		polSize = 1;
	}
}
	
if (polSize == null || polSize == 0 )
	polSize = 1;

if (pSize == null)
	pSize = arrPol[polSize].em;

bodyobj.style.fontSize = pSize;
setImgTaille(polSize);
//alert(bodyobj.style.fontSize + "Ok");
}

function changeTaille(){
var bodyobj = document.getElementsByTagName('body')[0];
var policeSize;

//alert(bodyobj.style.fontSize + "polSize=" + polSize);

if (polSize == 3 ){
	polSize = 1;
	}else{
		if (polSize == 1)
			polSize = 2;
		else{
			if (polSize == 2)
				polSize = 3;
			}
		}
setFontSize(polSize);
SetCook("PolSize",polSize);
}

function setImgTaille(policeSize){
var imgT = document.getElementById('imgTaille');

	if (imgT){
		imgT.src = arrPol[policeSize].im.src;
	}
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


// -->