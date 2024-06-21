"use strict";

var userId = "";
var clubID = "";
var clubName = "";
var userName = "";

function logIn(){
document.getElementById('modalDiv').style.visibility="visible";
document.getElementById('authLayer').style.visibility="visible";
}

function afficheMessage(message, sev){
document.getElementById('messageZone').className = '';
var iconCar = "";
if (!message)
	message = '';
else
	iconCar = '❌ ';
if (sev && sev == 'A')
	iconCar = '❗ ';
if (sev && sev == 'I'){
	document.getElementById('messageZone').classList.add('messInfo');
	iconCar = '✅ ';
}else{
	document.getElementById('messageZone').classList.add('messError');
	}
document.getElementById('messageZone').innerHTML = iconCar + message;
}


function popDtPicker(oTxtDt){
if (!window.dtPicker){
	window.dtPicker = new Datepicker(document.getElementById(oTxtDt));
	//window.dtPicker.config({format: d => {return getDateTime(d)}});
}
window.dtPicker.show(document.getElementById(oTxtDt));
//window.dtPicker.show();
}


function closePref(){
var modLayer = document.getElementById('modalDiv');
var authLayer = document.getElementById('authLayer');
var identLayer = document.getElementById('identLayer');
if (identLayer)
	identLayer.style.display="none";
authLayer.style.visibility="hidden";
modLayer.style.visibility="hidden";
setFontSize();
}

function identified(){
afficheMessage();
userName = GetCookie("userName");
document.getElementById('username').innerHTML = (userName) ? userName:"";
var userClub = JSON.parse(localStorage.getItem("userClub"));
const valClub = (userClub) ? userClub._id:"";
if (valClub == eval(clubID)){
	clubName = (userClub) ? userClub.nom:"";
	document.getElementById('pageTitle').innerHTML = clubName ;
}else{
	document.getElementById('username').innerHTML = "Non connecté.";
	resetAll();
	if (userName)
		afficheMessage(userName + " non authentifié au club.");
}
return false;
}


class objAES {
	#infoAES;
	#key;
	#keyServ;
	#genStr;
  constructor() {
	  window.oAES = this;
	  this.#key = "123";
	  this.callback = null;
	  this.#infoAES = {
		"type" : "Encryption",
		"editor" : "cdnjs.cloudflare.com",
		"version" : "4.1.1",
		"expir" : 0
	  }
	 //Generate key
	 function genString(lng){
		var length = 16; // Longueur de la chaîne de caractères aléatoire
		if (lng)
			length = lng;
		var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Caractères autorisés
		var randomString = "";
		for (var i = 0; i < length; i++) {
			var randomIndex = Math.floor(Math.random() * charset.length);
			randomString += charset.charAt(randomIndex);
		}
		return randomString;
	}
		this.#key = genString();
		this.#genStr = genString;
		
