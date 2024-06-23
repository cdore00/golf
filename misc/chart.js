



// Class Progress Bar
class objProgBar {
	#container;
	#oDivBar;
	#progress;
  constructor(container, width, height) {
	 window.oProgBar = this;
	if (typeof container == 'string')
		this.#container = document.getElementById("container");
	else
		this.#container = container;
	this.#oDivBar = null;
	var w = (width) ? width:"100%";
	var h = (height) ? height:"20px";
		
	(function(d, h, s, id, width, height){
	   var js, fjs = d.getElementsByTagName(h)[0];
	   if (d.getElementById(id)) {return;}
	   js = d.createElement(s); js.id = id;
	   //display: none;
	   js.innerHTML = '#divProgressBar { width: ' + width + '; background-color: #ddd; display: none;} #divInBar { width: 1%; height:' + height + '; background-color: #046DAA;}';
	   fjs.appendChild(js);
	}(document, 'head', 'style', 'progressBar-styles', w, h));  
	
	this.#progress = 0;
  
  } // FIN Constructor

	#addUI(){
		this.#oDivBar = document.createElement('div');
		this.#oDivBar.setAttribute('id', 'divProgressBar' );
			var divIn = document.createElement('div');
			divIn.setAttribute('id', 'divInBar' );
		this.#oDivBar.appendChild(divIn);
		this.#container.appendChild(this.#oDivBar);
		this.#oDivBar.style.display = 'inline-block';	
	}

	move() {
	  
		if (!this.#oDivBar)
			this.#addUI()

		var elem = document.getElementById("divInBar");
		var width = 1;
		var id = setInterval(frame, 30);
		function frame() {
		  if (width >= 100) {
			clearInterval(id);
		  } else {
			width++;
			elem.style.width = width + "%";
		  }
		}
	}

	hide(){
		this.#container.removeChild(this.#oDivBar);
	}

} //FIN Class Progress Bar




// Class pie chart
// https://support.syncfusion.com/kb/article/9596/how-to-create-pie-chart-in-html
class objPieChart {
	#container;
	#radius;
	#oBar;
	#dataColl;		// Data series collection of [label, value]
	#chartToRender	// Indicator for chart To Render
	
	constructor(container, radius) {
		window.oPieChart = this;
		this.#container = '#' + container;
		this.#radius = (radius) ? radius:"80%";
		this.#oBar = null;
		(function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "misc/barchart.js";
		 js.onload = function() {
                oPieChart.renderPie();
            };
		 fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'barChart-sdk'));  

	} // FIN Constructor
  

	renderPie(){

		if (typeof ej =='object'){
			this.#oBar.hide();
		   this.pie = new ej.charts.AccumulationChart({
				//Initializing Series
				series: [
					{
						title: "Statistics",
						dataSource: this.#dataColl,
						legendSettings: {
							visible: true,
						},
						dataLabel: {
							visible: true,
							position: 'Inside',
						},
						xName: 'x',
						yName: 'y',
						radius: this.#radius
					}
				],
			});
			this.pie.appendTo(this.#container);
			this.#chartToRender = false;
		}
	}

	showPie( data){
	
		this.#oBar = new objProgBar("container", "200px", "5px");
		this.#oBar.move();
	
		this.#dataColl = [];
		for (var el in data){
			this.#dataColl[this.#dataColl.length] = {'x': data[el][0], 'y': data[el][1]};
		}
	
		this.renderPie();
	}
  
}   // FIN class pie chart



