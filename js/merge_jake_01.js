//declare map var in global scope
var map1, map2, pcp;
var attributes = ["population","PISLAND","White","Black","HISPANIC","Asian","AmIndian",
                // "18+_Pop","PISLAND18","WHITE18","BLACK18","HISPANIC18","ASIAN18","AMINDIAN18",
                "D_votes", "R_votes","D_percents","R_percents",
                "intra_flows","inter_flows"]
var proposals = ["current", "effGap", "compactness", "modularity", "pmc"] // the same as the checkbox class (cb-xx) and file names
var curAttribute = attributes[0], // variable for symbolization
    curProp1 = "current" //proposals[0], // proposals to show on the map, left one
    curProp2 = "effGap" //proposals[1]; // right on, change default curProp1 and curProp2 to the "standard" ones on loading
var oldChecked = [curProp1,curProp2];
var propCount = 0; // at most 2 proposals can be chosen
var zoomLevel = 10; // make sure two maps zoom in to the same level
var json1, json2, pointJson1, pointJson2, prop1, prop2; // data files loaded
var curExpression = "choropleth" //"choropleth"
var color1 = "rgba(116,169,207, .8)", color2 = "rgba(252,141,89, .8)";

// Not work when changing initial setting of expression
// need to update pcp and pcp legend when changing proposal 

var extents =  { 'population': [723, 750],
            '18+_Pop': [559, 597],
            'PISLAND18': [0.2, 0.3],
            'WHITE18': [303, 532],
            'BLACK18': [3.2, 165],
            'HISPANIC18': [6.9, 62],
            'ASIAN18': [6.791, 19.6],
            'AMINDIAN18': [2.0, 19.2],
            'PISLAND': [0.2, 0.4],
            'White': [336, 678],
            'Black': [5.7, 238],
            'HISPANIC': [12.1, 105],
            'Asian': [12.4, 37.1],
            'AmIndian': [2.0, 26.3],
            'D_votes': [120, 271.6],
            'D_percents': [0.33, 0.86],
            'R_votes': [44.7, 254.8],
            'R_percents': [0.14, 0.67],
            'intra_flows': [1.65, 5.23],
            'inter_flows': [1.93, 5.54],
                }

var colorScale;
var mapPropDict = {
    'current':'map1',
    'effGap':'map2'
}
var oldLayers = []

//chart global variables
var chartWidth = 360,
    chartHeight = 300,
    leftPadding = 25,
    rightPadding = 2,
    topBottomPadding = 5,
    chartInnerWidth = chartWidth - leftPadding - rightPadding,
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

// colormap global variables
var n = 50;
var colormapWidth = 880,
    colormapHeight = 40,
    marginLeft = 15,
    colormapElementWidth = (colormapWidth - 2 * marginLeft)/n,
    colormapElementHeight = 20,
    textHalfWidth = 12;

// line legend global variable
var lineLength = 20,
    gap = 120,
    legendWidth = 250,
    legendHeight = 20;

var minValue = extents[curAttribute][0],
    maxValue = extents[curAttribute][1];

//create a scale to size bars proportionally to frame and for axis
var yScale;

function initialize(){
    createProposal();
    colorScale = makeColorScale();
    map1 = createMap("map1", curProp1);
    map2 = createMap("map2", curProp2);
    var colormap = setColormap();
    var legend = setLineLegend();
    
    reexpress()
};

