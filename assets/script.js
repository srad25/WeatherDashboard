//set global variables
var apiKey = "f322c7793583902f369eccf35a45e731";
var cities = [];

var searchForm=document.querySelector("#searchInput");
var cityInput=document.querySelector("#city");
var currentWeatherEl=document.querySelector("#cWContainer");
var cityNameEl = document.querySelector("#namedCity");
var forecastFive = document.querySelector("#forecast");
var forecastDaily = document.querySelector("#fiveContainer");
var loggedBtnEl = document.querySelector("#loggedSearchBtn");



var getCity = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    loggedCity(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

     
var loggedCity = function(loggedCity){

    loggedCityEl = document.createElement("button");
    loggedCityEl.textContent = loggedCity;
    loggedCityEl.classList = "d-flex p-2 btn-dark w-100";
    loggedCityEl.setAttribute("data-city",loggedCity)
    loggedCityEl.setAttribute("type", "submit");

    loggedBtnEl.prepend(loggedCityEl);
}


var getCityData = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}
searchForm.addEventListener("submit", getCity);
loggedBtnEl.addEventListener("click", getCityData);

 //Get weather info for searched city
var getCityWeather = function(city){
    apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

   fetch(apiURL)
   .then(function(response){
       response.json().then(function(data){
           displayWeather(data, city);
       });
   });
};

var displayWeather = function(weather, searchCity){
  //Clear old content
  currentWeatherEl.textContent= "";  
  cityNameEl.textContent=searchCity;

  //Date element
  var currentDate = document.createElement("span")
  currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  cityNameEl.appendChild(currentDate);

  //Image element
  var weatherIcon = document.createElement("img")
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  cityNameEl.appendChild(weatherIcon);

  //create a span for temp, humidity, wind
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item"
 
  
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item"

  
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item"

  //append to container
  currentWeatherEl.appendChild(temperatureEl);

  currentWeatherEl.appendChild(humidityEl);

  currentWeatherEl.appendChild(windSpeedEl);

  //Get Uv index
  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat,lon)
}

var getUvIndex = function(lat,lon){
   apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
   fetch(apiURL)
   .then(function(response){
       response.json().then(function(data){
           displayUvIndex(data)
       
       });
   });
   
   
}

var displayUvIndex = function(index){
   var uvIndexEl = document.createElement("div");
   uvIndexEl.textContent = "UV Index: "
   uvIndexEl.classList = "list-group-item"

   uvIndexValue = document.createElement("span")
   uvIndexValue.textContent = index.value

   if(index.value <=2){
       uvIndexValue.classList = "favorable"
   }else if(index.value >2 && index.value<=8){
       uvIndexValue.classList = "moderate "
   }
   else if(index.value >8){
       uvIndexValue.classList = "severe"
   };

   uvIndexEl.appendChild(uvIndexValue);

   //append index to current weather
   currentWeatherEl.appendChild(uvIndexEl);
}

var get5Day = function(city){
   apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

   fetch(apiURL)
   .then(function(response){
       response.json().then(function(data){
          display5Day(data);
       });
   });
};

var display5Day = function(weather){
   forecastDaily.textContent = ""
   forecastFive.textContent = "5-Day Forecast:";

   var forecast = weather.list;
       for(var i=5; i < forecast.length; i=i+8){
      var dailyForecast = forecast[i];
       
      
      var forecastEl=document.createElement("div");
      forecastEl.classList = "card bg-primary text-light m-1";

      

      //Date element
      var forecastDate = document.createElement("h5")
      forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
      forecastDate.classList = "card-header text-center"
      forecastEl.appendChild(forecastDate);

      
      //Image element
      var weatherIcon = document.createElement("img")
      weatherIcon.classList = "card-body text-center";
      weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

      //append to forecast card
      forecastEl.appendChild(weatherIcon);
      
      //Temperature span
      var forecastTempEl=document.createElement("span");
      forecastTempEl.classList = "card-body text-center";
      forecastTempEl.textContent = dailyForecast.main.temp + " °F";

       //append to forecast card
       forecastEl.appendChild(forecastTempEl);
       
       //Humidity span
      var forecastHumEl=document.createElement("span");
      forecastHumEl.classList = "card-body text-center";
      forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

      //append to forecast card
      forecastEl.appendChild(forecastHumEl);

       
      //append to fiveContainer
       forecastDaily.appendChild(forecastEl);
   }

}
