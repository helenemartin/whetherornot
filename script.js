var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

var advice = {
    "0.10": "very likely",
    "0.64": "likely", 
    "0.80": "unlikely",
    "1": "none",
}
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
        var dayweek = date.getDay();
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var formatedDate = days[dayweek] + " " + day + " " + months[month] + " " + year;
        //var formatedDate = (date.toDateString());
        console.log(date);
        // Hours part from the timestam
       

        console.log("using data for:" , formatedDate)

        var zone = data.timezone;
        var city = zone.split("/");


        console.log(zone);

        $("#location").text("You are in " + city[1])
        $("#todaysDate").text("Today's date: " + formatedDate)

        if (dataForToday.temperatureMax !== undefined && dataForToday.temperatureMax !== null) {

            var tempcelsius = Math.round((dataForToday.temperatureMax-32)/1.8);

            $("#temperatureMax").text("Max temperature: " + tempcelsius + " degrees");
        }

        if (dataForToday.precipProbability  !== undefined && dataForToday.precipProbability  !== null) {
            debugger
            var message = advice;
            console.log('advice' + "helene");
            var advicestring = parseFloat([dataForToday.precipProbability]);
            console.log(advicestring);
            

            switch(true) {

                case advicestring <= 0.1:
                    $("#precipProbability").text("Chance of rain: " + "very likely" );
                    $("#clothing").attr("src", "img/burber.jpg");
                    
                    break;
                case advicestring < 0.65:
                    $("#precipProbability").text("Chance of rain: " + "likely" );
                    $("#clothing").attr("src", "img/burber.jpg");
                    
                    break;
                case advicestring < 0.81:
                    $("#precipProbability").text("Chance of rain: " + "unlikely" );
                    $("#clothing").attr("src", "img/swimsuit.jpg");
                    break;
                case advicestring <= 1:
                    $("#precipProbability").text("Chance of rain: " + "none" );
                    $("#clothing").attr("src", "img/swimsuit.jpg");
                    break;



                default:
                    console.log("no values");


            }


        }
    

    });


}

retrieveWeather()

