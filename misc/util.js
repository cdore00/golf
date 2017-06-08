<!--

var HOSTserv = "https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

var isTouchDevice = is_touch_device();

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
	pSize = policeSize;
else
	polSize = GetCookie("PolSize");

if (polSize == null || polSize == 0 )
	polSize = "0.9em";

if (pSize == null)
	pSize = polSize;
	
bodyobj.style.fontSize = pSize;
setImgTaille(pSize);
//alert(bodyobj.style.fontSize + "Ok");
}

function changeTaille(){
var bodyobj = document.getElementsByTagName('body')[0];
var policeSize;

//alert(bodyobj.style.fontSize + "polSize=" + polSize);
	
if (bodyobj.style.fontSize=="" || bodyobj.style.fontSize=="0.9em" || bodyobj.style.fontSize=="1em" || bodyobj.style.fontSize=="1.1em"){
	policeSize="1.3em";}
if (bodyobj.style.fontSize=="1.3em"){
	policeSize="1.7em";}
if (bodyobj.style.fontSize=="1.7em"){
	policeSize = "1em";}

setFontSize(policeSize);
SetCook("PolSize",policeSize);
}

function setImgTaille(policeSize){
var imgT = document.getElementById('imgTaille');
var srcImg;

if (imgT){
	switch(policeSize)
		{
		case "0.9em" :
		case "1em" :
		case "1.1em" :
		case "1.2em" :
		  srcImg = img1.src;
		  break;
		case "1.3em" :
		case "1.6em" :
		  srcImg = img2.src;
		  break;
		case "1.7em" :
		case "2em" :
		  srcImg = img3.src;
		  break;
		}
	imgT.src = srcImg;
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

// -->