function createProposal(){ //Jake
    // var container = document.querySelector("#proposalPanel")
    //only allow <=2 checkboxes to be checked at a time
    // need to coordinate check box and reexpression button
    var checks = document.querySelectorAll(".check");
    var max = 2;
    for (var i = 0; i < checks.length; i++)
        checks[i].onclick = selectiveCheck;
    
    function selectiveCheck (event) {
        // get the checked boxes
        var checkedChecks = document.querySelectorAll(".check:checked");
        // don't let user check more than two boxes
        if (checkedChecks.length >= max + 1)
            return false;
        console.log('Current proposal vars: ',curProp1,curProp2)
        // if they haven't checked more than two (or else would have returned above),
        //       see if they checked a new box
        newChecked = []
        checkedChecks.forEach(v=> {
            newChecked.push(v.name)
        })
        var currList = [curProp1,curProp2]
        // need to find out which of the boxes is the newly checked box, and which curProp it should replace
        const intersection = (currList, newChecked) => {
            const s = new Set(newChecked);
            return currList.filter(x => s.has(x))

        }
        var inBoth = intersection(currList, newChecked)
        // if only one map changes
        if (newChecked.length == 2 && inBoth.length == 1){
            var curProp = newChecked.filter(a => a !== inBoth[0])[0];
            var removeVar = currList.filter(a => a !== inBoth[0])[0];
            steadyMap = mapPropDict[inBoth[0]]
            updateOneCheck(steadyMap, curProp, removeVar);
        }
        // if both unchecked/are different
        if (newChecked.length == 2 && inBoth.length == 0){
            var currList = [curProp1,curProp2]
            mapPropDict = {}
            curProp1 = newChecked[0]
            curProp2 = newChecked[1]
            mapPropDict[curProp1] = 'map1'
            mapPropDict[curProp2] = 'map2'
            updateBothCheck()
            }        
        }
    
       } // end of createProposal()

// } //end of parent function

function getNewData(map, curProp){
    var mapid = map.boxZoom._container.id;
    if ((curExpression=="choropleth") || (curExpression=="propSymbol")){
        clearGeojson(map)
    } else{
        clearBar(mapid)
    }
    clearPCP(mapid)
    if (curExpression=="choropleth"){
        getChoroData(map, curProp)
    } 
    else if(curExpression=="propSymbol"){
        getPropData(map, curProp);
    }
    else {
        getBarData(mapid, curProp)
    }
}

function updateOneCheck(steadyMap, curProp, removeVar){
    if (steadyMap == 'map1'){
        map = map2;
        mapid = "map2";
        console.log('updating map2')
    } else {
        map = map1;
        mapid = "map1";
        console.log('updating map1')
    };
    getNewData(map, curProp);

    map._controlContainer.getElementsByClassName('title_class')[0].innerHTML = curProp + ' map'
    if (removeVar == curProp1){
        curProp1 = curProp
        delete mapPropDict[removeVar]
        mapPropDict[curProp1] = mapid
    }
    if (removeVar == curProp2){
        curProp2 = curProp
        delete mapPropDict[removeVar]
        mapPropDict[curProp2] = mapid
    }
    updateLineLegend();
}

function updateBothCheck(){
    getNewData(map1, curProp1);
    getNewData(map2, curProp2);
    map1._controlContainer.getElementsByClassName('title_class')[0].innerHTML = curProp1 + ' map';
    map2._controlContainer.getElementsByClassName('title_class')[0].innerHTML = curProp2 + ' map';
    updateLineLegend();
}


function createMap(panel, curProp){
    //create the map
    map = L.map(panel, {
        center: [44.5,-89.5], // change to WI
        zoom: 5, //larger number means you see more detail
        zoomControl: false
    });

    //add OSM base tilelayer
    var osm = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=fqi6cfeSKDgbxmTFln7Az50KH80kQ9XiendFp9kY5i3IR5yzHuAOqNSeNaF7DGxs', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 4,
    maxZoom: 10,
    subdomains: "abcd",
    accessToken: "fqi6cfeSKDgbxmTFln7Az50KH80kQ9XiendFp9kY5i3IR5yzHuAOqNSeNaF7DGxs"
    }).addTo(map);

    // modify to limit to WI
    var southWest = L.latLng(42, -90),
    northEast = L.latLng(45, -89);
    var bounds = L.latLngBounds(southWest, northEast);
    // map.fitBounds(bounds)
    // map.setMaxBounds(bounds);
    map.on("drag", function() {
        map.panInsideBounds(bounds, { animate: false });
    });

    L.control.zoom({
        position: "bottomright"
    }).addTo(map);

    // add layer control
    var baselayer = {
        
        // "water color": watercolor,
    }
    //load the data
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    var texture = new L.GeoJSON.AJAX("data/"+ "texture_demo" + ".geojson", style= myStyle);
    // texture.on("data:loaded", function() { 
    // map.fitBounds(geojson.getBounds()); 
    // texture.addTo(map)
    // texture.setStyle(function(feature) {
    //     return {
    //         fillColor: getColor(feature.attributes.id),
    //         color: 'white'
    //     }
    // })
    var overlayers = {
        "OSM": osm,
        "Texture": texture,
        // "Landslide": ls
    }
  
    L.control.layers(baselayer, overlayers).addTo(map)

    // setTimeout(function () { map.invalidateSize() }, 50);

    //call getData function
    getNewData(map, curProp);

    createTitle(map, curProp); 

    return map
}

