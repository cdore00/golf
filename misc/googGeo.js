<!--

// Fonctions génériques Google map

function repere(lat, lng){

 var geocoder = new google.maps.Geocoder();
 var latlng = new google.maps.LatLng(lat, lng);
 
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
			parseShowAdress(results[0].formatted_address)
			//alert(status + results[1]);
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
 }

function parseShowAdress(strAdr){

var myAdr=new Array();
var i, pos, strCP;

i = 0;
while (strAdr.indexOf(',', 0) != -1)
{
	pos = strAdr.indexOf(',', 0);
	myAdr[i] = strAdr.slice(0,pos);
	strAdr = strAdr.slice(pos+1,strAdr.length)
	i++;
}

strCP = myAdr[i-1].slice(myAdr[i-1].length-7, myAdr[i-1].length);

writeAddress(myAdr[0], myAdr[1], strCP);

}

// -->