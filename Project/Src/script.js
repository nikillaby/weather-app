let apiKey = "2be4057942a6646e03c109ad19cd8647";
let url = "https://api.openweathermap.org/";
let units = "metric";
let searchBar = document.querySelector("#search-bar");
let citySearch = document.querySelector("#city-search-form");
let unitButton = document.querySelector("#unit-button");
let currentTemperature = document.querySelector("#current-temp");
let currentLowTemperature = document.querySelector("#low-temp");
let tempUnits = document.querySelectorAll(".temp-unit");
let locationButton = document.querySelector("#location-button");
let currentCity = document.querySelector("#current-city");

function formatDate() {
  let today = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let minutes = today.getMinutes().toString().padStart(2, "0");
  let hours = today.getHours().toString().padStart(2, "0");
  let currentTime = `${hours}:${minutes}`;
  let currentDay = days[today.getDay()];
  let currentMonth = months[today.getMonth()];
  let currentDate = today.getDate();

  let formattedDate = `${currentDate} ${currentMonth}, ${currentTime}`;

  let dateOnPage = document.querySelector("#date");
  dateOnPage.innerHTML = `<b>${currentDay}</b> ${formattedDate}`;
}

formatDate();

unitButton.addEventListener("click", changeTempUnits);

function changeTempUnits(event) {
  event.preventDefault();
  if (unitButton.innerHTML === "°C") {
    unitButton.innerHTML = "°F";
    currentTemperature.innerHTML = Math.round(
      ((currentTemperature.innerHTML - 32) * 5) / 9
    );
    currentLowTemperature.innerHTML = Math.round(
      ((currentLowTemperature.innerHTML - 32) * 5) / 9
    );
    tempUnits.forEach(function (unit) {
      unit.innerHTML = "°C";
    });
  } else {
    unitButton.innerHTML = "°C";
    currentTemperature.innerHTML = Math.round(
      (currentTemperature.innerHTML * 9) / 5 + 32
    );
    currentLowTemperature.innerHTML = Math.round(
      (currentLowTemperature.innerHTML * 9) / 5 + 32
    );
    tempUnits.forEach(function (unit) {
      unit.innerHTML = "°F";
    });
  }
}

citySearch.addEventListener("submit", displayData);

function updateData(response) {
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#low-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#humidity-percentage").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#weather-conditions").innerHTML =
    response.data.weather[0].description;
  let city = response.data.name;
  currentCity.innerHTML = city;
}

function displayData(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
    let city = document.querySelector("#search-bar").value;
    axios
      .get(`${url}data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`)
      .then(updateData);

    searchBar.value = "";
  } else {
    axios
      .get(
        `${url}data/2.5/weather?q=${currentCity.innerHTML}&units=${units}&appid=${apiKey}`
      )
      .then(updateData);

    searchBar.value = "";
  }
}

function currentLocation() {
  function showCity(response) {
    let city = response.data[0].name;
    axios
      .get(`${url}data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`)
      .then(updateData);
  }

  function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    axios
      .get(`${url}geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`)
      .then(showCity);
  }

  navigator.geolocation.getCurrentPosition(showPosition);
}

locationButton.addEventListener("click", currentLocation);
currentLocation();
