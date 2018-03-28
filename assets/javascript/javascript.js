// Initialize Firebase
var config = {
    apiKey: "AIzaSyA4chTy3B8TK5MQ7lOJItb2fjymlH8MvbE",
    authDomain: "project1-225a7.firebaseapp.com",
    databaseURL: "https://project1-225a7.firebaseio.com",
    projectId: "project1-225a7",
    storageBucket: "project1-225a7.appspot.com",
    messagingSenderId: "38799629863"
};
firebase.initializeApp(config);
var database = firebase.database();
//LIST OF CLICK EVENTS====================================
$("#reset-button").click(function () {
    // console.log("RESET")
    resetFilters();
});
$("#submit-button").click(function () {
    // console.log("SUBMIT")
    submit();
});
//END LIST OF CLICK EVENTS================================
//LIST OF FUNCTIONS ======================================
function filterSelection(id) {
    $('.filterDiv').hide();
    $('#' + id).show();
    // console.log("FilterSelection Function id= " + id);
}
function resetFilters() {
    $("#lat").val("");
    $('#lng').val("");
    $('#radius').val("");
    $('#search-input').val("");
    $('input:radio[name=gender]:checked').prop('checked', false);
    $('input:radio[name=lips]:checked').prop('checked', false);
    $('input:radio[name=glasses]:checked').prop('checked', false);
    data.lat = "";
    data.lng = "";
    data.radius = "";
    data.search = "";
    data.searchSet = "";
    data.isMale = "";
    data.isMaleSet = "";
    data.lipsTogether = "";
    data.lipsTogetherSet = "";
    data.wearingGlasses = "";
    data.wearingGlassesSet = "";
    printData();
}
function submit() {
    lat = $("#lat-input").val();
    lng = $('#lon-input').val();
    radius = $('#radius-input').val();
    search = $('#search-input').val();
    if (search == "" || typeof search == 'undefined') {
        searchSet = false;
    } else {
        searchSet = true;
    }
    isMale = $('input[name=gender]:checked').val();
    if (isMale == "" || typeof isMale == 'undefined') {
        isMaleSet = false;
    } else {
        isMaleSet = true;
    }
    lipsTogether = $('input[name=lips]:checked').val();
    if (lipsTogether == "" || typeof lipsTogether == 'undefined') {
        lipsTogetherSet = false;
    } else {
        lipsTogetherSet = true;
    }
    wearingGlasses = $('input[name=glasses]:checked').val();
    if (wearingGlasses == "" || typeof wearingGlasses == 'undefined') {
        wearingGlassesSet = false;
    } else {
        wearingGlassesSet = true;
    }
    data.lat = lat;
    data.lng = lng;
    data.radius = radius;
    data.search = search;
    data.searchSet = searchSet;
    data.isMale = isMale;
    data.isMaleSet = isMaleSet;
    data.wearingGlasses = wearingGlasses;
    data.wearingGlassesSet = wearingGlassesSet;
    data.lipsTogether = lipsTogether;
    data.lipsTogetherSet = lipsTogetherSet;
    printData();
    flickr();
}
function printData() {
    console.log("=================================")
    console.log("PRINT DATA-----------------------")
    console.log("lat " + data.lat);
    console.log("lng " + data.lng);
    console.log("radius " + data.radius);
    console.log("search " + data.search);
    console.log("searchSet " + data.searchSet);
    console.log("isMale " + data.isMale);
    console.log("isMaleSet " + data.isMaleSet);
    console.log("wearingGlasses " + data.wearingGlasses);
    console.log("wearingGlassesSet " + data.wearingGlassesSet);
    console.log("lipsTogether " + data.lipsTogether);
    console.log("lipsTogetherSet " + data.lipsTogetherSet);
    console.log(data);
    console.log("---------------------------------")
    console.log("=================================")
}
//END LIST OF FUNCTIONS ==================================
//GLOBAL VARIABLES
var lat = "";
var lng = "";
var radius = "";
var search = "";
var searchSet = false;
var isMale = "";
var isMaleSet = false;
var lipsTogether = "";
var lipsTogetherSet = false;
var wearingGlasses = "";
var wearingGlassesSet = false;
var data = {
    lat: lat,
    lng: lng,
    radius: radius,
    search: search,
    searchSet: searchSet,
    isMale: isMale,
    isMaleSet: isMaleSet,
    lipsTogether: lipsTogether,
    lipsTogetherSet: lipsTogetherSet,
    wearingGlasses: wearingGlasses,
    wearingGlassesSet: wearingGlassesSet
}
//TO RUN ON START=========================================
resetFilters();
$('.filterDiv').hide();
$('#' + "location-radius").show();