// Class bar chart
// https://support.syncfusion.com/kb/article/9532/how-to-make-charts-in-html
// https://support.syncfusion.com/kb/article/9536/how-to-create-horizontal-bar-chart-in-js
class objBarChart {
	#container;		// <div> element to show chart
	#oChart			// Chart object	
	#title			// Chart title
	#color;			// Bar color
	#dataLabel;		// Show data value on each series
	#toolTip;		// Show tooltip on mouseover event
	#dataColl;		// Data series collection of [label, value]
	#serieName;		// Name of serie
	#Xlabel;		// X axis title
	#Ylabel;		// Y axis title
	#XlabelFormat;	// Data format for X axis
	#YlabelFormat;	// Data format for Y axis
	#chartType		// horizontal or vertical bar chart
	#valueType		// "Category" or "DateTime"
	#newSeries		// New series array
	#oDivCheckLabel	// Checbox UI to show/hide labels
	#chartToRender	// Indicator for chart To Render
	constructor(container, title, color, dataLabel, toolTip) {
		window.oBarChart = this;
		this.#container = container;
		this.#title = (title) ? title:"";
		this.#color = (color) ? color:"#000";
		this.#dataLabel = dataLabel;
		this.#toolTip = toolTip;
		this.#newSeries = [];
		this.#chartToRender = false;
		(function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "misc/barchart.js";
		 js.onload = function() {
				oBarChart.renderChart();
            };
		 fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'barChart-sdk')); 

