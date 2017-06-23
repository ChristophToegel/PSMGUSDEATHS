/* eslint-env browser  */

var Index = Index || {};
Index.infobox = function () {
    "use strict";

    var that = {},boxData,svg; //dataset;


    function init() {
        console.log("init infobox");

    }

    //wird aufgerufen wenn Staaten ausgewählt werden mit liste der ausgewählten Staaten
    function changeData(state, data) {
        //console.log("Auswahländerung: "+stateslist);
        boxData=data;
        var stateName = document.getElementById('State_Name');
        stateName.innerHTML = state;
        //console.log(state);
        var number = data; //data.getInfoBoxData([1780,1990], " TX");
        for (var i = 0; i < data[0].length; i++) {
            let element = document.getElementById(data[0][i].name);
            element.innerHTML = data[0][i].value;
        }
        createArc(data);
        
        /*
        var numberOfAccidents = data.accidents
        var accidentsNumber = document.getElementById('Accidents_Number');
        accidentsNumber.innerHTML=number[0][2].value
        var naturalCausesNumber = document.getElementById('Natural_Causes');
        naturalCausesNumber.innerHTML=number[0][1].value
        var suspectKnownNumber = document.getElementById('Suspect_Known');
        suspectKnownNumber.innerHTML=number[0][0].value
        var illnessNumber = document.getElementById('Illness');
        illnessNumber.innerHTML=number[2].total
        var otherCausesNumber = document.getElementById('Other_Causes');
        otherCausesNumber.innerHTML=number[0][1].total
        var totalNumber = document.getElementById('Total_Number');
        totalNumber.innerHTML = number[2].total
        console.log(number);
        */
    }

    function createArc(data) {
        //console.log(data);
        var dataset = data;
        var width = 440;
        var height = 440;
        var radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal()
            .range(["rgb(255, 77, 77)", "rgb(255, 102, 102)", "rgb(255, 128, 128)", "rgb(255, 153, 153)", "rgb(255, 179, 179)", "rgb(255, 204, 204)", "rgb(255, 230, 230)"]);
        //removes the existing arc
        d3.select('#chart').select("svg").remove();            

         var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
        
        var outerArc = d3.arc()
            .innerRadius(radius-80)
            .outerRadius(radius-40);

        var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        svg = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(radius-180)
            .outerRadius(radius-120);
      
        var path = svg.selectAll('path')
            .append("g")
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d) {
                return color(d.data.name);
            })
            .on("click", detailDataRequested);
        
      //add textLabel
        
        svg.selectAll('text')
            .append("g")
            .data(pie(dataset))
            .enter()
            .append("text")
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .text(function (d) {
                return d.data.name;
            });
            
    }
    
    


    function detailDataRequested(event){
        //d3.select('#chart').select("svg").remove();
        
        var dataset =event.data.array;
        console.log(dataset);
        var color = d3.scaleOrdinal()
            .range(["rgb(255, 77, 77)", "rgb(255, 102, 102)", "rgb(255, 128, 128)", "rgb(255, 153, 153)", "rgb(255, 179, 179)", "rgb(255, 204, 204)", "rgb(255, 230, 230)"]);
        
        var width = 440;
        var height = 440;
        var radius = Math.min(width, height) / 2;
        
        var outerArc = d3.arc()
            .innerRadius(radius-120)
            .outerRadius(radius-70);

        var labelArc = d3.arc()
            .outerRadius(radius-50)
            .innerRadius(radius-70);

        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
        
        var pathtwo = svg.append("g").selectAll('path')
            .append("g")
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', outerArc)
            .attr('fill', function (d) {
                return color(d.data.name);
            })
            .on("click", detailDataRequested);
        
        svg.selectAll('text')
            .append("g")
            .data(pie(dataset))
            .enter()
            .append("text")
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .text(function (d) {
                return d.data.name;
            });
    }
    
    that.changeData = changeData;
    that.init = init;
    return that;
};