//function to retrieve the data and place it on the map
function getChoroData(map, curProp){
    
    fetch("data/"+curProp+".geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            mapid = map.boxZoom._container.id
            // console.log("chart-container-"+mapid)
            // document.querySelector(+mapid).style.display = 'none'; 
            document.querySelector(".chart-container-"+mapid).style.display = 'none'; 

            if (mapid=="map1"){
                json1 = json
            } else{
                json2 = json
            }
            var choroLayer = createChoropleth(json, map); // initialize with curAttribute
            // set legend, later
            
            //create layers for reexpression, Yuhan
            // var propLayer = getPropData(map, curProp);
                // var histLayer = createChart(choroLayer, propLayer)
                // add reexpression control
            
            // var barLayer = createBar(json, mapid);
            // create Layers for overlay, Jake
            // add overlay control
            var curBoundLayer;
            var hisBoundLayer;
            var osmLayer;
            var textureLayer

            // create PCP plots and control Yuhan
            createPCP(json, mapid)
            

            
            // create info label, only activate when cbgOn=1
            // createInfoBox(

                    

        })

};

function setColormap(){
    var breakPoints = []
    // console.log(breakPoints)
    for (var i=0; i<n; i++){
        breakPoints.push(minValue + (maxValue - minValue) / n * i)
    };
    // breakPoints.push(maxValue)
    // console.log(breakPoints);
    console.log(breakPoints);

    var colormap = d3.select("#mapLegend")
        .append("svg")
        .attr("class", "legend")
        .attr("width", colormapWidth)
        .attr("height", colormapHeight)
        .selectAll(".legend")
        .data(breakPoints)
        .enter()
        .append("g")
        .attr("class", "colormap");

    console.log(colormap)
    colormap.append("rect")
        .attr("class", "colormapRect")
        .attr("y", 0)
        .attr("x", function(d, i){
            return colormapElementWidth * i + marginLeft;
        })
        .attr("width", colormapElementWidth)
        .attr("height", colormapElementHeight)
        .style("fill", function(d, i) { return colorScale(d); })
        // .style("stroke", function(d, i) { return colorScale(d); })
        // .style("weight", "0.00001");

    console.log(colormap)
    colormap.append("text")
        .attr("class", "mono cmap")
        .text(function(d, i) { 
            if (i==0){
                return minValue.toFixed(2);
            }
            if (i==Number(n/2)){
                return ((minValue + maxValue) / 2).toFixed(2);
            } 
            if (i==(n-1)){
                return maxValue.toFixed(2);
            } 
             
        })
        .attr("x", function(d, i) { 
            if (i==0){
                return marginLeft - textHalfWidth;
            }
            if (i==Number(n/2)){
                return 440 - textHalfWidth;
            } 
            if (i==(n-1)){
                return 880 - marginLeft - textHalfWidth*2;
            } 
        })
        .attr("y", 32);
}



function reexpress(){
    
    document.querySelector('#'+curExpression).disabled = true;
    //click listener for buttons

    document.querySelectorAll('.reexpress').forEach(function(btn){
        btn.addEventListener("click", function(){
            var newExpression = btn.id;

            document.querySelector('#'+curExpression).disabled = false;
            changeExpression(map1, newExpression);
            changeExpression(map2, newExpression);
            curExpression = newExpression;
            document.querySelector('#'+curExpression).disabled = true;
        });
    })

}

