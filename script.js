
// Open-Meteo API Configuration (Free, no API key needed)
// API Docs: https://open-meteo.com/
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';


// WMO Weather Code Mapping
const WMO_CODES = {
    0: { desc: 'Clear', icon: '☀️' },
    1: { desc: 'Mainly clear', icon: '🌤️' },
    2: { desc: 'Partly cloudy', icon: '⛅' },
    3: { desc: 'Overcast', icon: '☁️' },
    45: { desc: 'Foggy', icon: '🌫️' },
    48: { desc: 'Foggy', icon: '🌫️' },
    51: { desc: 'Light drizzle', icon: '🌧️' },
    53: { desc: 'Drizzle', icon: '🌧️' },
    55: { desc: 'Heavy drizzle', icon: '🌧️' },
    61: { desc: 'Slight rain', icon: '🌧️' },
    63: { desc: 'Rain', icon: '🌧️' },
    65: { desc: 'Heavy rain', icon: '⛈️' },
    71: { desc: 'Slight snow', icon: '❄️' },
    73: { desc: 'Snow', icon: '❄️' },
    75: { desc: 'Heavy snow', icon: '❄️' },
    77: { desc: 'Snow grains', icon: '❄️' },
    80: { desc: 'Slight rain showers', icon: '🌦️' },
    81: { desc: 'Rain showers', icon: '🌦️' },
    82: { desc: 'Heavy rain showers', icon: '⛈️' },
    85: { desc: 'Snow showers', icon: '❄️' },
    86: { desc: 'Heavy snow showers', icon: '❄️' },
    95: { desc: 'Thunderstorm', icon: '⛈️' },
    96: { desc: 'Thunderstorm with hail', icon: '⛈️' },
    99: { desc: 'Thunderstorm with hail', icon: '⛈️' }
};

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

    clearError();
    showLoading();

    try {
        // Geocode city to get coordinates
        const { lat, lon, name, country } = await geocodeCity(city);
        
        // Fetch weather data
        const weatherData = await fetchWeather(lat, lon);

        // Display the data
        displayCurrentWeather(weatherData, name, country);
        displayForecast(weatherData);

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

// Geocode city name to coordinates
async function geocodeCity(city) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to geocode city');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error('City not found. Please check the name and try again.');
    }

    const result = data.results[0];
    return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country
    };
}

// Fetch weather data from Open-Meteo
async function fetchWeather(lat, lon) {
    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    
    return response.json();
}

// Display current weather
function displayCurrentWeather(data, cityName, country) {
    const current = data.current;
    const dailyData = data.daily;
    const weatherCode = current.weather_code;
    const weather = WMO_CODES[weatherCode] || { desc: 'Unknown', icon: '🌍' };
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });

    document.getElementById('cityName').textContent = `${cityName}, ${country}`;
    document.getElementById('weatherDate').textContent = dateStr;
    document.getElementById('currentIcon').textContent = weather.icon;
    document.getElementById('currentTemp').textContent = Math.round(current.temperature_2m);
    document.getElementById('currentCondition').textContent = weather.desc;
    document.getElementById('currentMinMax').textContent = 
        `H ${Math.round(dailyData.temperature_2m_max[0])}° L ${Math.round(dailyData.temperature_2m_min[0])}°`;
}

// Display 7-day forecast
function displayForecast(data) {
    const daily = data.daily;
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    // Loop through 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const weatherCode = daily.weather_code[i];
        const weather = WMO_CODES[weatherCode] || { desc: 'Unknown', icon: '🌍' };
        
        const card = createForecastCard(
            date,
            weather,
            daily.temperature_2m_max[i],
            daily.temperature_2m_min[i]
        );
        forecastGrid.appendChild(card);
    }
}

// Create a single forecast card
function createForecastCard(date, weather, maxTemp, minTemp) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-date">${dateStr}</div>
        <div style="font-size: 40px; margin: 8px 0;">${weather.icon}</div>
        <div class="forecast-temp">${Math.round(maxTemp)}°</div>
        <div class="forecast-min">L ${Math.round(minTemp)}°</div>
        <div class="forecast-condition">${weather.desc}</div>
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
