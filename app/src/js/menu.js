/* eslint-env browser  */

var Index = Index || {};
Index.menu = function (filterSelected) {
    "use strict";
    console.log($("#chart").width());
    
    const width = $("#chart").width(),
        height = width,
          thickness=50,
          color = d3.scaleOrdinal()
                .range(["rgb(255, 77, 77)", "rgb(255, 102, 102)", "rgb(255, 128, 128)", "rgb(255, 153, 153)", "rgb(255, 179, 179)", "rgb(255, 204, 204)", "rgb(255, 230, 230)"]);
    var that = {},svg;


    function init() {
        console.log("init menu");
        createSvg();
        
    }

    function createSvg(){
        svg = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height);
    }
    
    //wird aufgerufen wenn Staaten ausgewählt werden mit liste der ausgewählten Staaten
    function changeData(state, data) {
        d3.select('#chart').selectAll("g").remove(); 
        createArc(data);
        createTextLeftCorner(state);
    }

    function createArc(data) {
        var radius = Math.min(width, height) / 2;
        //removes the existing arc
        //d3.select('#chart').selectAll("g").remove();            
       
         var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);

        var innerchart= svg.append('g')
            .attr('transform', 'translate(' + (width / 2)  +
              ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(width-7*thickness)
            .outerRadius(width-6*thickness);
      
        var path = innerchart.selectAll('path')
            .append("g")
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', arc)
            //.classed("pieselected",true)
            .attr('fill', function (d) {
                return color(d.data.name);
            })
            .on("mouseover", function (d) {
                let el=d3.select(this);
                let percentage=parseFloat((d.endAngle - d.startAngle)/(2*Math.PI)*100).toFixed(2) +" %"
                createTextCenter(d.data.value,d.data.name,percentage);
                el.classed("piehover",true);
            })
            .on("mouseout", function (d) {
               let el=d3.select(this);
                el.classed("piehover",false);
            })
            .on("click", showSecondArc)
            .transition()
            .ease(d3.easeLinear)
            .duration(200)
            .attrTween("d", function(d){
                d.innerRadius=0;
                var i= d3.interpolate({startAngle:0, endAngle:0},d);
                return function(t){return arc(i(t));};
            });
        
        //draw all unterkat charts
            detailDataRequested(data);
        
      /*//add textLabel 
       var labelArc = d3.arc()
            .outerRadius(radius-50)
            .innerRadius(radius-70);
            
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
            */
    }
    
    function showSecondArc(d){
        //console.log(d);
        var tog=d3.selectAll('g[visibility = visible]');
        //element schon ausgewählt
        if(tog.data().length != 0){
            //gleiches element
            if(tog.data()[0].name==d.data.name){
                console.log("gleich --> hide")
                d3.selectAll("."+d.data.name).attr("visibility","hidden");
            }else{
                //unterschiedlich
                d3.selectAll("."+tog.data()[0].name).attr("visibility","hidden");
                d3.selectAll("."+d.data.name).attr("visibility","visible")
            }
        }else{
        //nichts ausgewählt
        d3.selectAll("."+d.data.name).attr("visibility","visible");
        }
    }
    
    //http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
    function markPie(el) {
        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };
        el.moveToFront()
    }
    
    function createTextCenter(name, value, percentage){
        svg.select(".text").remove();
        //TODO startposition des Textfeldes über g bestimmen!!
        var textfield= svg.append('g').classed("text",true)
            .attr('transform', 'translate(185, 200 )');
        
        textfield.append("text").selectAll("text").data([name,value,percentage])
                        .enter()
                        .append("tspan")
                        .text(function (d) {
                        return d;
                        })
                        .attr("x",function (d,i) {
                            return 0;
                            })
                        .attr("y",function (d,i) {
                            return i*20;
                            });
    }
    
    function createTextRightCorner(name, percentage){
        svg.select(".textselected").remove();
        //TODO startposition des Textfeldes über g bestimmen!!
        var textfield= svg.append('g').classed("textselected",true)
            .attr('transform', 'translate(335, 20 )');
        
        textfield.append("text").selectAll("text").data([name,percentage])
                        .enter()
                        .append("tspan")
                        .text(function (d) {
                        return d;
                        })
                        .attr("x",function (d,i) {
                            return 0;
                            })
                        .attr("y",function (d,i) {
                            return i*20;
                            });
    }
    
    function createTextLeftCorner(state){
        svg.select(".textstate").remove();
        //TODO startposition des Textfeldes über g bestimmen!!
        var textfield= svg.append('g').classed("textstate",true)
            .attr('transform', 'translate(50, 20 )');
        
        textfield.append("text").selectAll("text").data([state])
                        .enter()
                        .append("tspan")
                        .text(function (d) {
                        return d;
                        })
                        .attr("x",function (d,i) {
                            return 0;
                            })
                        .attr("y",function (d,i) {
                            return i*20;
                            });
    }


    function detailDataRequested(event){
        /*
        let el=d3.select(this);
        if(el.classed("pieselected")){
                el.classed("pieselected",false);
                //Todo zweiten Arc löschen
        }else{
            el.classed("pieselected",true);
            markPie(el);
        //console.log(event);
        var mainpercentage=parseFloat((event.endAngle - event.startAngle)/(2*Math.PI)).toFixed(4);
        createTextRightCorner(event.data.name,mainpercentage*100+"%");
        markPie(el);
        d3.selectAll(".pieselected").classed("pieselected",false)
        el.classed("pieselected",true);
        
        var data =event.data.array;
        */
        var data=event;
        //für jede oberkategorie eigenen chart zeichnen!
        
        var radius = Math.min(width, height) / 2;
        
        var outerchart= svg.append('g').attr('transform', 'translate(' + (width /2) +',' + (height / 2) + ')').classed("secondarc",true).selectAll('g').data(event).enter().append('g').attr("class",function (d) {
            return (d.name);
        }).attr("visibility","hidden");
        
        
        // arc
        var outerArc = d3.arc()
            .innerRadius(width-6*thickness+2)
            .outerRadius(width-5*thickness+2);

        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
        
        //var outerchart= svg.append('g').classed("secondarc",true)
          //  .attr('transform', 'translate(' + (width /2) +
          //    ',' + (height / 2) + ')')
            //.append('g').classed(event.name,true);
        
        var path = outerchart.selectAll('path')
            //.data(pie(data))
            .data(function(d) { 
                return pie(d.array);})
            .enter()
            .append('path')
            .attr('d', outerArc)
            //zu beginn alle der unterkategorie ausgewählt
            .classed("pieselected",true)
            .attr('fill', function (d) {
                return color(d.data.name);
            })
            .on("mouseover", function (d) {
                let el=d3.select(this);
                el.classed("piehover",true);
                let percentage=parseFloat((d.endAngle - d.startAngle)/(2*Math.PI)*mainpercentage*100).toFixed(2) +" %"
                createTextCenter(d.data.value,d.data.name,percentage);
            })
            .on("mouseout", function (d) {
               let el=d3.select(this);
                el.classed("piehover",false);
            })
            .on("click", function(d){
                let el=d3.select(this);
                if(el.classed("pieselected")){
                    el.classed("pieselected",false);
                }else{
                    el.classed("pieselected",true);
                }
                markPie(el);
                selectionChanged();
            })
        
            /*.transition()
            .ease(d3.easeLinear)
            .duration(200)
            .attrTween("d", function(d){
                d.innerRadius=0;
                var i= d3.interpolate({startAngle:0, endAngle:0},d);
                return function(t){return outerArc(i(t));};
            });
            */
            selectionChanged();
        //}
        
        
    }
    
    //muss arc bekommen 
    function pieAnimation(d){
        //var arc = d3.arc()
        //    .innerRadius(width-6*thickness+2)
        //    .outerRadius(width-5*thickness+2);
        d.innerRadius=0;
        var i= d3.interpolate({startAngle:0, endAngle:0},d);
        return function(t){return arc(i(t));};
    }
    
    //main kann sich die filter holen!
    function getSelectedFilters(){
        
    }
    
    function selectionChanged(){
        //array mit ID der ausgewählten kategorien!!
        var filters=d3.selectAll(".pieselected");
        console.log(filters.data());
        console.log(filters.data().length);
        for(var i=0;i<filters.data().length;i++){
            
        }
        //callback für main
       filterSelected(filters);
    }
    //
    //
    /* d3.selectAll(.selected).data() //alle ausgewählten Elemente
    */
    that.changeData = changeData;
    that.init = init;
    return that;
};