function changeExpression(map, newExpression){
    
    var mapid = map.boxZoom._container.id;

    if (mapid=="map1"){
        // json = json1;
        // pointJson = pointJson1;
        curProp = curProp1;
    }
    else{
        // json = json2;
        // pointJson = pointJson2;
        curProp = curProp2;
    }
    // console.log(map)
    if ((curExpression=="choropleth") || (curExpression=="propSymbol")){
        clearGeojson(map)
    } else{
        clearBar(mapid)
    }
    //change curExpression
    // document.querySelector('#'+curExpression).disabled = true;
    //reexpress

    if (newExpression=="choropleth"){
        getChoroData(map, curProp)
    } 
    else if(newExpression=="propSymbol"){
        getPropData(map, curProp);
    }
    else {
        getBarData(mapid, curProp)
    }
}

function clearGeojson(map){
    {
        map.eachLayer(function(layer){

            // resymbolize based on map type
            if (layer.feature){
                // if ((curExpression=="choropleth") && (layer.feature.geometry['type']==='Polygon' || layer.feature.geometry['type']==='MultiPolygon')){
                //     // console.log(layer)
                //     map.removeLayer(layer)
                // }
                // if ((curExpression=="propSymbol") && (layer.feature.geometry['type']==='Point')){
                //     map.removeLayer(layer)
                // }
                // // onEachFeature(layer.feature, layer, attribute);
                map.removeLayer(layer)
    
            }
        });
    };
}

function clearBar(mapid){
    d3.select(".chart-"+mapid).remove();
    // d3.select(".chart-map1").remove();
}

function clearPCP(mapid){
    var lineMap = d3.selectAll(".lines."+mapid)
        .remove();
    console.log('clear pcp', "."+mapid, lineMap)
    // d3.select(".chart-map1").remove();
}


function getPropData(map, curProp){
    fetch("data/"+curProp+"_point.geojson")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        mapid = map.boxZoom._container.id
        document.querySelector(".chart-container-"+mapid).style.display = 'none'; 
        if (mapid=="map1"){
            pointJson1 = json
        } else{
            pointJson2 = json
        }
        
        //create an attributes array
        var propLayer = createPropSymbols(json, map)
        // console.log(choroLayer)
        // addLayerControl(propLayer, choroLayer, attributes)
        // createPropLegend();
        // map.on('baselayerchange', function (e) {
        //     console.log(e.layer);
        // });
        // if (mapid=="map2"){
        d3.selectAll('.propSymbol'+'.'+mapid).append("desc")
        .text('{"stroke": "#023858", "weight": "1", "fillOpacity": "1"}');
        // }
        createPCP(json, mapid);
    });


};

//function to create color scale generator, based on global minmax of an attribute
function makeColorScale(){
    var colorClasses = [
        "rgba(241,238,246,.7)",
        "rgba(4,90,141,.7)",
    ];


    //create color scale generator
    colorScale = d3.scaleLinear()
        .range(colorClasses);

    //build two-value array of minimum and maximum curExpression attribute values
    var minmax = extents[curAttribute];
    // console.log(minmax)s
    //assign two-value array as scale domain
    colorScale.domain(minmax);

    return colorScale;
};

function setChoroStyle(feature){
    // console.log(feature.properties[curAttribute])
    options = {
        fillColor: colorScale(feature.properties[curAttribute]), 
        color: "#023858",
        weight: 1,
        opacity: 1,
        fillOpacity: .7,
    };

    return options
}

// choropleth by attribute
function createChoropleth(json, map){
    
    // add button for choropleth map
    var mapid = map.boxZoom._container.id;
    var layer = L.geoJson(json, {
            style: function(feature) { 
                return setChoroStyle(feature);
            },
            onEachFeature: function(feature, layer){
                onEachFeature(feature, layer, map, "choropleth")
            }
        }).addTo(map)
    map.fitBounds(layer.getBounds());

    // if (mapid=="map2"){
    if (curExpression=="choropleth"){
        d3.selectAll('.choropleth.'+mapid).append("desc")
        .text('{"stroke": "#023858", "weight": "1", "fillOpacity": "1"}');
    } else{
        d3.selectAll('.choropleth.'+mapid).append("desc")
        .text('{"stroke": "#023858", "weight": "1", "fillColor": "none", "fillOpacity": "1"}');
    }

    // }

    return layer
};

