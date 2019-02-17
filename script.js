var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function geoLocation(renderFunction, when, whereToPut, clothes) {
    function thingToDoWhenWeKnowWhereWeAre(location) {
        var { latitude, longitude } = location.coords;
        renderFunction(latitude, longitude, when, whereToPut, clothes);
    }

    navigator.geolocation.getCurrentPosition(thingToDoWhenWeKnowWhereWeAre);
}

function clothingRecommandation(data){
    var advice = {
        "0.10": "very likely",
        "0.64": "likely", 
        "0.80": "unlikely",
        "1": "none",
    }
    var dataForToday = data.daily.data[0];
    if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
        var message = advice;
        var advicestring = parseFloat([dataForToday.precipProbability]);
        switch(true) {
            case advicestring <= 0.1:
                return {text:"Very likely", image: "img/burber.jpg"}
                break;
            case advicestring < 0.65:
                return {text:"Likely", image: "img/inesfressange.jpg"}
                break;
            case advicestring < 0.81:
                return {text:"Unlikely", image: "img/inesfressange.jpg"}
                break;
            case advicestring <= 1:
                return {text:"none", image: "img/swimsuit.jpg"}
                break;
            default:
        }
    }
}

function extractCity(data){
    var zone = data.timezone;
    var city = zone.split("/");
    return city[city.length-1];
}

function extractDate(data){
    var dataForToday = data.daily.data[0];
    var date = new Date(dataForToday.time*1000);
    var dayweek = date.getDay();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    return  days[dayweek] + " " + day + " " + months[month] + " " + year;
    
}


function formatTemperature(data){
    var dataForToday = data.daily.data[0];
    if (dataForToday.temperatureMax !== undefined && dataForToday.temperatureMax !== null) {
        var tempcelsius = Math.round((dataForToday.temperatureMax-32)/1.8);
        return tempcelsius;
    }else{
        return "Temperature not available";
    }
}

function retrieveWeather(latitude, longitude, when, whereToPut, clothes){
    //var time = '2019-02-12T21:00:00';
    var whenNumber = Math.ceil(when.getTime() / 1000);
    $.ajax({
        url:`https://api.darksky.net/forecast/71d34a6ec505b1fb78d02e89a583eac3/${latitude},${longitude},${whenNumber}`,
        // dataType: 'json'
        dataType: 'jsonp'

    }).done(function(data){

        var city = extractCity(data);
        var formatedDate = extractDate(data);
        var tempcelsius = formatTemperature(data);
        var x = clothingRecommandation(data);
        
        
        console.log(tomorrow);

        whereToPut.find(".location").text("You are in " + city);
        whereToPut.find(".todaysDate").text("Today's date: " + formatedDate);
        whereToPut.find(".temperatureMax").text("Max temperature: " + tempcelsius + " degrees");
        whereToPut.find(".precipProbability").text("Chance of rain: " + x.text );
        // debugger;
        clothes.find(".clothing").attr("src", x.image);    

    });

}

function updateButton(){
    var button = document.querySelector('#clickButton');
    if (window.currentView == 'today'){
        window.currentView = 'tomorrow';
        button.textContent = 'Show Tomorrow >';

    } else if (window.currentView == 'tomorrow'){ 
        window.currentView = 'today';
        button.textContent = '< Show Today';
    } 
}

var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate()+1);

window.currentView = 'today';
updateButton()

geoLocation(retrieveWeather, today, $('#forecast'), $('#clothes'));

// $('#clickButton').click(function(event) {
//     geoLocation(retrieveWeather, tomorrow, $('#forecast'), $('#clothes'));
//     updateButton();
//     geoLocation(retrieveWeather, today, $('#forecast'), $('#clothes'));
//     updateButton();

// })

$('#clickButton').click(function(event) {
    var weatherDate;
    if(window.currentView == 'today') {
     weatherDate = today;
    } else {
     weatherDate = tomorrow;
    }
  geoLocation(retrieveWeather, weatherDate, $('#forecast'), $('#clothes'));
  updateButton();
})

// // =================

// function thingToDoWhenClicked() {
//    console.log("I was clicked!")
// }
// document.addEventListener('click', thingToDoWhenClicked);

// // =================

// document.addEventListener('click', function() {
//    console.log("I was clicked!")
// });

