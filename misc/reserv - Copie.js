
function logIn(){
document.getElementById('modalDiv').style.visibility="visible";
document.getElementById('authLayer').style.visibility="visible";
}

function afficheMessage(message, sev){
document.getElementById('messageZone').className = '';
iconCar = "";
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
document.getElementById('username').innerHTML = GetCookie("userName");
return false;
}


class objAES {
	#infoAES;
	#key;
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
		var length = 16; // Longueur de la chaîne de caractères aléatoire
		var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Caractères autorisés
		var randomString = "";
		for (var i = 0; i < length; i++) {
			var randomIndex = Math.floor(Math.random() * charset.length);
			randomString += charset.charAt(randomIndex);
		}
		this.#key = randomString;
		
   (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
	 js.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
	 //https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.js
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'AES-sdk'));  
  
  
  } // FIN Constructor
  

  encrypt(textToEncrypt){	
	return CryptoJS.AES.encrypt(textToEncrypt, this.#key).toString();  
  }

  decrypt(textToDecrypt){	
	return CryptoJS.AES.decrypt(textToDecrypt, this.#key).toString(CryptoJS.enc.Utf8);  
  }  
}   // FIN class objAES


// list Search and select Box
class objFindBox {
	#elemList;
	#convList;
	#elemFnd;
	#callback;
	#oFBdiv;
	#inputCtrl;
	#minToFind;
	#FBstyles;
	#convert;
  constructor(elemList, callback, minToFind) {
	window.oFindBox = this;

	this.#elemList = elemList;
	this.#minToFind = 3;	// default caracter number minimum to finfing
	if (callback)
		this.#callback = callback;  // required to return selected information
	if (minToFind)
		this.#minToFind = minToFind;	

	this.#FBstyles = "#FBfindList{height: 80%;}#findListFormZone{margin: 10px;}#findListBox{position: absolute;text-align: center;top: 50%;    left: 50%;    transform: translate(-50%, -50%);border: 1px solid;width: 300px;height: 50%;background: #f0f0f0;border-radius: 5px;display: none;z-index: 2000;}#FBelemList{text-align: left;list-style: none;text-decoration: none;overflow-y: scroll;border: buttonhighlight 2px inset;margin: 10px;height: 100%;padding: 5px;}#FBelemList  li:hover, li:focus {color: #a00;background: #ccc;cursor:pointer;}#findListFormZone  span:hover, span:focus {color: #a00;background: #ccc;}#closeFindBox{position: absolute;right: 0;top: 0;border: buttonhighlight 2px outset;}.findBoxXctrl{padding: 3px;cursor:pointer;margin-left: 2px;}.findBoxXctrl span:hover, span:focus {color: #a00;background: #ccc;}";

	function convertList(elem){
		const C_WA = "àâäôóéèëêïîçùûüÿÀÂÄÔÉÈËÊÏÎŸÇÙÛÜ";
		const C_NA = "aaaooeeeeiicuuuyAAAOEEEEIIYCUUU";
		var cl = [];
		function repAcc(txt){
			var str = Array.from(txt);
			for (const el in str){
				const ind = C_WA.indexOf(str[el]);
				if (ind > -1)
					str[el] = C_NA[ind];
			}
			return str.join("").toLowerCase(); 
			}
		
		if (elem){
			return repAcc(elem);
		}else{
			for (el in elemList){
				var x = el;
				cl[el] = repAcc(elemList[el][0]);
			}
			return cl;
		}
	}
	
	this.#convList = convertList();
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
			   li1.innerHTML = this.#elemList[i][0];
			   ul.appendChild(li1);	
			}
		}
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
  
    show(){	
		if (!this.#oFBdiv)
			this.#createFindBox();
		this.#oFBdiv.style.display = 'inherit';
		this.#inputCtrl.focus();
	}
	
	hide(id){	
		this.#oFBdiv.style.display = 'none';

		this.#callback(id);
	}
}   // FIN class objFindBox


