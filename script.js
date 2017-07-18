function retrieveWeather(){
    $.ajax({
        url:"https://api.darksky.net/forecast/71d34a6ec505b1fb78d02e89a583eac3/51.519271, -0.093146",
        // dataType: 'json'
        dataType: 'jsonp'

    }).done(function(data){
        

            // data.categories.forEach(function(category) {
            //     $("#genres").append("<li id=\"" + category.key + "\">" + category.title + "</li>");

            //     console.log(category.title);


                
    // console.log(data);
        // });
  

        
    }).fail(function(){

    }).always(function(){
    


    });


}

retrieveWeather()