// proportional symbols by attribute
function createPropSymbols(json, map){
    
    var mapid = map.boxZoom._container.id;
    // var selected = d3.selectAll(".choropleth")
    // .style("fill", "none");
    // console.log(selected)
    //create a Leaflet GeoJSON layer and add it to the map
    var layer = L.geoJson(json, {
                    pointToLayer: function(feature, latlng){
                        return pointToLayer(feature, latlng);
                    },
                    onEachFeature: function(feature, layer){
                        onEachFeature(feature, layer, map, "propSymbol")
                    }
                });
    layer.addTo(map);

    if (mapid=="map2"){
        createChoropleth(json2, map2)
        
    } else{
        // console.log(json1)
        var choroLayer = createChoropleth(json1, map1)
    }
    resymbolize(curAttribute, true)
    d3.selectAll('.propSymbol.'+mapid).append("desc")
    .text('{"stroke": "#023858", "weight": "1", "fillOpacity": "1"}');

    
    return layer
};


// attach popups to features
function onEachFeature(feature, layer, map, expression) {
    mapid = map.boxZoom._container.id;
    districtid = feature.properties.assignment_0;
    // if (expression==curExpression){
    layer.setStyle({
        className: "polygon "+ expression + " " + mapid + ' ' + mapid +'-'+districtid
    });
    layer.on({
        mouseover: function(event){
            // console.log(event.target)
            mapid = event.target._map._container.id
            districtid = event.target.feature.properties.assignment_0
            // console.log(mapid, districtid)
            highlight("."+ mapid +'-'+districtid)
        },
        mouseout: function(event){
            mapid = event.target._map._container.id
            districtid = event.target.feature.properties.assignment_0
            dehighlight("."+mapid+'-'+districtid)
        },
    });
        
    // } else {
    //     layer.setStyle({
    //         className: "polygon "+ expression
    //     });
    // }


}

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //For each feature, determine its value for the selected attribute
    var attrValue = feature.properties[curAttribute];
    // console.log(calcPropRadius(attrValue))
    //create marker options
    var options = {
        radius: calcPropRadius(attrValue),
        fillColor: colorScale(attrValue),
        color: "#023858",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
        borderRadius: 0.5
    };



    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    // var popupContent = createPopupContent(feature.properties, attribute)

    // //bind the popup to the circle marker
    // layer.bindPopup(popupContent, {
    //     offset: new L.Point(0,-options.radius*0.01) 
    // });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//calculate the radius of each proportional symbol
function calcPropRadius(attrValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 4;
    // minValue = extents[curAttribute][0],
    // maxValue = extents[curAttribute][1];
    // console.log(minValue, attrValue)
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(1 + 4 * (attrValue-minValue)/(maxValue-minValue), 0.5715) * minRadius
    // console.log(radius)
    return radius;
};

function getBarData(mapid, curProp){
    fetch("data/"+curProp+".geojson")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        document.querySelector(".chart-container-"+mapid).style.display = 'block'; 
        if (mapid=="map1"){
            json1 = json
        } else{
            json2 = json
        }
        
        //create an attributes array
        console.log('getBarData json',json)
        var barLayer = createBar(json, mapid)
        console.log('barLayer',barLayer)
        // addLayerControl(propLayer, choroLayer, attributes)
        // createPropLegend();
        // map.on('baselayerchange', function (e) {
        //     console.log(e.layer);
        // });
        
        createPCP(json, mapid);
    });


};

