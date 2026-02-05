# Weather Forecast Website

A simple, responsive weather forecast application that displays current weather and a 7-day forecast for any city worldwide.

# Weather Forecast Website

A simple, responsive weather forecast application that displays current weather and a 7-day forecast for any city worldwide.

## Features

- 🌍 **Search any city** - Enter a city name to get its weather
- 🌡️ **Current weather display** - Shows temperature, conditions, and high/low
- 📅 **7-day forecast** - Accurate 7-day forecasts powered by OpenWeatherMap One Call data
- 📱 **Responsive design** - Works on desktop, tablet, and mobile devices
- ⚡ **Real-time data** - Uses OpenWeatherMap API for accurate forecasts

## What's changed

- Switched forecast fetching to OpenWeatherMap One Call endpoint to provide a true 7-day `daily` forecast.
- UI refreshed: new fonts, glass-style cards, gradient primary button, loading spinner, and improved spacing/shadows.
- Updated `script.js` to fetch 7-day data and updated `styles.css`/`index.html` for the modern UI.

## Setup Instructions

### 1. Get an OpenWeatherMap API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Go to your API keys page (Account → API keys)
4. Copy your API key

### 2. Configure the API Key

1. Open [script.js](script.js) in your editor
2. Find the `API_KEY` constant near the top and set your key:

```javascript
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

Note: The app first fetches current weather by city name (to obtain coordinates), then uses the One Call API with the returned lat/lon to fetch the 7-day `daily` forecast.

### 3. Run the Application

Run a simple local server and open the app in your browser. Example with Python:

```bash
# Python 3.x
python -m http.server 8000

# Then visit: http://localhost:8000
```

Or using Node's `http-server`:

```bash
npm install -g http-server
http-server
# Then visit: http://localhost:8080
```

## File Overview

See the main files:

- [index.html](index.html) — HTML structure and spinner
- [styles.css](styles.css) — Modernized styles, fonts, and animations
- [script.js](script.js) — API calls (current weather + One Call) and UI logic

## Testing

1. Ensure your `API_KEY` is configured in [script.js](script.js).
2. Start a local server (see commands above).
3. Search for a city and verify current weather and the 7-day forecast render correctly.

## Support

If something doesn't work:

- Verify the API key is correct and has not been restricted.
- Check network console for API errors; the app will display friendly messages for common errors like "City not found".
- If you want, open an issue describing the problem and steps to reproduce.

---

Thank you for using this small weather app — contributions and improvements welcome!
- Add hourly forecast
