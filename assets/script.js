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
