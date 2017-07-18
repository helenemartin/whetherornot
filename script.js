function retrieveWeather(){
    $.ajax({
        url:"https://api.darksky.net/forecast/71d34a6ec505b1fb78d02e89a583eac3/51.519271, -0.093146",
        // dataType: 'json'
        dataType: 'jsonp'

    }).done(function(data){

        var dataForToday = data.daily.data[0];

        var t = dataForToday.time;
        

        var date = new Date(t*1000);

        console.log("using data for:" , date)


            // data.categories.forEach(function(category) {
            //     $("#genres").append("<li id=\"" + category.key + "\">" + category.title + "</li>");

            //     console.log(category.title);

        $("#todaysDate").text("Today's date :" + date)

        if (dataForToday.temperatureMax !== undefined && dataForToday.temperatureMax !== null) {
            $("#temperatureMax").text("Max temp :" + dataForToday.temperatureMax)
        }

        if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
            $("#precipProbability").text("Chance of Rain :" + dataForToday.precipProbability )
        }

                
    // console.log(data);
        // });
  

        
    }).fail(function(){

    }).always(function(){
    


    });


}

retrieveWeather()
