const EuropeanaApiBase = "https://api.europeana.eu/record/v2/search.json";
const apiKey = "?wskey=eclansio";

const searchInput = document.getElementById("searchArtInput");

let APICallResults = [];
var currentMarkers=[];

function searchArt() {
    if (currentMarkers!==null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
            currentMarkers[i].remove();
        }
    }
    let searchedArt = searchInput.value;
    console.log(searchedArt);
    let url = EuropeanaApiBase + apiKey + "&query=" + searchedArt + "&rows=100";
    console.log(url);

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)
            if (data.items) {
                for (var i = 0; i < 10; i++) {
                    var provider = data.items[i].dataProvider;
                    APICallResults = provider

                    //NEED TO FILTER THESE RESULTS HERE TO SHOW ONLY UNIQUE VALUES
                    //var unique = _.uniq(APICallResults, false, function(x) {
                    //    return x.provider
                    //});
                    //console.log(unique)

                    geocodeArt(APICallResults)
                }
            }
        });

}

// This is the map
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpemFiZXJxIiwiYSI6ImNrbmVvYzNsNzF0M2YyeGxjdnk3d3FmOXIifQ.00TTbP1rwOuyMNv5kn8ckg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [4.70093, 50.87959], // starting position [lng, lat]
    zoom: 5 // starting zoom
});

const MapApiBase = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const Token = "&access_token=pk.eyJ1IjoiZWxpemFiZXJxIiwiYSI6ImNrbmVvYzNsNzF0M2YyeGxjdnk3d3FmOXIifQ.00TTbP1rwOuyMNv5kn8ckg";

function geocodeArt(APICallResults) {
    let url = MapApiBase + encodeURIComponent(APICallResults) + ".json?types=poi" + Token
    console.log(url);

    fetch(url)
        .then(function (response) {
            return response.json();
            //console.log(response)
        })
        .then(function (response) {
            //console.log(response)
            for (var i = 0; i < response.features.length; i++) {
                marker = new mapboxgl.Marker()
                    .setLngLat(response.features[i].geometry.coordinates)
                    .setPopup(new mapboxgl.Popup().setHTML(APICallResults))
                    .addTo(map); // add the marker to the map
                //marker.remove();
                console.log(marker.getPopup())
                console.log(response.features[i].geometry.coordinates)
                currentMarkers.push(marker);
            }
        });

}
