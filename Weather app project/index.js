// Get references to DOM elements
const userTab = document.querySelector("[data-userWeather]");         // "Your Weather" tab
const searchTab = document.querySelector("[data-searchWeather]");     // "Search Weather" tab
const userContainer = document.querySelector(".weather-container");   // Main container

const grantAccessContainer = document.querySelector(".grant-location-container"); // Grant location access UI
const searchForm = document.querySelector("[data-searchForm]");       // City search form
const loadingScreen = document.querySelector(".loading-container");   // Loader UI
const userInfoContainer = document.querySelector(".user-info-container"); // Weather info UI
const errorContainer = document.querySelector(".api-error-container");    // Error message container

// Track current active tab
let oldTab = userTab;

// Your OpenWeatherMap API key
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// Initially mark "Your Weather" as active tab
oldTab.classList.add("current-tab");

// Load weather info from saved location (if available)
getfromSessionStorage();

// Function to switch between tabs
function switchTab(newTab) {
    if(newTab != oldTab) {
        // Remove highlight from old tab and switch to the new one
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        // Hide error message if any
        errorContainer.classList.remove("active");

        if(!searchForm.classList.contains("active")) {
            // Switch to search tab: hide user info and grant location UI
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // Switch to "Your Weather" tab: hide search UI and show stored location info
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

// Event listeners for tab clicks
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

// Function to get user's coordinates from session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates) {
        // If not found, show "Grant Access" UI
        grantAccessContainer.classList.add("active");
    } else {
        // Parse and use saved coordinates
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// Function to fetch weather info using latitude and longitude
async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;

    // Hide grant access UI and show loading
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        // API call to fetch weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        // Hide loader
        loadingScreen.classList.remove("active");

        // If API returns error code, show error UI
        if (data?.cod === "400" || data?.cod === "404") {
            showErrorUI();
        } else {
            // Show weather UI and display data
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
    } catch (err) {
        // If network/API error, show error UI
        showErrorUI();
    }
}

// Function to display weather info in UI
function renderWeatherInfo(weatherInfo) {
    // Get DOM elements to update
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Fill weather data into UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

// Function to get current location using browser's geolocation API
function getLocation() {
    if(navigator.geolocation) {
        // Ask browser for current position
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // If not supported, show alert
        alert("Geolocation not supported");
    }
}

// Callback when browser returns current position
function showPosition(position) {
    // Store coordinates
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    // Save to session storage
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    // Fetch and show weather
    fetchUserWeatherInfo(userCoordinates);
}

// "Grant Access" button click triggers location request
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

// Handle form submission for city search
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();  // Prevent page reload
    let cityName = searchInput.value.trim();

    if(cityName === "") return;  // If empty, do nothing
    fetchSearchWeatherInfo(cityName);  // Otherwise, fetch data for city
});

// Function to fetch weather info for a searched city
async function fetchSearchWeatherInfo(city) {
    // Show loader and hide everything else
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");

    try {
        // API call using city name
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        // Hide loader
        loadingScreen.classList.remove("active");

        // If city not found, show error
        if (data?.cod === "404") {
            showErrorUI();
        } else {
            // Show weather UI
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
    } catch (err) {
        showErrorUI();
    }
}

// Show error message UI
function showErrorUI() {
    // Hide everything else
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    // Show error box
    errorContainer.classList.add("active");
}
