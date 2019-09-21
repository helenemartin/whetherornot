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
        updateGallery();
       
        whereToPut.find(".location", ".todayDate").text(city  + ", " + formatedDate);
        // whereToPut.find(".todaysDate").text(formatedDate);
        whereToPut.find(".temperatureMax").text("Oh delightful, it is " + tempcelsius + " deg, today");
        whereToPut.find(".precipProbability").text(x.text );


        // spinner  
        var loadingDiv = document.querySelector('.loading-wrapper');
        loadingDiv.style.display = 'none'; 

    });

}

function appendImages(){
    var imageCollection = clothingRecommandation(currentData);
    var imageDiv = document.querySelector('.j-slider');
     for (i=0; i<imageCollection.images.length;i++){
        var imageUrl = imageCollection.images[i];
        var newElement = document.createElement('img');
        imageDiv.appendChild(newElement);
        newElement.setAttribute('src', imageUrl); 

     }
    
}

function updateGallery(){
        var imageCollection = clothingRecommandation(currentData);
        if (currentIndex < 0){
            currentIndex = imageCollection.images.length-1;

        } else if(currentIndex > imageCollection.images.length) {
            currentIndex = 0;

        }
      var imageDiv = document.querySelector('.j-slider');
   
        imageDiv.style.left= 0;
        var current = imageCollection.images[currentIndex];
        // var next = imageCollection.images[currentIndex+1];
        // var previous = imageCollection.images[currentIndex-1];
        if (currentIndex < 0){
            var lastImage = imageCollection.images[imageCollection.images.length-1];
            current = lastImage;

        }

        else if (currentIndex > (imageCollection.images.length-1)) {
            var firstImage = imageCollection.images[0];
            next = firstImage;
        }

            // var galleryImages = [previous, current, next];
            // var galleryElements = imageDiv.children;
            // galleryImages.forEach(function(imageUrl,index){
            // var currentElement = galleryElements[index];

        

        var slider = document.querySelector('.j-slider');
        // slider.style.left = ("-100%");

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




function moveImageLeft () {
     var slider = document.querySelector('.j-slider');
    // console.log("hello", slider.style);
    var slides = $(document).find('.j-slider img');
    //play with line 231 check length of slider then check if the left attribute is equal the maximum %
    slider.classList.add('slider-animating');
    //to do
    var isAtItsPlace = slider.style.left === 0 + '%';
    console.log(isAtItsPlace, "Hello left");
    console.log(slider.style.left, "so stylish left");
    console.log(0, "boohoo left");
    if (isAtItsPlace){
        console.log("is this the begining?");
        clearInterval(slideInterval);
        
    } else {
        var left = parseFloat(slider.style.left) || 0;
        //247
        slider.style.left= 0;
    }
    slider.addEventListener("transitionend", function onTransitionEnd(){
        slider.classList.remove('slider-animating');
        currentIndex = currentIndex -1;
        updateGallery();
        slider.removeEventListener("transitionend", onTransitionEnd);
    })
}


function moveImageRight () {

    var slider = document.querySelector('.j-slider');
    var slides = $(document).find('.j-slider img');
    slider.classList.add('slider-animating');
    var isAtItsPlace = slider.style.left === -(slides.length-1)*100 + '%';
    console.log(isAtItsPlace, "Hello");
    console.log(slider.style.left, "so stylish");
    console.log(-(slides.length-1)*100, "boohoo");
    if (isAtItsPlace){
        console.log("is this the end?");
        
    } else {
    var left = parseFloat(slider.style.left) || 0;
    //to do
    slider.style.left= Math.max(left -100, (slides.length -1) * -100) + '%';
    }
    slider.addEventListener("transitionend", function onTransitionEnd(){
        slider.classList.remove('slider-animating');
        currentIndex = currentIndex +1;
        updateGallery();
        slider.removeEventListener("transitionend", onTransitionEnd);
    })
}



var slideInterval;

function startSliddingRight(){
    console.log("starting go right function");
    clearInterval(slideInterval);
    slideInterval = window.setInterval(moveImageRight, 3000);
};

function startSliddingLeft(){
    console.log("starting go left function");
    clearInterval(slideInterval);
    slideInterval = window.setInterval(moveImageLeft, 3000);
};



function handleRightButtonClick() {
    moveImageRight();
    startSliddingRight();
}

function handleLeftButtonClick() {
    moveImageLeft();
    startSliddingLeft();
}



$('.clothesforth').click(handleRightButtonClick);
$('.clothesback').click(handleLeftButtonClick);


    
$(document).ready(function() {
    
    togglePreviousButton(currentDate, today);
    toggleNextButton(currentDate, today);
    geoLocation(retrieveWeather, currentDate, $('#j-forecast'), $('#j-clothes'));
});

//clear interval here




