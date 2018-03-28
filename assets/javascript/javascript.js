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
//empty image folder to start anew
database.ref("/imageFolder").set("")
var imageData = {
    url: "",
    latitude: "",
    longitude: "",
}
//calls relevant variables globally
var radius = $("#radius-input").val().trim();
var lon = $("#lon-input").val().trim();
var lat = $("#lat-input").val().trim();
var searchText = $("#search-input").val().trim();



//Calls Flickr images and loops face function, which filters images through Kairos API
function flickr() {

    //Call the flickr API
    var flickerApiKey = "2b85c680be8fe0b66443ea94abe08939";
    var flickerSecret = "4b36c92a87544403";

    //On click of the submit button
    $("#submit-button").click(function () {

    //reset arrays for map and sets them to global
        locations = [];
        url = [];
        window.locations = locations;
        window.url = url;
        
        //Empty database of old images
        database.ref("/imageFolder").set("")

        //Calls variables locally
        radius = $("#radius-input").val().trim();
        lon = $("#lon-input").val().trim();
        lat = $("#lat-input").val().trim();
        searchText = $("#search-input").val().trim();
        searchText2=searchText.split(' ').join('+');
        console.log("SEARCHTEXT2: "+searchText2)
        
        //Query URL for flickr
        var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2b85c680be8fe0b66443ea94abe08939&text=" + searchText2 + "&lat=" + lat + "&lon=" + lon + "&radius=" + radius + "&extras=geo%2Curl_m&per_page=10&format=json&nojsoncallback=1";

        //Call flickr API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                //calls response in console
                console.log(response)
                //Finds number of images called
                var arrayLength = response.photos.photo.length
                //Loop to run all images through kairos API
                for (i = 0; i < arrayLength; i++) {

                    var imageUrl = response.photos.photo[i].url_m;
                    var imageLatitude = response.photos.photo[i].latitude;
                    var imageLongitude = response.photos.photo[i].longitude;

                    imageData = {
                        url: imageUrl,
                        latitude: imageLatitude,
                        longitude: imageLongitude,

                    };
                    //calls face function 
                    face();
                }
            })
    })
}
//runs kairos API to filter face features
function face() {

    //var faceApiKey = "6727c81753d01555ba2777fa923e3b2c";
    //var id = "e31bdab8";

    //backup key and id, make sure one is always commented out
    var faceApiKey = "6da0f85d408056e6b38af6725ba34647"
    var id = "51ddb6f1"

    //collects image data from flickr function and puts it into a new object to prevent scoping issues
    var imageData2 = {
        url: imageData.url,
        imageLatitude: imageData.latitude,
        imageLongitude: imageData.longitude
    }
    //Calls kairos API
    var headers = {
        "Content-type": "application/json",
        "app_id": id,
        "app_key": faceApiKey
    };
    var payload = { "image": imageData2.url };
    var url = "https://api.kairos.com/detect";

    // make request 
    $.ajax(url, {
        headers: headers,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "json"
    }).done(function (response) {

        //console logs the response
        console.log(response);

        //if and else statements to check which filters are checked by user (glasses, men only, women only), and depending on the combination checks for specific features in the kairos API response. It then sends the images that pass the filter into the database.

        if ($("#men").is(":checked") && $("#women").is(":checked")) {
            return;
        }
        else if ($("#glasses1").is(":checked") && $("#men").is(":checked") && !$("#women").is(":checked")) {
            var glasses = response.images["0"].faces["0"].attributes.glasses;
            var maleness = response.images["0"].faces["0"].attributes.gender.maleConfidence;

            if (glasses != "None" && maleness > 0.5) {
                console.log("MAN WITH GLASSES")
                database.ref("/imageFolder").push(imageData2)
            }
        }
        else if ($("#glasses1").is(":checked") && $("#women").is(":checked") && !$("#men").is(":checked")) {
            var glasses = response.images["0"].faces["0"].attributes.glasses;
            var femaleness = response.images["0"].faces["0"].attributes.gender.femaleConfidence;

            if (glasses != "None" && femaleness > 0.5) {
                console.log("WOMAN WITH GLASSES")
                database.ref("/imageFolder").push(imageData2)
            }
        }
        else if ($("#glasses1").is(":checked") && !$("#men").is(":checked") && !$("#women").is(":checked")) {
            var glasses = response.images["0"].faces["0"].attributes.glasses;
            if (glasses != "None") {
                console.log("GLASSES")
                database.ref("/imageFolder").push(imageData2)
            }
        }
        else if ($("#men").is(":checked") && !$("#women").is(":checked") && !$("#glasses1").is(":checked")) {
            var maleness = response.images["0"].faces["0"].attributes.gender.maleConfidence;
            if (maleness > 0.5) {
                database.ref("/imageFolder").push(imageData2)
                console.log("MAN")
            }
        }
        else if ($("#women").is(":checked") && !$("#men").is(":checked") && !$("#glasses1").is(":checked")) {
            var femaleness = response.images["0"].faces["0"].attributes.gender.femaleConfidence;
            if (femaleness > 0.5) {
                database.ref("/imageFolder").push(imageData2)
                console.log("WOMAN")
            }
        }
        else if (!$("#women").is(":checked") && !$("#men").is(":checked") && !$("#glasses1").is(":checked")) {

            database.ref("/imageFolder").push(imageData2)
        }

    });
}
//Call function
flickr()



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

    var latitudeVar = child_changed.val().imageLatitude;
    console.log(latitudeVar);
    var longitudeVar = child_changed.val().imageLongitude;
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