// Declare global constants
const USERNAME = "carlosaleonr";
const COUNTRYCODE = "US";
const REQUEST_METHOD = "get";
const LOW_TEMPERATURE = 34;
const HIGH_TEMPERATURE = 83;
const WIND_SPEED_CONTANT = 15;

// Method that display the weather in our webpage
const displayWeather = (weatherInFahrenheit, userCity) => {
    // Declare variable and assign hmtl element
    let mainContainer = document.querySelector(".mainContainer");

    // Declare variable, create a html element and assign it attributes
    let weatherContainer = document.createElement("div");
    weatherContainer.setAttribute("class", "weatherContainer");

    // Declare variable for displaying user's city and append in weatherContainer
    let h2Element = document.createElement("h2");
    h2Element.innerHTML = `The Weather and the Wind speed in ${userCity} is:`;
    weatherContainer.appendChild(h2Element);
    
    // Declare variable for displaying weather and append in weatherContainer
    let cityWeather = document.createElement("h3");
    cityWeather.innerHTML = `${weatherInFahrenheit.toFixed(2)}° Fahrenheit`;
    weatherContainer.appendChild(cityWeather);

    // Validate what icons display
    if (weatherInFahrenheit >= HIGH_TEMPERATURE) {
        // Display hot icon
        let hotIcon = document.createElement("img");
        hotIcon.setAttribute("src", "./images/hot.png");
        hotIcon.setAttribute("alt", "Hot pixeled icon");
        weatherContainer.appendChild(hotIcon);
    } else if (weatherInFahrenheit <= LOW_TEMPERATURE) {
        // Display cold icon
        let coldIcon = document.createElement("img");
        coldIcon.setAttribute("src", "./images/cold.png");
        coldIcon.setAttribute("alt", "cold pixeled icon");
        weatherContainer.appendChild(coldIcon);
    } else if (
        weatherInFahrenheit > LOW_TEMPERATURE &&
        weatherInFahrenheit < HIGH_TEMPERATURE
    ) {
        // Display perfectWeather icon
        let goodWeatherIcon = document.createElement("img");
        goodWeatherIcon.setAttribute("src", "./images/perfectWeather.png");
        goodWeatherIcon.setAttribute("alt", "Let's enjoy pixeled icon");
        weatherContainer.appendChild(goodWeatherIcon);

        // Create a html elemnt for displaying a message
        let perfectWeatherMessage = document.createElement("h2");
        perfectWeatherMessage.innerHTML = "Perfect Weather to get fun!!!";
        weatherContainer.appendChild(perfectWeatherMessage);
    }

    // Append weatherContainer to the main container
    mainContainer.appendChild(weatherContainer);
}

// Method that display the wind speed in our webpage
const displayWindSpeed = windSpeed => {

    // Declare variable and assign it a html element
    let mainContainer = document.querySelector(".mainContainer");

    // Declare variable to create a html elment and assign it an attribute
    let windSpeedContainer = document.createElement("div");
    windSpeedContainer.setAttribute("class", "windSpeedContainer");

    // Declare a variables to display wind speed and append to windSpeedContainer
    let cityWindSpeed = document.createElement("h3");
    cityWindSpeed.innerHTML = `${windSpeed.toFixed(2)}mph W Wind`;
    windSpeedContainer.appendChild(cityWindSpeed);
    
    // Validate if we display the wind speed icon
    if (windSpeed > WIND_SPEED_CONTANT) {
        // Displaying wind icon
        let windIcon = document.createElement("img");
        windIcon.setAttribute("src", "./images/wind.png");
        windIcon.setAttribute("alt", "Wind Icon");
        windSpeedContainer.appendChild(windIcon);
    }

    // Append to main container
    mainContainer.appendChild(windSpeedContainer);
}

// Method that convert Celsius to Fahrenheit
const convertCelsiusToFahrenheit = weatherInCelsius => {
    let toFahrenheit = (weatherInCelsius * (9/5)) + 32;
    return toFahrenheit;
}

// Method that obtain the weather using latitude and longitude
const getWeather = (locationLatitude, locationLongitude) => {
    // Declare our variables and assign their values
    let geoNamesUrl = "http://api.geonames.org/findNearByWeatherJSON"
            + "?username=" + USERNAME + "&lat="
            + locationLatitude + "&lng=" + locationLongitude;

    // Create an object request
    let xmlRequest = new XMLHttpRequest();

    // Configure request
    xmlRequest.open(REQUEST_METHOD, geoNamesUrl, true);

    // When state change we call a callback
    xmlRequest.onreadystatechange = () => {
        if (xmlRequest.readyState === 4) {
            // Read json document
            let weatherData = JSON.parse(xmlRequest.response);
            let cityWeather = weatherData.weatherObservation.temperature;
            let userCity = weatherData.weatherObservation.stationName;
            userCity = userCity.split(",")[0];
            let windSpeed = weatherData.weatherObservation.windSpeed;
            windSpeed = Number(windSpeed);

            // Display the weather
            displayWeather(convertCelsiusToFahrenheit(cityWeather), userCity);

            // Display the wind speed
            displayWindSpeed(windSpeed);
        }
    }

    // Send request
    xmlRequest.send(null);
}

// Method to request longitude and latitude
const getLocation = () => {
    // Declare our varibles and assign them values
    let userZipCode = document.querySelector("#userZipCode").value;
    let weatherContainer = document.querySelector(".weatherContainer");
    let windSpeedContainer = document.querySelector(".windSpeedContainer");
    let geoNamesUrl = "http://api.geonames.org/postalCodeSearchJSON"
            + "?username=" + USERNAME + "&postalcode="
            + userZipCode + "&countryCode=" + COUNTRYCODE;

    // Create an object request
    let xmlRequest = new XMLHttpRequest();

    // Configure request
    xmlRequest.open(REQUEST_METHOD, geoNamesUrl, true);

    // When state change we call a callback
    xmlRequest.onreadystatechange = () => {
        // when state is 4 (request is finished)
        if (xmlRequest.readyState === 4) {
            // Read json document
            let locationData = JSON.parse(xmlRequest.response);
            let userLongitude = locationData.postalCodes[0].lng;
            let userLatitude = locationData.postalCodes[0].lat;

            // request the weather
            getWeather(userLatitude, userLongitude);
        }
    }

    // Send request
    xmlRequest.send(null);

    // Validate if value entered is not a number, abourt request
    if (isNaN(userZipCode) || userZipCode === "") {
        alert("Please, enter a number as a value.");
        xmlRequest.abort();
    }

    // If there is a previous request (Node), this method will delete it
    weatherContainer.remove();
    windSpeedContainer.remove();
}

// Initialize request
const init = () => {
    // Declare our variable and assign it a value
    let getWeatherButton = document.querySelector("#getWeatherButton");
    // Add an event handling to our variable
    getWeatherButton.addEventListener("click", getLocation);
}

window.onload =  init;