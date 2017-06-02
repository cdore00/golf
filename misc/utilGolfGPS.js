<!--

function setFontSizeGolfGPS(policeSize){
var bodyobj = document.getElementsByTagName('body')[0];

if (policeSize)
	polSize = policeSize;
else{
	polSize = GetCookie("PolSize");
	switch(polSize)
		{
		case "0.9em":
		  polSize = "1.2em";
		  break;
		case "1em":
		  polSize = "1.6em";
		  break;
		case "1.1em":
		  polSize = "2em";
		  break;
		}
	}

if (polSize == null || polSize == 0 )
	polSize = "0.9em";
	
bodyobj.style.fontSize = polSize;
setImgTaille(polSize);
//alert(bodyobj.style.fontSize + "Ok");
}

function changeTailleGolfGPS(){
var bodyobj = document.getElementsByTagName('body')[0];
var policeSize;

//alert(bodyobj.style.fontSize + "polSize=" + polSize);
	
if (bodyobj.style.fontSize=="0.9em" ||  bodyobj.style.fontSize=="1.2em"){
	policeSize="1.6em";}
if (bodyobj.style.fontSize=="1.6em"){
	policeSize="2em";}
if (bodyobj.style.fontSize=="2em"){
	policeSize = "1.2em";}

setFontSizeGolfGPS(policeSize);
setImgTaille(policeSize);
}


// -->