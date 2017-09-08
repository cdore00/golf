<!--

var HOSTserv = "https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";
// "http://127.0.0.1:3000/";
// "http://192.168.2.188:8080/";
//"http://127.0.0.1:3000/";
//"https://nodejs-mongo-persistent-cd-serv.1d35.starter-us-east-1.openshiftapps.com/";

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

var isTouchDevice = is_touch_device();

var arrPol = [{"em":"0em", "im": new Image()}, {"em":"0.9em", "im": new Image()}, {"em":"1.2em", "im": new Image()}, {"em":"1.5em", "im": new Image()} ];
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
		divErr.innerHTML = "Pas de réponse";
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
		if (fs >= 2.2){
			fs = 2.2;
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
	fs = GetCookie( "_fontSize");
	if (!fs || fs == ""){
		fs = document.body.style.fontSize;
		if (fs == "")
			fs = "1em";
	}
	document.body.style.fontSize = fs;
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


// -->