function createBar(json, mapid){
    //create a second svg element to hold the bar chart
    var chart = d3.select('.'+'chart-container-'+mapid)
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart-"+mapid);
    console.log('chart',chart)
    //create a rectangle for chart background fill
    var chartBackground = chart.append("rect")
        .attr("class", "chartBackground")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
    console.log('chartBackground',chartBackground)
    //create a scale to size bars proportionally to frame and for axis
    var yScale = d3.scaleLinear()
        .range([chartInnerHeight, 0])
        .domain([minValue*0.95, maxValue*1.02]);
    console.log('yScale',yScale)
    //set bars for each district
    var bars = chart.selectAll(".bar")
        .data(json.features)
        .enter()
        .append("rect")
        .sort(function(a, b){
            return b.properties[curAttribute]-a.properties[curAttribute]
        })
        .attr("class", function(d){
            return "bar " + mapid + '-' + d.properties.assignment_0;
        })
        .attr("id", function(d){
            return mapid + '-' + d.properties.assignment_0;
        })
        .attr("width", chartInnerWidth / json.features.length - 1)
        .attr("x", function(d, i){
            // console.log(json.features.length)
            return i * (chartInnerWidth / json.features.length) + leftPadding;
        })
        .attr("height", function(d, i){
            return chartHeight - yScale(d.properties[curAttribute]);
        })
        .attr("y", function(d, i){
            return yScale(parseFloat(d.properties[curAttribute])) - topBottomPadding;
        })
        .style("fill", function(d){
            return colorScale(d.properties[curAttribute]);
        })
        .style("stroke", "#fff")  
        .style("stroke-width", .7)
        .on("mouseover", function(event, d){
            id = event.target.id
            highlight('.' + id);
        })
        .on("mouseout", function(event, d){
            id = event.target.id
            dehighlight('.' + id);
        });
    console.log('bars',bars)
    // //create a text element for the chart title
    // var chartTitle = chart.append("text")
    //     .attr("x", 40)
    //     .attr("y", 40)
    //     .attr("class", "chartTitle")
    //     .text("Number of Variable " + curExpression[3] + " in each region");
    
    //create vertical axis generator
    var yAxis = d3.axisLeft()
        .scale(yScale);
    console.log('yAxis',yAxis)
    //place axis
    var axis = chart.append("g")
        .attr("class", "barAxis")
        .attr("transform", translate)
        .call(yAxis);
    console.log('axis',axis)
    //create frame for chart border
    var chartFrame = chart.append("rect")
        .attr("class", "chartFrame")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);    

    console.log('chartframe',chartFrame)
    
    //add style descriptor to each rect
    var desc = bars.append("desc")
                .text('{"stroke": "#fff", "stroke-width": ".7px", "opacity": ".7"}');
    console.log('desc',desc)
}

