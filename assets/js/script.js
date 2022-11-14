// global variables
var apiKey = "11edfe351cfb2bd0d58549330b28135a";
var today = dayjs();
var currentWeather = $("#current-weather");
var forecast = $("#five-day-forecast");

// this function saves the city to local storage
function saveCity(newCity) {
  var citySaved = false;
  // checks to see if city exists in the localstorage
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage["cities" + i] === newCity) {
      citySaved = true;
      break;
    }
  }
// if the city is not already in localstorage, will save to local storage here
  if (citySaved === false) {
    localStorage.setItem("cities" + localStorage.length, newCity);
  }
  };

// function to get the five day forecast, build cards, and append to html
function fiveDayForecast() {
  var city = $("#city-search").val();
  var searchUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey;

  $.ajax({
  url: searchUrl,
  method: "GET",
  crossDomain: true,
}).then(function (response) {
  console.log(response);

  // create header and parent div elements for the 5-day forecast and append to parent div
  // I suspect the "undefined" text is coming from somewhere around here
  // var fiveDayHeader = $("<h2>");
  // fiveDayHeader.text("Five Day Forecast:");
  // forecast.append(fiveDayHeader);
  // var forecastDiv = $("<div>");
  // forecastDiv.addClass("d-inline-flex flex-wrap");
  // forecast.append(forecastDiv);

  var fiveDayHeader = `<h2> Five Day Forecast: </h2>
                          <div class="d-inline-flex flex-wrap>`;
  forecast.html(fiveDayHeader);

  // loops through the 5 day forecast responses and builds cards showing the data from the afternoon for each day
  for (var i = 0; i < response.list.length; i++) {
    var dayData = response.list[i];
    var timeDate = dayjs.unix(dayData.dt);
    var dateFormatted = timeDate.format("MM/DD/YYYY");
    var cardHtml;
    var iconUrl =
      "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
      // builds cards from only hours in the late afternoon, the warmest point of the day
    if (timeDate.$H === 15 || timeDate.$H === 16 || timeDate.$H === 17 || timeDate.$H === 18) {
      // adds the following code block to cardHtml for every instance above as the for loop goes through the response from the API
      cardHtml += 
      `<div class="card m-2">
        <ul class="list-unstyled p-3">
            <li>${dateFormatted}</li>
            <li><img src="${iconUrl}"></li>
            <li>Temp: ${dayData.main.temp}&#8451;</li>
            <li>Wind: ${dayData.wind.speed} km/h</li>
            <li>Humidity: ${dayData.main.humidity}%</li>
        </ul>
      </div>`;
    };
  };
// fills forecastdiv with the html created in the for loop
fiveDayHeader.html(cardHtml);
fiveDayHeader += `</div>`;
});
};

// prints search history as a clickable list populated from the localstorage
function printHistory() {
  $("#search-history").empty();

  // if there are cities stores in local storage, print them to a list under the search bar
  if (localStorage.length >= 0) {

    for (var i = 0; i < localStorage.length; i++) {
      var city = localStorage.getItem("cities" + i);
      var cityListEl;
      cityListEl = `<button class="list-group-item list-group-item-action">${city}</button>`;
      // posts the new button above the rest, so the most recent searched city is on top
      $("#search-history").prepend(cityListEl);
    }

    // if localstorage is populated, will create a clear prompt to allow the user to clear localstorage
    $("#clear-history").html($('<a id="clear-history" href="#">clear</a>'));
  } else {
    $("#clear-history").html("");
  }
};

// this function gets the current conditions from the openweather API, rather than the forecast
function getCurrentWeather() {
  var city = $("#city-search").val();
  var searchUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    apiKey;
  
// queries the API, then saves the searched city to local storage, builds the current weather section html and appends it to the html
  $.ajax({
    url: searchUrl,
    method: "GET",
    crossDomain: true,
  }).then(function (response) {
    console.log(response);
    saveCity(city);
    var currentWeatherIcon =
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

    var currentWeatherHTML = `
        <h3>${response.name} ${today.format("MM/DD/YYYY")} <img src="${currentWeatherIcon}"></h3>
            <ul class="list-unstyled">
              <li>Temp: ${response.main.temp}&#8451;</li>
              <li>Wind: ${response.wind.speed} mph</li>
              <li>Humidity: ${response.main.humidity}%</li>
            </ul>`;
    
    $("#current-weather").html(currentWeatherHTML);       
  });
};

// serach button clears forecast html, sets searched city to current city, calls functions to populate page
$("#search-button").on("click", function(event) {
  event.preventDefault();
  forecast.html("");
  currentCity = $("#city-search").val();
  getCurrentWeather();
  fiveDayForecast();
  printHistory();
});

// clicking on the search history cities will search the city, clear the forecast html, and call functions to populate page
$("#search-history").on("click", function(event) {
  event.preventDefault();
  forecast.html("");
  $("#city-search").val(event.target.textContent);
  currentCity = $("#ciity-search").val();
  getCurrentWeather();
  fiveDayForecast();
  printHistory();
});

// clear history prompt will clear the local storage and update the search history buttons
$("#clear-history").on("click", function() {
  localStorage.clear();
  printHistory();
});