//empty image folder to start anew
database.ref("/imageFolder").set("")
//GLOBAL VARIABLES
var imageData = {
    url: "",
    latitude: "",
    longitude: "",
}
var radius = data.radius;
var lng = data.lng;
var lat = data.lat;
var searchText = data.search;
var locations = [45, -93.3]
var url = []
//END GLOBAL VARIABLES
function flickr() {
    
    //empty image folder to start anew
    console.log("$$$$$$$$$$FLICKR FUNCTION STARTED$$$$$$$$$$$");
    var flickerApiKey = "2b85c680be8fe0b66443ea94abe08939";
    var flickerSecret = "4b36c92a87544403";
    //clear global values
    locations = [];
    url = [];
    window.locations = locations;
    window.url = url;
    console.log("Map: initmap locations checkSCOPE " + locations)
    database.ref("/imageFolder").set("")
    var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2b85c680be8fe0b66443ea94abe08939&text=" + searchText + "&lat=" + lat + "&lon=" + lng + "&radius=" + radius + "&extras=geo%2Curl_m&per_page=10&format=json&nojsoncallback=1";
    var queryURLbase = "http://api.flickr.com/services/rest/?"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        console.log("lattitude: "+lat)
        console.log("longitude: "+lng)
        var arrayLength = response.photos.photo.length
        for (i = 0; i < arrayLength; i++) {
            var imageUrl = response.photos.photo[i].url_m;
            var imageLatitude = response.photos.photo[i].latitude;
            var imageLongitude = response.photos.photo[i].longitude;
            imageData.url = imageUrl;
            imageData.latitude = imageLatitude;
            imageData.longitude = imageLongitude;
            face();
        }
    })
}
function face() {
    //backup key and id, make sure one is always commented out
    var faceApiKey = "6da0f85d408056e6b38af6725ba34647"
    var id = "51ddb6f1"
    //pasted in below
    var headers = {
        "Content-type": "application/json",
        "app_id": id,
        "app_key": faceApiKey
    };
    var payload = { "image": imageData.url };
    var url = "https://api.kairos.com/detect";
    // make request 
    $.ajax(url, {
        headers: headers,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "json"
    }).done(function (response) {
        console.log(response);
        //if men is checked and women is checked return  !!!!!!CAN NEVER BE TRUE WITH RADIO BUTTONS
        // if ($("#men").is(":checked") && $("#women").is(":checked")) {
        //     return;
        // }
        //else if wearing glasses and men is checked and not a woman
        // if ($("#glasses1").is(":checked") && $("#men").is(":checked") && !$("#women").is(":checked")) {
        if (isMaleSet && wearingGlassesSet && isMale && wearingGlasses) {
            console.log("MALE AND WEARING GLASSES&&&&&&&&");
            var glasses = response.images["0"].faces["0"].attributes.glasses;
            var maleness = response.images["0"].faces["0"].attributes.gender.maleConfidence;
            if (glasses != "None" && maleness > 0.5) {
                console.log("MAN WITH GLASSES")
                database.ref("/imageFolder").push(imageData)
            }
        }
        //else if wearing glases and a woman and not a man
        // else if ($("#glasses1").is(":checked") && $("#women").is(":checked") && !$("#men").is(":checked")) {
        if (isMaleSet && wearingGlassesSet && wearingGlasses && !isMale) {
            console.log("FEMALE$$$ AND WEARING GLASSES&&&&&&&&");
            var glasses = response.images["0"].faces["0"].attributes.glasses;
            var femaleness = response.images["0"].faces["0"].attributes.gender.femaleConfidence;
            if (glasses != "None" && femaleness > 0.5) {
                console.log("WOMAN WITH GLASSES")
                database.ref("/imageFolder").push(imageData)
            }
        }
        //else if wearing glasses and not a man and not a woman
        // else if ($("#glasses1").is(":checked") && !$("#men").is(":checked") && !$("#women").is(":checked")) {
        if (wearingGlassesSet && wearingGlasses) {
            console.log("SOMEONE WEARING GLASSES EITHER MAN OR WOMAN &&&&&&&&");
            var glasses = response.images["0"].faces["0"].attributes.glasses;
            if (glasses != "None") {
                console.log("GLASSES")
                database.ref("/imageFolder").push(imageData)
            }
        }
        //else if a man and not a woman and no glasses
        // else if ($("#men").is(":checked") && !$("#women").is(":checked") && !$("#glasses1").is(":checked")) {
        if (isMaleSet && wearingGlassesSet && !wearingGlasses && isMale) {
            console.log("MAN AND NO GLASSES!!!!!!!!!!!!!!!!!");
            var maleness = response.images["0"].faces["0"].attributes.gender.maleConfidence;
            if (maleness > 0.5) {
                database.ref("/imageFolder").push(imageData)
                console.log("MAN")
            }
        }
        //else if a woman and not a man and no glasses 
        // else if ($("#women").is(":checked") && !$("#men").is(":checked") && !$("#glasses1").is(":checked")) {
        if (isMaleSet && wearingGlassesSet && !isMale && !wearingGlasses) {
            console.log("WOMAN WITH NO GLASSES!!!!!!!!!!!!!!!!!");
            var femaleness = response.images["0"].faces["0"].attributes.gender.femaleConfidence;
            if (femaleness > 0.5) {
                database.ref("/imageFolder").push(imageData)
                console.log("WOMAN")
            }
        }
        //else if not a woman and not a man and no glasses
        // else if (!$("#women").is(":checked") && !$("#men").is(":checked") && !$("#glasses1").is(":checked")) {
        if (!wearingGlasses) {
            database.ref("/imageFolder").push(imageData)
        }
    });
}
//Main Process

