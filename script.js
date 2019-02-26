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
    
        "1": {text:"Very likely", images:["img/burber.jpg", "img/yvessaintlaurent.jpg"]},
        "0.80": {text:"Likely", images: ["img/inesfressange.jpg", "img/yvessaintlaurent.jpg"]},
        "0.64": {text:"Unlikely", images: ["img/inesfressange.jpg", "img/diordress.jpg", "img/madeleine-vionnet.jpg"]},
        "0.10": {text:"none", images: ["img/Burberry_Prorsum.png","img/swimsuit.jpg"]},
    }
    
   
    function chooseRandImages(images){
        var randChoice = Math.floor (Math.random() * images.length);
        console.log('chooseRandImages', randChoice, images, images[randChoice]);
         return images[randChoice];

    }
    console.log("hello", advice);

    var dataForToday = data.daily.data[0];
    if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
        var message = advice;
        var advicestring = parseFloat([dataForToday.precipProbability]);
        var choosenAdvice = null;

        switch(true) {
            case advicestring <= 0.1:
                choosenAdvice = advice["0.10"];
                break;
            case advicestring < 0.65:
                choosenAdvice = advice["0.64"];
                break;
            case advicestring < 0.81:
                choosenAdvice = advice["0.80"];
                break;
            case advicestring <= 1:
                choosenAdvice = advice["1"];
                break;
            default:
        }
        
        
        choosenAdvice.image = chooseRandImages(choosenAdvice.images);
        console.log('choosenAdvice', choosenAdvice);
        return choosenAdvice;
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
        dataType: 'jsonp',
        
    }).done(function(data){

        var city = extractCity(data);
        var formatedDate = extractDate(data);
        var tempcelsius = formatTemperature(data);
        var x = clothingRecommandation(data);
        //go find html, recreate image
        

        var images = document.createElement('img');
        //set src
        var imageDiv = document.querySelector('.void');
        //prevents propagation of image even before the image is appended
        if (imageDiv.hasChildNodes()){imageDiv.removeChild(imageDiv.firstChild)}; 
        // set as src= x.image
        images.setAttribute('src', x.image);
        imageDiv.appendChild(images);


        
        
        console.log(tomorrow);

        whereToPut.find(".location").text("You are in " + city);
        whereToPut.find(".todaysDate").text(formatedDate);
        whereToPut.find(".temperatureMax").text("Max temperature: " + tempcelsius + " degrees");
        whereToPut.find(".precipProbability").text("Chance of rain: " + x.text );
        // debugger;
        // clothes.find(".clothing").attr("src", x.image);
        // clothes(".clothing").attr("src", x.image); 

        //spinner  
        var loadingDiv = document.querySelector('.loading');
        loadingDiv.style.display = 'none'; 


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

