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