   (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
	 //js.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
	 js.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js";
	 //js.src = "https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'AES-sdk'));  
  
  
  } // FIN Constructor
  
	
	encrypt(textToEncrypt){	
		return CryptoJS.AES.encrypt(textToEncrypt, this.#key).toString();  
	}

	decrypt(textToDecrypt){	
		return CryptoJS.AES.decrypt(textToDecrypt, this.#key).toString(CryptoJS.enc.Utf8);  
	} 

	decryptB(encryptedText) {
			
		// Decode base64
		var encryptedData = CryptoJS.enc.Base64.parse(encryptedText);

		// Split IV and encrypted text
		var iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
		var encrypted = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4));

		// Décrypt
		var decrypted = CryptoJS.AES.decrypt({ciphertext: encrypted}, CryptoJS.enc.Utf8.parse(this.#keyServ), {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});

		return decrypted.toString(CryptoJS.enc.Utf8);
	}

	setInfo(k){
		this.#keyServ = k;
	}
	
	getString(){
		this.#keyServ = this.#genStr(32);
		this.#keyServ = this.#keyServ.padEnd(32).substring(0, 32);
		return this.#keyServ;
	}
	
}   // FIN class objAES


// Search and select in list Box
class objFindBox {
	#callback;
	#oFBdiv;
	#inputCtrl;
	#minToFind;
	#FBstyles;
	#elemList;
	#convList;
	#elemFnd;	
	#convert;
	#isEncrypt
  constructor(callback, minToFind, encrypt) {
	window.oFindBox = this;

	this.#minToFind = 3;	// default caracter number minimum to finfing
	if (callback)
		this.#callback = callback;  // required to return selected information
	if (minToFind)
		this.#minToFind = minToFind;	
	this.#isEncrypt = encrypt;
	this.#FBstyles = "#FBfindList{height: 80%;}#findListFormZone{margin: 10px;}#findListBox{position: absolute;text-align: center;top: 50%;    left: 50%;    transform: translate(-50%, -50%);border: 1px solid;width: 300px;height: 50%;background: #f0f0f0;border-radius: 5px;display: none;z-index: 2000;}#FBelemList{text-align: left;list-style: none;text-decoration: none;overflow-y: scroll;border: buttonhighlight 2px inset;margin: 10px;height: 100%;padding: 5px;}#FBelemList  li:hover, li:focus {color: #a00;background: #ccc;cursor:pointer;}#findListFormZone  span:hover, span:focus {color: #a00;background: #ccc;}#closeFindBox{position: absolute;right: 0;top: 0;border: buttonhighlight 2px outset;}.findBoxXctrl{padding: 3px;cursor:pointer;margin-left: 2px;}.findBoxXctrl span:hover, span:focus {color: #a00;background: #ccc;}";

	function convertList(elem){
		const C_WA = "àâäôóéèëêïîçùûüÿ";
		const C_NA = "aaaooeeeeiicuuuy";
		var cl = [];
		function repAcc(txt){
			var str = Array.from(txt.toLowerCase());
			let repl = str.map(function(str) {
				const ind = C_WA.indexOf(str);
				return (ind > -1) ? C_NA[ind]:str;
			});
			return repl.join(""); 
			}
		
		if (elem){
			return repAcc(elem);
		}else{
			var elemList = this.#elemList;
			for (var el in elemList){
				if (this.#isEncrypt)
					cl[el] = repAcc(oAES.decryptB(elemList[el][0]));
				else
					cl[el] = repAcc(elemList[el][0]);
			}
			return cl;
		}
	}

	this.#convert = convertList;

  } // FIN Constructor


	getElem(id){
		this.hide(id);
	}
	
	findElem(){

		var filter = this.#inputCtrl.value.toLowerCase();
		if (filter.length < this.#minToFind)
			return;
		
		filter = this.#convert(filter);
		var ul = this.#elemFnd;
		this.#clearList();

		for (var i = 0; i < this.#elemList.length; i++) {
			var ele = this.#convList[i];
			if (ele.indexOf(filter) != -1){
			   var li1 = document.createElement("li");
			   li1.setAttribute('onclick', 'window.oFindBox.getElem(' + i + ')');
			   li1.innerHTML = oAES.decryptB(this.#elemList[i][0]);
			   ul.appendChild(li1);	
			}
		}
	}  

    show(tmpList){	
		if (tmpList){
			this.#elemList = tmpList;
			//const d1 = performance.now();  //Date.now();
			this.#convList = this.#convert();
			//console.log(performance.now() - d1)
			/*
			var elList = tmpList;

			for (el in tmpList) {
				let encryptArr = tmpList[el].map(function(fld, ind, arr) {
					return oAES.encrypt(fld);
				}, oAES);	
				elList[el] = encryptArr;
			}

			this.#elemList = elList;			
			*/
		}
		if (!this.#oFBdiv)
			this.#createFindBox();
		this.#oFBdiv.style.display = 'inherit';
		this.#inputCtrl.focus();
	}
	
	hide(id){	
		this.#oFBdiv.style.display = 'none';
		var el;
		if (id){
			let decryptArr = this.#elemList[id].map(function(fld) {
				return oAES.decryptB(fld);
			}, oAES);
			el = decryptArr;
		}
		this.#callback(el);
	}
	
	clearInput(){
		this.#inputCtrl.value = "";
		this.#clearList();
		this.#inputCtrl.focus();
	}

	#clearList(){
		var ul = this.#elemFnd;
		while (ul.childNodes.length > 0){
			ul.removeChild(ul.childNodes[0]);
		}	
	}
  
	#createFindBox(){
		var ohead = document.getElementsByTagName('head')[0];
		var oFBstyle = document.createElement('style');
		oFBstyle.innerHTML = this.#FBstyles;
		ohead.appendChild(oFBstyle);
		
		var obody = document.getElementsByTagName('body')[0];
		var oFBdiv = document.createElement('div');
		oFBdiv.setAttribute('id', 'findListBox' );
			var divz = document.createElement('div');
			divz.setAttribute('id', 'findListFormZone' );
				var inp = document.createElement('input');
				inp.setAttribute('id', 'searchMemInput' );	
				inp.setAttribute('type', 'text' );	
				inp.setAttribute('placeholder', 'Rechercher...' );	
				inp.setAttribute('oninput', 'window.oFindBox.findElem()' );	
				this.#inputCtrl = inp;
				divz.appendChild(inp);		
				var spa = document.createElement('span');
				spa.setAttribute('class', 'findBoxXctrl' );
				spa.setAttribute('onclick', 'window.oFindBox.clearInput()' );
				spa.innerHTML = '✖';
				divz.appendChild(spa);
				
				var divc = document.createElement('div');
				divc.setAttribute('id', 'closeFindBox' );
				
					var spac = document.createElement('span');
					spac.setAttribute('class', 'findBoxXctrl' );
					spac.setAttribute('onclick', 'window.oFindBox.hide()' );
					spac.innerHTML = '✖';
					divc.appendChild(spac);
				divz.appendChild(divc);
			oFBdiv.appendChild(divz);

			var divf = document.createElement('div');
			divf.setAttribute('id', 'FBfindList' );	
				var ul = document.createElement('ul');
				ul.setAttribute('id', 'FBelemList' );
				this.#elemFnd = ul;
				divf.appendChild(ul);
			oFBdiv.appendChild(divf);
		obody.appendChild(oFBdiv);
		this.#oFBdiv = oFBdiv;
	}
  

}   // FIN class objFindBox



// Affiche un menu sous l'élément 'obj' avec les options 'itemArr' et rappel la fonction 'callback' avec l'ID de l'option choisi
class objPopMenu {
	#callback;
	#oMenu;
    constructor(obj, itemArr, callback) {
                 window.oPopMenu = this;
                 this.#callback = callback;
	   (function(d, h, s, id){
		 var js, fjs = d.getElementsByTagName(h)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
				   js.innerHTML = '.msg-options-menu {position: absolute;z-index: 1005;border-radius: 8px;    overflow: hidden;display:none;background: #ddd;border: 1px solid #aaa;}.msg-options-menu ul {  list-style-type: none;  padding: 0;  margin: 2px;}.msg-options-menu button {  height: 2.5em;  font-size: 0.941rem;  cursor: pointer;  padding: 0.25em 0.5em;}.msg-options-menu button:hover {  background: #ddd;}  #optionsListButton li button{color: #000;background: #ddd;width: 100%;height: 1.8em;text-align: left;    display: inline-block;border: buttonhighlight 2px outset;}#optionsListButton li button:hover, button:focus {color: #a00;background: #ccc;cursor: pointer;}';
		 fjs.appendChild(js);
	   }(document, 'head', 'style', 'popmenu-styles'));  
  
         var bodyobj = document.getElementsByTagName('body')[0];
         var Odiv = document.createElement("div");
         Odiv.setAttribute('id', 'optMenuLayer');
         Odiv.setAttribute('class', 'msg-options-menu');   
            var ul1 = document.createElement("ul"); 
                ul1.setAttribute('id', 'optionsListButton');

		 for(var opt in itemArr){
            var li1 = document.createElement("li");
               var Sdiv = document.createElement("button");
               Sdiv.innerHTML = itemArr[opt];
               Sdiv.setAttribute('onclick', 'oPopMenu.getChx(' + opt + '); return false;');
               li1.appendChild(Sdiv);
            ul1.appendChild(li1);                                      
		  }
		  Odiv.appendChild(ul1);
		  bodyobj.appendChild(Odiv);  
 
	   this.#oMenu = document.getElementById('optMenuLayer');

		function posObj(e){
		var offset = {x:0,y:0}; 
		while (e) 
		{ 
			offset.x += e.offsetLeft; 
			offset.y += e.offsetTop; 
			e = e.offsetParent; 
		} 
		return (offset);
		}
	   
	   const p = posObj(obj); // Parameter object position to show menu
		this.#oMenu.style.left = p.x + "px";
		this.#oMenu.style.top = p.y + obj.offsetHeight + "px";

	   this.#oMenu.style.display = "block"; 
	   
	   document.addEventListener('click', oPopMenu.checkClick);
	   document.hookObj = obj;

  } // FIN Constructor

	getChx(chx){     
	    this.#callback(chx);
		//this.#oMenu.parentNode.removeChild(this.#oMenu);
	}


	checkClick(e){
		if (document.hookObj != e.target ){
			document.removeEventListener('click', oPopMenu.checkClick);
			var optMenu = document.getElementById('optMenuLayer');
			if (optMenu)
				optMenu.parentNode.removeChild(optMenu);
		}
	}

} //FIN Class objPopMenu

function getMenuChx(chx){

}

function showPopMenu(obj){
	var om = new objPopMenu(obj, ["Reservation", "Starting Times"], getMenuChx);
}




