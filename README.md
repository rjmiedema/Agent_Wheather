# Weather Forecast Website

A simple, responsive weather forecast application that displays current weather and a 7-day forecast for any city worldwide.

## Features

- 🌍 **Search any city** - Enter a city name to get its weather
- 🌡️ **Current weather display** - Shows temperature, conditions, and high/low
- 📅 **7-day forecast** - View weather predictions for the next 7 days
- 📱 **Responsive design** - Works on desktop, tablet, and mobile devices
- ⚡ **Real-time data** - Uses OpenWeatherMap API for accurate forecasts

## Setup Instructions

### 1. Get an OpenWeatherMap API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Go to your API keys page (Account → API keys)
4. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### 2. Configure the API Key

1. Open `script.js` in your editor
2. Find this line at the top:
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   const API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
   ```

### 3. Run the Application

1. Open `index.html` in your web browser
   - Option A: Double-click the file
   - Option B: Right-click → Open with → Your browser
   - Option C: Use a local server (recommended for better functionality)

## Using a Local Server (Recommended)

### With Python
```bash
# Python 3.x
python -m http.server 8000

# Then visit: http://localhost:8000
```

### With Node.js (http-server)
```bash
# Install globally (first time only)
npm install -g http-server

# Run the server
http-server

# Then visit: http://localhost:8080
```

## Usage

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View the current weather and 7-day forecast

## File Structure

```
Agent_Wheather/
├── index.html        # Main HTML structure
├── styles.css        # Styling and responsive design
├── script.js         # JavaScript functionality and API calls
├── README.md         # This file
└── .gitignore        # Git ignore file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: OpenWeatherMap Free Tier
- **No dependencies** - Runs with just a browser!

## Future Enhancements

- Add hourly forecast
- Save favorite cities to local storage
- Add weather alerts
- Show additional metrics (humidity, wind speed, UV index)
- Add geolocation support

## License

Free to use and modify for personal projects.

## Support

If you get an error about the API key:
- Make sure you've added your API key to `script.js`
- Check that your API key is valid (test it on the OpenWeatherMap website)
- Ensure you have internet connectivity
- The free tier updates weather data every 10 minutes

If a city isn't found:
- Double-check the spelling
- Try the city in English
- For cities with common names, try adding the country (e.g., "Paris, France")