function createPCP(json, mapid){
    console.log(mapid)
    if (mapid=="map1"){
        color = color1;
    } else{
        color = color2;
    }

    //chart frame dimensions
    var margin = { top: 20, right: 10, bottom: 20, left: 30 },
        chartWidth = 950 - margin.left - margin.right,
        chartHeight = 220 - margin.top - margin.bottom;
        console.log('')

    // console.log(d3.select(".pcp")._groups[0][0]==null) 
    // if no pcp created, set PCP first
    if (d3.select(".pcp")._groups[0][0]==null){
        //create a second svg element to hold the histogram
        var chart = d3.select("#pcpPlot")
            .append("svg")
            .attr("width", chartWidth + margin.left + margin.right)
            .attr("height", chartHeight + margin.top + margin.bottom)
            .append("g")
            .attr("class", "pcp")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else{
        var chart = d3.select(".pcp")
    }

      // For each attr, build a linear scale. I store all in a y object
    var y = {}
    for (i in attributes) {
        attr = attributes[i]
        y[attr] = d3.scaleLinear()
        .domain(extents[attr])
        //     d3.extent(json.features, function(d) { 
        //     console.log(d)
        //     return +d.properties[attr]; 
        // }) )
        .range([chartHeight, 0])
    }

      // Build the X scale -> it find the best position for each Y axis
    var x = d3.scalePoint()
        .range([0, chartWidth-10])
        .padding(0.1)
        .domain(attributes);
    
    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(attributes.map(function(p) {
            return [x(p), y[p](d.properties[p])]; }));
    }

    var lines = chart.selectAll(".lines-"+mapid)
        .data(json.features)
        .enter()
        .append("path")
        .attr("class", function(d){      
            return "lines "  + mapid  + ' ' + mapid + '-' + d.properties.assignment_0;        
        })    
        .attr("id", function(d){
            return mapid + '-' + d.properties.assignment_0;
        }) 
        .attr("d", path)   
        .style("fill", "none")
        .style("stroke", color)  
        .style("stroke-width", 1.2)
        .style("opacity", .9)
        .on("mouseover", function(event, d){
            id = event.target.id
            highlight('.' + id);
        })
        .on("mouseout", function(event, d){
            id = event.target.id
            dehighlight('.' + id);
        });
        // .on("mousemove", moveLabel);

    //add style descriptor to each rect
    var desc = lines.append("desc")
                .text('{"stroke": "'+ color+'", "stroke-width": "1.2px", "opcaity": ".9"}');

    // Draw the axis:
    if (d3.selectAll(".pcpAxis")._groups[0][0]==null){
        chart.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(attributes)
        .enter()
        // .attr("class", "pcpAxis")
        .append("g")
        .attr("class", "pcpAxis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { 
            // console.log(this);
            d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
        .attr("class", function(d){return "attr " + d})
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")
        .style("font-size", "12px")
        .style("font-weight", function(d){
            if (d==curAttribute){
                return 900
            } else {
                return 500
            }
        })
        .on('click', function(event, d) {
            curAttribute = d
            if (curExpression=="choropleth"){
                resymbolize(d, false);
            } else{
                resymbolize(d, true)
            }
            
          })     
    }


    // console.log(d3.selectAll(".pcpAxis"))

}

function setLineLegend(){
    var legend = d3.select("#pcpLegend")
        .append("svg")
        .attr("class", "legend")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .selectAll(".legend")
        .data([curProp1, curProp2])
        .enter()
        .append("g")
        .attr("class", "lineLegend");

    console.log(legend)
    legend.append("path")
        .attr("class", "colorLine")
        .attr("d", function(d, i){
            return d3.line()([[marginLeft + gap*i, legendHeight/2], [marginLeft + gap*i + lineLength, legendHeight/2]]);
        })
        .style("fill", "none")
        .style("stroke", function(d, i){
            if (i==0){
                return color1;
            } else {
                return color2;
            }
        })  
        .style("stroke-width", 1.2)
        .style("opacity", .9)

    legend.append("text")
        .attr("class", "mono linelegend")
        .text(function(d, i) { 
            return d;
        })
        .attr("x", function(d, i) { 
            return marginLeft + gap * i + lineLength + 10;
        })
        .attr("y", legendHeight* 0.7);
}


//function to highlight enumeration units and bars
function highlight(className){
    d3.selection.prototype.bringToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
        };
    //change stroke
    var selected = d3.selectAll(className)
        .style("stroke", "#0FC2C0") //
        .style("stroke-width", "2.5")
        .bringToFront();
    // console.log(selected)
    // setLabel(props)
};

//function to reset the element style on mouseout
function dehighlight(className){
    // console.log(props)
    var selected = d3.selectAll(className)
        .style("stroke", function(){
            return getStyle(this, "stroke")
        })
        .style("stroke-width", function(){
            return getStyle(this, "stroke-width")
        });
        

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };

    d3.select(".infolabel")
    .remove();
};

function resymbolize(newAttribute, transparent){ // Yuhan
    // change current attribute
    curAttribute = newAttribute

    // change font weight
    d3.selectAll(".attr")
    .style("font-weight", function(d){
        if (d==curAttribute){
            return 900
        } else {
            return 500
        }
    });

    //recreate the color scale
    colorScale = makeColorScale();
    minValue = extents[curAttribute][0],
    maxValue = extents[curAttribute][1];

    //create a scale to size bars proportionally to frame and for axis
    yScale = d3.scaleLinear()
        .range([chartInnerHeight, 0])
        .domain([minValue*0.95, maxValue*1.02]);

    console.log(curExpression, transparent)


    if (curExpression=="bar"){
        updateChart("map1", json1.features.length)
        updateChart("map2", json2.features.length)
    } else {
        console.log(transparent)
        updateMapLayer(map1, transparent)
        updateMapLayer(map2, transparent)
    }

    updateColormap()
}



function updateMapLayer(map, transparent){
    map.eachLayer(function(layer){
        
        // resymbolize based on map type
        if (layer.feature){
            
            if  ((curExpression=="choropleth" || transparent) && (layer.feature.geometry['type']==='Polygon' || layer.feature.geometry['type']==='MultiPolygon')){
                updateChoropleth(layer, transparent);
            }
            if ((curExpression=="propSymbol") && (layer.feature.geometry['type']==='Point')){
                updatePropSymbols(layer);
            }
            // onEachFeature(layer.feature, layer, attribute);

        }
    });
}


