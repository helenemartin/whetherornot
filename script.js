function retrieveWeather(){
    $.ajax({
        url:"https://api.darksky.net/forecast/71d34a6ec505b1fb78d02e89a583eac3/51.519271, -0.093146",
        // dataType: 'json'
        dataType: 'jsonp'

    }).done(function(data){

        console.log(data);

        var dataForToday = data.daily.data[0];

        console.log(dataForToday);
        console.log(dataForToday.time);
        // var t = dataForToday.time;
        // var date = new Date(t*1000);

                // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(dataForToday.time*1000);

        var formatedDate = (date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear());
        console.log(date);
        // Hours part from the timestam
       

        console.log("using data for:" , formatedDate)



         $("#location").text("You are in : " + data.timezone)
        $("#todaysDate").text("Today's date : " + formatedDate)

        if (dataForToday.temperatureMax !== undefined && dataForToday.temperatureMax !== null) {
            $("#temperatureMax").text("Max temp :" + dataForToday.temperatureMax)
        }

        if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
            $("#precipProbability").text("Chance of Rain :" + dataForToday.precipProbability ) 
            if (dataForToday.precipProbability < 0.2) {
                $("#clothing").attr("src", "img/swimsuit.jpg")
            }
            else{
                $("#clothing").attr("src", "img/burber.jpg")
            }

        }
    

    });


}

retrieveWeather()

