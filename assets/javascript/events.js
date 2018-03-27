
//LIST OF CLICK EVENTS====================================
$("#reset-button").click(function () {
    // console.log("RESET")
    resetFilters();
    location.reload();
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

    $('input:radio[name=gender]:checked').prop('checked', false);

    $('input:radio[name=lips]:checked').prop('checked', false);

    $('input:radio[name=glasses]:checked').prop('checked', false);

    data.lat = "";
    data.lng = "";
    data.radius = "";
    data.search = "";
    data.searchSet = false;
    data.isMale = "";
    data.isMaleSet = false;
    data.lipsTogether = "";
    data.lipsTogetherSet = false;
    data.wearingGlasses = "";
    data.wearingGlassesSet = false;
    printData();
}

function submit() {

    lat = $("#lat").val().trim();
    lng = $('#lng').val().trim();
    radius = $('#radius').val().trim();


    search = $('#search-input').val();
    if (searchSet != "")
        searchSet = true;
    isMale = $('input[name=gender]:checked').val();
    if (searchSet != "")
        isMaleSet = true;
    lipsTogether = $('input[name=lips]:checked').val();
    if (searchSet != "")
        lipsTogetherSet = true;
    wearingGlasses = $('input[name=glasses]:checked').val();
    if (searchSet != "")
        wearingGlassesSet = true;

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
$('.filterDiv').hide();
$('#' + "location-radius").show();