function updateChoropleth(layer, transparent){
    //access feature properties
    var props = layer.feature.properties;
    if (transparent){
        var newColor = "none";
    } else{
        var newColor = colorScale(props[curAttribute]);
    }

    //update each feature's color based on new attribute values
    var options = {
        fillColor: newColor,
        color: "#023858",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
    };
    layer.setStyle(options);
    
};

function updatePropSymbols(layer){
    //access feature properties
    var props = layer.feature.properties;
    //update each feature's color based on new attribute values
    var options = {
        radius: calcPropRadius(props[curAttribute]),
        fillColor: colorScale(props[curAttribute]),
        color: "#023858",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        borderRadius: 0.5
    };
    layer.setStyle(options);
}


function updateChart(mapid, n){
    // change color in barchart
    var bars = d3.select(".chart-"+mapid)
    .selectAll(".bar")
    .sort(function(a, b){
        return b.properties[curAttribute]-a.properties[curAttribute]
    })
    .attr("width", chartInnerWidth / n - 1)
    .attr("x", function(d, i){
        return i * (chartInnerWidth / n) + leftPadding;
    })
    .attr("height", function(d, i){
        return chartHeight - yScale(d.properties[curAttribute]);
    })
    .attr("y", function(d, i){
        return yScale(parseFloat(d.properties[curAttribute])) + topBottomPadding;
    })
    .style("fill", function(d){
        return colorScale(d.properties[curAttribute]);
    })
    .style("stroke", "#fff")  
    .style("stroke-width", .7)

    //create vertical axis generator
    var yAxis = d3.axisLeft()
        .scale(yScale);

    //place axis
    var axis = d3.select(".chart-"+mapid)
        .select(".barAxis")
        .call(yAxis);
}

function updateColormap() {
    var breakPoints = []
    // console.log(breakPoints)
    for (var i=0; i<100; i++){
        breakPoints.push(minValue + (maxValue - minValue) / n * i)
    };
    console.log(breakPoints);

    d3.selectAll(".colormapRect")
        .style("fill", function(d, i) { return colorScale(breakPoints[i]); })
        .transition() //add animation
        .delay(function(d, i){
            return i * 20
        })
        .duration(50);;


    d3.selectAll(".cmap")
        .text(function(d, i) { 
            if (i==0){
                return minValue.toFixed(2);
            }
            if (i==50){
                return ((minValue + maxValue) / 2).toFixed(2);
            } 
            if (i==99){
                return maxValue.toFixed(2);
            } 
        })
        .attr("x", function(d, i) { 
            if (i==0){
                return marginLeft - textHalfWidth;
            }
            if (i==50){
                return 440 - textHalfWidth;
            } 
            if (i==99){
                return 880 - marginLeft - textHalfWidth*2;
            } 
        })
        .transition() //add animation
        .delay(function(d, i){
            return i * 20
        })
        .duration(50);
}

function updateLineLegend() {
    d3.selectAll(".linelegend")
        .text(function(d, i) { 
            if (i==0){
                return curProp1;
            } else{
                return curProp2;
            }
            
        })

}

//add the title to the map
function createTitle(map, curProp){
	//add a new control to the map to show the text content
    var TitleControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create("div", "title-container");
            console.log('container',container)
            // container.style.position = "absolute";
            // container.style.left = "100px";
			
			//specify the title content
			var content = "<h3 class='title_class'>" + curProp + " map</h3>";
			container.insertAdjacentHTML("beforeend", content)
			
			//disable click inside the container
			L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });
    map.addControl(new TitleControl());
    // map._controlContainer.innerHTML = ''
    // console.log('map._controlContainer',curProp,map._controlContainer.innerHTML)
    // console.log("document.getElementById('title-container').textContent",map.getElementById('title-container leaflet-control'))
    // console.log.getElementById("title-container leaflet-control"))
}

document.addEventListener("DOMContentLoaded",initialize)