//locations = [45, -93.3];
////// The below section pulls data from DB and adds lat and lng to the locations array and calls initMap to have maps read the locations and add the pins  /////

////////////////////////////////////////////////
/////////// Google Maps Javascript /////////////
////////////////////////////////////////////////

////// The below section pulls data from DB and adds lat and lng to the locations array and cals initMap to have maps read the locations and add the pins  /////


// Locations and url array are global
var locations = [45, -93.3]

var url = []

// Pulling from DB and adding locations and url to pass to maps
database.ref("/imageFolder").on("child_added", function (child_changed, prevChildKey) {



    console.log("Map: pulling location data from DB inside initMap to prep for initMap insertion");

    var latitudeVar = child_changed.val().latitude;
    console.log(latitudeVar);
    var longitudeVar = child_changed.val().longitude;
    console.log(longitudeVar);
    var pic = child_changed.val().url;

    // The below section takes the inital lat and lng variables and converts them from strings to numbers.  Google Maps only wants numbers
    var latitudeVar2 = Number(latitudeVar);
    console.log(latitudeVar2);
    var longitudeVar2 = Number(longitudeVar);
    console.log(longitudeVar2);



    url.push(pic)
    // Push to locations array
    locations.push(
        [latitudeVar2, longitudeVar2]

    )
    // Make Google maps look at the array again and passes locations and url
    // Firebase data comes in to the locations array slower than Google Maps loads so initMap has to be called here
    initMap(locations, url);

});



// Google Maps initMap starts

function initMap() {

    console.log("Map: google maps starts with initMap!")
    console.log("Map: initmap locations check " + locations)
    var map = new google.maps.Map(document.getElementById('map'), {
        // Inital zoom level, can change
        zoom: 7,
        // Inital maps location, can change
        center: { lat: 44.0000, lng: -93.000 }

    });
    // Defines bounds for markers
    var bounds = new google.maps.LatLngBounds()
    // Custom marker for markers, other options available, easy change
    var moustacheMarker = {
        url: "https://png.icons8.com/metro/1600/english-mustache.png",
        // url: "https://media.giphy.com/media/CfBql1PxBv8ic/giphy.gif",
        // url: "http://freevector.co/wp-content/uploads/2014/06/71321-moustache-and-glasses.png",
        // url: "https://image.flaticon.com/icons/svg/189/189634.svg",
        size: new google.maps.Size(70, 60),
        scaledSize: new google.maps.Size(70, 60),
        origin: new google.maps.Point(0, 0),

    }

    // Labels for markers, not visible on most cutom markers
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Loop that starts marker adding on Maps
    for (var i = 0; i < locations.length; i++) {
        console.log("Map: set marker loop runs...")
        // console.log(url)
        var latLng = locations[i]
        var marker = new google.maps.Marker({
            position: { lat: latLng[0], lng: latLng[1] },
            map: map,
            label: labels[i],
            icon: moustacheMarker,
            animation: google.maps.Animation.DROP,
            url: url[i]
        });

        // Moves maps boundaries to new marker locations
        var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        bounds.extend(loc);

        // market listener listens for clicks on the markers
        marker.addListener('click', function () {
            // contentString contains the HTML for the popup on marker click
            var contentString = '<div id=infoWindow><img src="' + this.url + '"></div>'; // WORKS!!!! 
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            console.log("Map: marker click event!");
            // alert("hello!"); // works
            // window.location.href = this.url // WORKS for just a url on each marker
            // window.open(this.url); //WORKS for opening URL in new tab
            infowindow.open(map, this);


        });
    }
    // This tells you your lat and long when you click on the map, currently it just dumps it to console.
    google.maps.event.addListener(map, "click", function (event) {
        var clickLat = event.latLng.lat();
        var clickLon = event.latLng.lng();

        // Show lat and lng in console and alert window, variables of clickLat and clickLon are ready for use in HTML
        console.log("Maps Click lat " + clickLat)
        console.log("Maps Click lng " + clickLon)
        // alert("Your Lat: " + clickLat + "     Your Lng: " + clickLon)

    });
    // auto centers and pans to new marker location with a new set zoom level

    map.fitBounds(bounds);
    map.panToBounds(bounds);
    map.setZoom(11);
    console.log(bounds)
}