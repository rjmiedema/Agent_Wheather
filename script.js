// OpenWeatherMap API Configuration
// Get your free API key at: https://openweathermap.org/api
const API_KEY = '47eaf5ebe8885549060fe3e41bffffad'; // Replace with your OpenWeatherMap API key
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
        // Fetch current weather and forecast data
        const currentWeatherData = await fetchCurrentWeather(city);
        const forecastData = await fetchForecast(city);

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

// Fetch 5-day forecast data
async function fetchForecast(city) {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the name and try again.');
        }
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
    const { list } = data;
    
    // Group forecast data by day (take noon data for each day)
    const dailyForecasts = {};
    
    list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const hour = date.getHours();
        
        // Prefer 12:00 PM data, but take closest available
        if (!dailyForecasts[dayKey] || Math.abs(hour - 12) < Math.abs(new Date(dailyForecasts[dayKey].dt * 1000).getHours() - 12)) {
            dailyForecasts[dayKey] = item;
        }
    });

    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    // Get next 7 days (including today if available)
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dayKey = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        const forecastData = dailyForecasts[dayKey];
        
        if (forecastData) {
            const card = createForecastCard(forecastData, date);
            forecastGrid.appendChild(card);
        }
    }
}

// Create a single forecast card
function createForecastCard(data, date) {
    const { main, weather } = data;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-date">${dateStr}</div>
        <img src="${weatherIcon}" alt="${weather[0].main}" class="forecast-icon">
        <div class="forecast-temp">${Math.round(main.temp)}°</div>
        <div class="forecast-min">L ${Math.round(main.temp_min)}°</div>
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
