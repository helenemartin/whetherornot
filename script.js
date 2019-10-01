var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

var advice = {
    
        "1": {text:"What a rainy day", images:["img/burberry.jpg", "img/mexxcoat.jpg", "img/jaegercoat.jpg", "img/zararaincoat.jpg", "img/jaegercoat.jpg"]},
        "0.80": {text:"It will rain", images: ["img/mexxcoat.jpg", "img/nicolefahrijacket.jpg", "img/jkbennettbrown-with-cardi.jpg", "img/mexxcoat.jpg", "img/nicolefahrijacket.jpg"]},
        "0.64": {text:"It won't rain", images: ["img/georgesdress.jpg", "img/zararedress.jpg", "img/jkbennettbrown.jpg", "img/annedemeulester.jpg", "img/drapedrapegreydress.jpg"]},
        "0.10": {text:"It will be sunny", images: ["img/bretonnecklace.jpg", "img/warehousedress.jpg","img/oasisdress.jpg", "img/hobbesdress.jpg", "img/drapedrapegreydress.jpg"]},
}
var currentIndex = 0;
var currentData;

function geoLocation(renderFunction, when, whereToPut, clothes) {
    
        function thingToDoWhenWeKnowWhereWeAre(location) {
        var { latitude, longitude } = location.coords;
        renderFunction(latitude, longitude, when, whereToPut, clothes);
    }

    navigator.geolocation.getCurrentPosition(thingToDoWhenWeKnowWhereWeAre);
    console.log("hello", renderFunction);

    
}


function clothingRecommandation(data){
 
    var dataForToday = data.daily.data[0];
    if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
        var message = advice;
        var advicestring = parseFloat([dataForToday.precipProbability]);
        
        switch(true) {
            case advicestring <= 0.1:
                return advice["0.10"];
            case advicestring < 0.65:
                return advice["0.64"];
            case advicestring < 0.81:
                return advice["0.80"];
            case advicestring <= 1:
                return advice["1"];
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
        dataType: 'jsonp',
        
    }).done(function(data){
        currentData = data;
        $(".hiddenButton").css('visibility', 'visible'); 
        var city = extractCity(data);
        var formatedDate = extractDate(data);
        var tempcelsius = formatTemperature(data);
        var x = clothingRecommandation(data);
        console.log("image", x);
        //go find html, recreate image
        appendImages();
    
       
        whereToPut.find(".location", ".todayDate").text(city  + ", " + formatedDate + ",");
        // whereToPut.find(".todaysDate").text(formatedDate);
        whereToPut.find(".temperatureMax", "precipProbability").text("Here we go, it is " + tempcelsius + " deg, today!" + x.text + ". I wonder what to wear ...");
        // whereToPut.find(".precipProbability").text();


        // spinner  
        var loadingDiv = document.querySelector('.loading-wrapper');
        loadingDiv.style.display = 'none'; 

    });

}

function appendImages(){
    var imageCollection = clothingRecommandation(currentData);
    var imageDiv = document.querySelector('.j-slider');
    imageDiv.style.left= 0 + '%';
     for (i=0; i<imageCollection.images.length;i++){
        var imageUrl = imageCollection.images[i];
        var newElement = document.createElement('img');
        imageDiv.appendChild(newElement);
        newElement.setAttribute('src', imageUrl); 

     }
    
}


var currentDate = new Date();
var today = new Date();

// date array= [];

function areDatesEqual(date1, date2){
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}


// geoLocation(retrieveWeather, today, $('#j-forecast'), $('#j-clothes'));

function togglePreviousButton(date, today){
    var previousButton = document.querySelector('#prevDate');
    if (areDatesEqual(date, today)) {
        previousButton.style.display = 'none'; 
    } else {
        previousButton.style.display = 'inline-block';
    }

}

function toggleNextButton(date, today) {
    // console.log(date);
    var nextButton = document.querySelector('#nextDate');
    var maxDate = new Date(today.getTime());
    maxDate.setDate(maxDate.getDate() + 7)

    if (maxDate <= date) {
        nextButton.style.display = "none";
    } else {
        nextButton.style.display = "inline-block";
    }
        
}

$('#nextDate').click(function(event) {
    currentDate.setDate(currentDate.getDate()+1);
    togglePreviousButton(currentDate, today);
    toggleNextButton(currentDate, today);  
    geoLocation(retrieveWeather, currentDate, $('#j-forecast'), $('#j-clothes'));
});
 

$('#prevDate').click(function(event) {
    currentDate.setDate(currentDate.getDate()-1);
    togglePreviousButton(currentDate, today);
    toggleNextButton(currentDate, today);
    geoLocation(retrieveWeather, currentDate, $('#j-forecast'), $('#j-clothes'));
});


var slider = document.querySelector('.j-slider');


function moveImageLeft () {
    var slides = $(document).find('.j-slider img');
    var left = parseFloat(slider.style.left) || 0;
    //247
    slider.style.left= Math.max(left +100, -(slides.length+1) * +100) + '%';

}


function moveImageRight () {

    var slides = $(document).find('.j-slider img');
    var left = parseFloat(slider.style.left) || 0;
    //to do
    slider.style.left= Math.max(left -100, (slides.length -1) * -100) + '%';
   
}



function handleRightButtonClick() {
     var slides = $(document).find('.j-slider img');
    var isAtItsPlace = slider.style.left === -(slides.length-1)*100 + '%';
    if(isAtItsPlace) {
        //if at the end move to beginning
        slider.style.left = 0 + '%';
        return;
    }
    moveImageRight();
}

function handleLeftButtonClick() {
    var slides = $(document).find('.j-slider img');
    var isAtItsPlace = slider.style.left === 0 + '%';
    if(isAtItsPlace){
        //if at the beginning move to the end
        slider.style.left = -(slides.length-1)*100 + '%';
        return;
    };
    moveImageLeft();
}



$('.clothesforth').click(handleRightButtonClick);
$('.clothesback').click(handleLeftButtonClick);


    
$(document).ready(function() {
    
    togglePreviousButton(currentDate, today);
    toggleNextButton(currentDate, today);
    geoLocation(retrieveWeather, currentDate, $('#j-forecast'), $('#j-clothes'));
});

//clear interval here