		(function(d, h, s, id){
		   var js = d.getElementById(id), fjs = d.getElementsByTagName(h)[0];
		   if (!js) {js = d.createElement(s); js.id = id; fjs.appendChild(js);}
		   //js.innerHTML = '#containerSeriesCollection path{fill: ' + color + '; stroke: ' + color + ';}';
		}(document, 'head', 'style', 'barChart-styles'));   

	} // FIN Constructor
  
	showLabelUI(){

		this.#oDivCheckLabel = document.createElement('div');
		this.#oDivCheckLabel.setAttribute('id', 'divCheckLabel');
			var checkCtrl = document.createElement('input');
			checkCtrl.setAttribute('id', 'checkLabel' );
			checkCtrl.setAttribute('type', 'checkbox' );
			checkCtrl.setAttribute('value', 'Étiquettes' );
			if (this.#dataLabel)
				checkCtrl.setAttribute('checked', 'checked' );
			checkCtrl.setAttribute('onclick', 'oBarChart.showLabel(this)' );
			var checkLabel = document.createElement('label');
			checkLabel.setAttribute('for', 'checkLabel' );
			checkLabel.innerHTML = "Étiquettes";
		this.#oDivCheckLabel.appendChild(checkCtrl);
		this.#oDivCheckLabel.appendChild(checkLabel);
		document.getElementById('container_Secondary_Element').appendChild(this.#oDivCheckLabel);
	
	}
  
	showTolltip(oChk){
		var yPos = scrollY;

		this.#toolTip = oChk.checked;
		this.#oChart.tooltip.enable = this.#toolTip;
		this.#oChart.refresh();
		this.showLabelUI();
		scrollTo(0,yPos);
	}  
  
	showLabel(oChk){
		var yPos = scrollY;

		this.#dataLabel = oChk.checked;
		for(var serieID in this.#oChart.series){
			this.#oChart.series[serieID].marker.dataLabel.visible = this.#dataLabel;
		}
		this.#oChart.refresh();
		this.showLabelUI();
		scrollTo(0,yPos);
	}
  
	addSerie(data, name){
		var chartStyle = document.getElementById('barChart-styles');
		chartStyle.innerHTML = "";
		this.#dataColl[this.#dataColl.length] = this.#readData(data);
		this.#serieName[this.#dataColl.length-1] = (name) ? name:"";
		var newSerie = {
			type: this.#chartType,
			dataSource: this.#dataColl[this.#dataColl.length-1],
			marker: {
				 dataLabel: { visible: this.#dataLabel }
		   },
			xName: 'x',
			yName: 'y', name: this.#serieName[this.#dataColl.length-1]
		}
		if (this.#oChart){
			var yPos = scrollY;
			this.#oChart.addSeries([newSerie]);
			this.#oChart.refresh();
			this.showLabelUI();
			scrollTo(0,yPos);
		}else{
			this.#newSeries[this.#newSeries.length] = [newSerie];
		}
	}
	
	renderChart(){
		if (typeof ej =='object' && this.#chartToRender){
			var yPos = scrollY;
			this.#oChart = new ej.charts.Chart({
			title: this.#title,
            tooltip: {enable: this.#toolTip
			},
            primaryXAxis: {
                valueType: this.#valueType,
				labelFormat: (this.#valueType == "DateTime") ? '':'{value}' + this.#XlabelFormat,
                title: this.#Xlabel,
            },
            primaryYAxis: {
				labelFormat: '{value}' + this.#YlabelFormat,
                title: this.#Ylabel
            },
            series: [
                {
                    type: this.#chartType,
                    dataSource: this.#dataColl[0],
					marker: {
                         dataLabel: { visible: this.#dataLabel }
                   },
                    xName: 'x',
                    yName: 'y', name: this.#serieName[0]
                }
            ],
        });

        this.#oChart.appendTo('#' + this.#container);
		for( var nel in this.#newSeries){
			this.#oChart.addSeries(this.#newSeries[nel]);
			}
		this.#newSeries = [];
		this.showLabelUI();
		scrollTo(0, document.body.scrollHeight);
		this.#chartToRender = false;
		}
	}
	
	#readData(data){
		var serieData = []
		for (var el in data){
			serieData[serieData.length] = {'x': data[el][0], 'y': data[el][1]};
		}	
		return serieData;
	}

	#showBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat){
		this.#dataColl = [];
		this.#serieName = [];
		this.#Xlabel = (Xlabel) ? Xlabel:"";
		this.#Ylabel = (Ylabel) ? Ylabel:"";
		this.#XlabelFormat = (XlabelFormat) ? XlabelFormat:"";
		this.#YlabelFormat = (YlabelFormat) ? YlabelFormat:"";
		this.#dataColl[0] = this.#readData(data);
		this.#serieName[0] = (name) ? name:"";
		this.#chartToRender = true;
		this.renderChart();
	}

	addElement(label, value, serieID, delFirst){
		var yPos = scrollY;
		if (!serieID)
			serieID = 0;
		this.#dataColl[serieID].push({ x: label, y: value });
		if (delFirst)
			this.#dataColl[serieID].shift();
		this.#oChart.series[serieID].dataSource = this.#dataColl[serieID];
		this.#oChart.refresh();
		this.showLabelUI();
		scrollTo(0,yPos);
	}
	
	pushElement(label, value, serieID){
		this.addElement(label, value, serieID, true);
	}
	
	showHorizontalBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat){
		var chartStyle = document.getElementById('barChart-styles');
		chartStyle.innerHTML = '#containerSeriesCollection path{fill: ' + this.#color + '; stroke: ' + this.#color + ';}';
		this.#valueType = 'Category';
		this.#chartType = 'Bar';
		this.#showBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat);
	}	
	
	showVerticalBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat){
		var chartStyle = document.getElementById('barChart-styles');
		chartStyle.innerHTML = '#containerSeriesCollection path{fill: ' + this.#color + '; stroke: ' + this.#color + ';}';	
		this.#valueType = 'Category';
		this.#chartType = 'Column';
		this.#showBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat);
	}

	showDateTimeChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat){
		var chartStyle = document.getElementById('barChart-styles');
		chartStyle.innerHTML = '#containerSeriesCollection path{ stroke: ' + this.#color + ';}';	
		this.#valueType = 'DateTime';
		this.#chartType = 'Line';
		this.#showBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat);
	}

	showLineChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat){
		var chartStyle = document.getElementById('barChart-styles');
		chartStyle.innerHTML = '#containerSeriesCollection path{ stroke: ' + this.#color + ';}';	
		this.#valueType = 'Category';
		this.#chartType = 'Line';
		this.#showBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat);
	}

	showStackBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat){
		var chartStyle = document.getElementById('barChart-styles');
		chartStyle.innerHTML = '';	
		this.#valueType = 'Category';
		this.#chartType = 'StackingBar';
		this.#showBarChart(data, name, Xlabel, Ylabel, XlabelFormat, YlabelFormat);
	}
	
}   // FIN class bar chart

