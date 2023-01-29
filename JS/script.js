// TODO: Style current HTML

const apiKey = "c7875164b13a0aa55846b5cd71026a96";
const history = JSON.parse(localStorage.getItem('history')) || [];

// Populates history list from local storage when page loads

function createHistoryBtn(text){
    var newBtn = $("<button>").text(text);
    $("#history").append(newBtn);
};

function checkHistory () {
    for (let i = 0; i < history.length; i++) {
        createHistoryBtn(history[i]);
    }
};
checkHistory();


$('#search-form').on('submit', function(event) {
    event.preventDefault();

    const userInput = $('#search-input').val();
    const queryUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=5&appid=' + apiKey;
    
       

    // Add the history to local storage
    history.push(userInput);
    localStorage.setItem('history', JSON.stringify(history));
    // puts the search value on the history list container, calling the function on line 8
    createHistoryBtn(userInput);

    // Call Geocoding API when search form is submitted to find city lat and long value
    $.ajax({ url: queryUrl })
        .then(function(response) {
            const lat = response[0].lat;
            const lon = response[0].lon;

            const weatherQueryUrl = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

            // Call 5 day weather forecast API after we have city lat and lon value
            $.ajax({ url: weatherQueryUrl })
                .then(function(weatherResponse) {
                    // Icon URL http://openweathermap.org/img/w/" + iconcode + ".png"

                    // Put the response on the HTML page
                    const weatherList = weatherResponse.list;
                    // Now forecast
                    const today = weatherList[0];
                    console.log(today);
                    console.log(weatherResponse.list)
                     // TODO: put today's weather in container for today's weather
                    var lineOne = $("<h1>");
                    var cityName = userInput;
                    var date = moment().format("DD/MM/yyyy");
                    var iconCode = weatherResponse.list[0].weather[0].icon;
                    var iconUrl = $("<img>").attr("src","https://openweathermap.org/img/w/" + iconCode + ".png");
                    $(lineOne).append(cityName + "  " + "(" + date + ")");
                    $("#today").append(lineOne);
                    $(lineOne).append(iconUrl);
                    // 5 days forecast
                    for (let i = 1; i < weatherList.length; i += 8) {
                        const weather = weatherList[i];
                        console.log(weather);
                        // TODO: put 5 day's forecast weather in container for the 5 day forecast
                    }
                });
        });
});