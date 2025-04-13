/* 
 * COMP1073 - Assignment 4
 * Student ID: 200567688 
 * Name: Vinh Tran
 *
 * Weather API Implementation
 * Followed OpenWeatherMap's "How to make API calls" tutorial:
 * https://openweathermap.org/current#name
 *
 */

// My personal API key (sign up at openweathermap.org to get yours)
const apiKey = '2b1810f30c38e5a696026572d098fae7';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Set up student info display
const studentInfo = document.getElementById('student-info');
studentInfo.textContent = 'Student ID: 200567688 | Name: Vinh Tran';

// Grab all the DOM elements we'll need
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// Set up the event listener for our search button
searchBtn.addEventListener('click', getWeatherData);

// Also allow searching by pressing Enter key
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeatherData();
    }
});

/**
 * Fetches weather data from OpenWeatherMap API
 */
async function getWeatherData() {
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    try {
        // Show loading state
        weatherResult.classList.add('hidden');
        searchBtn.disabled = true;
        searchBtn.textContent = 'Loading...';
        
        const response = await fetch(`${baseUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        
        // Handle different API responses
        if (data.cod === 200) {
            displayWeatherData(data);
        } else if (data.cod === '404') {
            throw new Error('City not found. Try another location.');
        } else {
            throw new Error(data.message || 'Unable to fetch weather data');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        alert(error.message || 'Something went wrong. Try again later.');
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Get Weather';
    }
}

/**
 * Displays weather data on the page
 * @param {Object} data - The weather data from API
 */
function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C (feels like ${Math.round(data.main.feels_like)}°C)`;
    weatherDescription.textContent = `Conditions: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind: ${data.wind.speed} m/s, ${getWindDirection(data.wind.deg)}`;
    
    weatherResult.classList.remove('hidden');
}

/**
 * Converts wind degrees to compass direction
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Compass direction
 */
function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
}