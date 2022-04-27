//declare map var in global scope
var map1, map2, pcp;
var attributes = ['population', 'pct_white', 'income']
var proposals = ['current', 'effGap', 'compactness', 'modularity', 'pmc'] // the same as the checkbox class (cb-xx) and file names
var curAttribute = attributes[0], // variable for symbolization
    curProp1 = proposals[0], // proposals to show on the map, left one
    curProp2 = proposals[1]; // right on, change default curProp1 and curProp2 to the "standard" ones on loading
var propCount = 0; // at most 2 proposals can be chosen
var zoomLevel = 5; // make sure two maps zoom in to the same level



function initialize(){
    createProposal();
    pcp = createPCP(); // empty chart
    map1 = createMap('map1', curProp1)
    map2 = createMap('map2', curProp2)
};

function createProposal(){ //Jake
    var container = document.querySelector('#proposalPanel')
    console.log(container)
    //insert text of categories
    
    // insert proposal checkboxes
    for (var i=1; i<proposals.length; i++){
        // insert button
 
    }
    // add checkbox listener
    //1. add proposal selection checkbox
        // change curProp1
        // change curProp2
        // update propCount, 
         //if propCount==2, disable other check boxes
         // if uncheck one box, enable other checkboxes
         // transition settings?

}

function createPCP(){
    // create container with an empty svg
    // add control for attribute selection
    // resymbolize
    return pcp
}


function createMap(panel, curProp){
    //create the map
    map = L.map(panel, {
        center: [43.0722, -89.4008], // change to WI
        zoom: 6
    });

    //add OSM base tilelayer
    L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=fqi6cfeSKDgbxmTFln7Az50KH80kQ9XiendFp9kY5i3IR5yzHuAOqNSeNaF7DGxs', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 6,
    maxZoom: 10,
    subdomains: 'abcd',
    accessToken: 'fqi6cfeSKDgbxmTFln7Az50KH80kQ9XiendFp9kY5i3IR5yzHuAOqNSeNaF7DGxs'
    }).addTo(map);

    // modify to limit to WI
    var southWest = L.latLng(43, -90),
    northEast = L.latLng(45, -89);
    var bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });

    // setTimeout(function () { map.invalidateSize() }, 50);

    //call getData function
    // getData(map, curProp);

    createTitle(map, curProp); 

    return map
}

//function to retrieve the data and place it on the map
function getData(map, curProp){
    //load the data
    fetch('data/'+curProp+'.geojson')
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var choroLayer = createChoropleth(json); // initialize with curAttribute
            // set legend, later

            //create layers for reexpression, Yuhan
                // var propLayer = createPropSymbol(choroLayer);
                // var histLayer = createChart(choroLayer, propLayer)
                // add reexpression control
            
            // create Layers for overlay, Jake
            // add overlay control
            var curBoundLayer;
            var hisBoundLayer;
            var osmLayer;
            var textureLayer

            // create PCP plots and control Yuhan
            setPCP(curProp)

            // create info label, only activate when cbgOn=1
            createInfoBox()


       })

            

        // })

};

function createChoropleth(){ // Jake

}

function resymbolize(){ // Yuhan

}

//add the title to the map
function createTitle(map, curProp){
	//add a new control to the map to show the text content
    var TitleControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'title-container-'+curProp);
			
			//specify the title content
			var content = "<h3>" + curProp + " Map</h3>";
			container.insertAdjacentHTML('beforeend', content)
			
			//disable click inside the container
			L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });
    map.addControl(new TitleControl());
}

document.addEventListener('DOMContentLoaded',initialize)