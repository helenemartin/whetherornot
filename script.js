var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

var advice = {
    
        "1": {text:"Very likely", images:["img/burberry.jpg", "img/mexxcoat.jpg", "img/zararaincoat.jpg", "img/jaegercoat.jpg"]},
        "0.80": {text:"Likely", images: ["img/mexxcoat.jpg", "img/nicolefahrijacket.jpg", "img/jkbennettbrown-with-cardi.jpg"]},
        "0.64": {text:"Unlikely", images: ["img/georgesdress.jpg", "img/nicolefahrijacket.jpg", "img/zararedress.jpg", "img/jkbennettbrown.jpg", "img/annedemeulester.jpg"]},
        "0.10": {text:"none", images: ["img/bretonnecklace.jpg", "img/warehousedress.jpg","img/oasisdress.jpg", "img/hobbesdress.jpg", "img/drapedrapegreydress.jpg"]},
}

function geoLocation(renderFunction, when, whereToPut, clothes) {
    
        function thingToDoWhenWeKnowWhereWeAre(location) {
        var { latitude, longitude } = location.coords;
        renderFunction(latitude, longitude, when, whereToPut, clothes);
    }

    navigator.geolocation.getCurrentPosition(thingToDoWhenWeKnowWhereWeAre);
    console.log("hello", renderFunction);

    
}

function chooseRandImages(images){
    var randChoice = Math.floor (Math.random() * images.length);
    console.log('chooseRandImages', randChoice, images, images[randChoice]);
    return images[randChoice];

}

function clothingRecommandation(data){
 
    var dataForToday = data.daily.data[0];
    if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
        var message = advice;
        var advicestring = parseFloat([dataForToday.precipProbability]);

        switch(true) {
            case advicestring <= 0.1:
                return advice["0.10"];
                break;
            case advicestring < 0.65:
                return advice["0.64"];
                break;
            case advicestring < 0.81:
                return advice["0.80"];
                break;
            case advicestring <= 1:
                return advice["1"];
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
        dataType: 'jsonp',
        
    }).done(function(data){

        $(".hiddenButton").css('visibility', 'visible'); 
        var city = extractCity(data);
        var formatedDate = extractDate(data);
        var tempcelsius = formatTemperature(data);
        var x = clothingRecommandation(data);
        console.log("image", x);
        //go find html, recreate image
        
        var imageDiv = document.querySelector('.slider');
   
        imageDiv.style.left= 0;
        //prevents propagation of image even before the image is appended
        imageDiv.innerHTML= '';


        x.images.forEach(function(imageUrl){
            var images = document.createElement('img');
            var imagesWrapper = document.createElement('div');
            imagesWrapper.className = 'image-wrapper';
            imagesWrapper.appendChild(images);
            //set src
           
            // set as src= x.image
            images.setAttribute('src', imageUrl);
            imageDiv.appendChild(imagesWrapper);
                       

            

        });

        whereToPut.find(".location").text("You are in " + city);
        whereToPut.find(".todaysDate").text(formatedDate);
        whereToPut.find(".temperatureMax").text("Max temperature: " + tempcelsius + " degrees");
        whereToPut.find(".precipProbability").text("Chance of rain: " + x.text );


        // spinner  
        var loadingDiv = document.querySelector('.loading-wrapper');
        loadingDiv.style.display = 'none'; 

    });

}

// setTimeout(function(){
//     console.log("dfah");
//    $(".hiddenButton").css('visibility', 'visible'); 
// }, 3000); 



var currentDate = new Date();
var today = new Date();

// date array= [];

function areDatesEqual(date1, date2){
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}


// geoLocation(retrieveWeather, today, $('#forecast'), $('#clothes'));

function togglePreviousButton(date, today){
    var previousButton = document.querySelector('#prevDate');
    if (areDatesEqual(date, today)) {
        previousButton.style.display = 'none'; 
    } else {
        previousButton.style.display = 'inline-block';
    }

}
// function buttonHiddenWhenLoading(){
//     var nextButton = document.querySelector('#nextDate');
//     var maxDate = new Date(today.getTime());
//     maxDate.setDate(maxDate.getDate() + 7)

//     if (maxDate <= date) {
//         nextButton.style.display = "none";
//     } else {
//         nextButton.style.display = "inline-block";
//     }
    
// }

// setInterval(view_stack, 1000);

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
    geoLocation(retrieveWeather, currentDate, $('#forecast'), $('#clothes'));
});
 

$('#prevDate').click(function(event) {
    currentDate.setDate(currentDate.getDate()-1);
    togglePreviousButton(currentDate, today);
    toggleNextButton(currentDate, today);
    geoLocation(retrieveWeather, currentDate, $('#forecast'), $('#clothes'));
});




function moveImageLeft () {
     var slider = document.querySelector('.slider');
    // console.log("hello", slider.style);
    var slides = $(document).find('.image-wrapper');
    //play with line 231 check length of slider then check if the left attribute is equal the maximum %
    var isAtItsPlace = slider.style.left === 0 + '%';
    console.log(isAtItsPlace, "Hello left");
    console.log(slider.style.left, "so stylish left");
    console.log(0, "boohoo left");
    if (isAtItsPlace){
        console.log("is this the begining?");
        clearInterval(slideInterval);
        
    } else {
        var left = parseFloat(slider.style.left) || 0;
        slider.style.left= Math.max(left +100, -(slides.length+1) * +100) + '%';
    }
    // var slider = document.querySelector('.slider');
    // console.log("hello", slider.style);
    // var slides = $(document).find('.image-wrapper');
    // var left = parseFloat(slider.style.left) || 0;
    // slider.style.left= Math.max(left + 100, 0) + '%';
}


var slideInterval;

function startSliddingRight(){
    console.log("starting go right function");
    slideInterval = window.setInterval(moveImageRight, 2000);
};

function startSliddingLeft(){
    console.log("starting go left function");
    slideInterval = window.setInterval(moveImageLeft, 2000);
};

function moveImageRight () {

    var slider = document.querySelector('.slider');
    // console.log("hello", slider.style);
    var slides = $(document).find('.image-wrapper');
    //play with line 231 check length of slider then check if the left attribute is equal the maximum %
    var isAtItsPlace = slider.style.left === -(slides.length-1)*100 + '%';
    console.log(isAtItsPlace, "Hello");
    console.log(slider.style.left, "so stylish");
    console.log(-(slides.length-1)*100, "boohoo");
    if (isAtItsPlace){
        console.log("is this the end?");
        clearInterval(slideInterval);
        
    } else {
    var left = parseFloat(slider.style.left) || 0;
    slider.style.left= Math.max(left -100, (slides.length -1) * -100) + '%';
    }
}

function handleRightButtonClick() {
    moveImageRight();
    startSliddingRight();
}

function handleLeftButtonClick() {
    moveImageLeft();
    startSliddingLeft();
}



// var loadingButton = document.querySelector('#nextDate');
//     loadingButton.style.visibility = 'visible';

//here when the "Next Button" is clicked start startSlidding function
$('.clothesforth').click(handleRightButtonClick);
$('.clothesback').click(handleLeftButtonClick);

// setInterval(function(){ alert("Hello"); }, 3000); 

    
$(document).ready(function() {
    
    togglePreviousButton(currentDate, today);
    toggleNextButton(currentDate, today);
    geoLocation(retrieveWeather, currentDate, $('#forecast'), $('#clothes'));
});

//clear interval here




