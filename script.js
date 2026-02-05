// OpenWeatherMap API Configuration
// Get your free API key at: https://openweathermap.org/api
const API_KEY = '3f2a7a5b21154c340f58cc94f664e7c7'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecastContainer');
const loadingSpinner = document.getElementById('loadingSpinner');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Main Search Handler
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please configure your OpenWeatherMap API key in script.js');
        return;
    }

    clearError();
    showLoading();

    try {
        // Fetch current weather and 7-day forecast data
        const currentWeatherData = await fetchCurrentWeather(city);
        const forecastData = await fetchForecast(currentWeatherData.coord);

        // Display the data
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);

        // Show the results
        currentWeatherDiv.classList.remove('hidden');
        forecastContainer.classList.remove('hidden');
    } catch (error) {
        showError(error.message);
        currentWeatherDiv.classList.add('hidden');
        forecastContainer.classList.add('hidden');
    } finally {
        hideLoading();
    }
}

// Fetch current weather data
async function fetchCurrentWeather(city) {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the name and try again.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
    }

    return response.json();
}

// Fetch 7-day forecast using One Call API (requires lat/lon)
async function fetchForecast(coords) {
    const { lat, lon } = coords;
    const url = `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch forecast data. Please try again.');
    }

    return response.json();
}

// Display current weather
function displayCurrentWeather(data) {
    const { name, sys, main, weather, dt } = data;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    const date = new Date(dt * 1000);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });

    document.getElementById('cityName').textContent = name;
    document.getElementById('weatherDate').textContent = dateStr;
    document.getElementById('currentIcon').src = weatherIcon;
    document.getElementById('currentTemp').textContent = Math.round(main.temp);
    document.getElementById('currentCondition').textContent = weather[0].main;
    document.getElementById('currentMinMax').textContent = 
        `H ${Math.round(main.temp_max)}° L ${Math.round(main.temp_min)}°`;
}

// Display 7-day forecast (aggregated from 5-day data)
function displayForecast(data) {
    const { daily } = data;

    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    // Use up to 7 days from the One Call daily array
    const days = daily.slice(0, 7);

    days.forEach(dayData => {
        const date = new Date(dayData.dt * 1000);
        const card = createForecastCard(dayData, date);
        forecastGrid.appendChild(card);
    });
}

// Create a single forecast card
function createForecastCard(data, date) {
    const { temp, weather } = data;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-date">${dateStr}</div>
        <img src="${weatherIcon}" alt="${weather[0].main}" class="forecast-icon">
        <div class="forecast-temp">${Math.round(temp.day)}°</div>
        <div class="forecast-min">L ${Math.round(temp.min)}°</div>
        <div class="forecast-condition">${weather[0].main}</div>
    `;

    return card;
}

// Utility Functions
function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = '';
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}
