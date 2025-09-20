// Weather functionality using OpenWeatherMap API
document.addEventListener('DOMContentLoaded', function() {
    
    // OpenWeatherMap API configuration
    // You'll need to get your own API key from https://openweathermap.org/api
    const API_KEY = '5516beaef9eee1635814ab38bdcfe4b4'; // Replace with your actual API key
    const CITY = 'Anambra'; // Replace with your chamber's city
    const UNITS = 'imperial'; // Use 'metric' for Celsius
    
    // DOM Elements
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');
    
    // API URLs
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=${UNITS}`;
    
    async function fetchCurrentWeather() {
        try {
            const response = await fetch(currentWeatherURL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayCurrentWeather(data);
            
        } catch (error) {
            console.error('Error fetching current weather:', error);
            showWeatherError('current');
        }
    }
    
    // Fetch weather forecast
    async function fetchForecast() {
        try {
            const response = await fetch(forecastURL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayForecast(data);
            
        } catch (error) {
            console.error('Error fetching forecast:', error);
            showWeatherError('forecast');
        }
    }
    
    // Display current weather
    function displayCurrentWeather(data) {
        if (!currentWeatherDiv) return;
        
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const city = data.name;
        const country = data.sys.country;
        
        currentWeatherDiv.innerHTML = `
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
                     alt="${description}" width="80" height="80">
            </div>
            <div class="current-temp">${temp}°F</div>
            <div class="weather-description">${description}</div>
            <div class="weather-location">${city}, ${country}</div>
            <div class="weather-details">
                <p>Feels like: ${Math.round(data.main.feels_like)}°F</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind: ${Math.round(data.wind?.speed || 0)} mph</p>
            </div>
        `;
    }
    
    // Display 3-day forecast
    function displayForecast(data) {
        if (!forecastDiv) return;
        
        // Get forecast for next 3 days (every 8th item = 24 hours later)
        const forecasts = [];
        for (let i = 8; i <= 24; i += 8) {
            if (data.list[i]) {
                forecasts.push(data.list[i]);
            }
        }
        
        const forecastHTML = forecasts.map(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon;
            
            return `
                <div class="forecast-day">
                    <div class="day-name">${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" 
                         alt="${description}" width="40" height="40">
                    <div class="temp">${temp}°F</div>
                    <div class="forecast-desc">${description}</div>
                </div>
            `;
        }).join('');
        
        forecastDiv.innerHTML = forecastHTML;
    }
    
    // Show error message
    function showWeatherError(type) {
        const errorMessage = 'Weather data temporarily unavailable';
        
        if (type === 'current' && currentWeatherDiv) {
            currentWeatherDiv.innerHTML = `
                <div class="weather-error">
                    <p>${errorMessage}</p>
                    <p>Please check back later.</p>
                </div>
            `;
        }
        
        if (type === 'forecast' && forecastDiv) {
            forecastDiv.innerHTML = `
                <div class="forecast-error">
                    <p>${errorMessage}</p>
                </div>
            `;
        }
    }
    
    // Show demo weather data if API key is not configured
    function showDemoWeather() {
        if (currentWeatherDiv) {
            currentWeatherDiv.innerHTML = `
                <div class="demo-weather">
                    <div class="current-temp">72°F</div>
                    <div class="weather-description">Partly Cloudy</div>
                    <div class="weather-location">${CITY}</div>
                    <div class="weather-details">
                        <p>Feels like: 75°F</p>
                        <p>Humidity: 65%</p>
                        <p>Wind: 8 mph</p>
                    </div>
                    <p style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">
                        Demo data - Configure API key for live weather
                    </p>
                </div>
            `;
        }
        
        if (forecastDiv) {
            forecastDiv.innerHTML = `
                <div class="forecast-day">
                    <div class="day-name">Tomorrow</div>
                    <div class="temp">68°F</div>
                    <div class="forecast-desc">Sunny</div>
                </div>
                <div class="forecast-day">
                    <div class="day-name">Thu</div>
                    <div class="temp">71°F</div>
                    <div class="forecast-desc">Cloudy</div>
                </div>
                <div class="forecast-day">
                    <div class="day-name">Fri</div>
                    <div class="temp">69°F</div>
                    <div class="forecast-desc">Light Rain</div>
                </div>
            `;
        }
    }
    
    // Initialize weather functionality
    function initWeather() {
        // Check if API key is configured
        if (API_KEY === '21dc82170f1ad5a2716325b610541025' || !API_KEY) {
            console.log('Weather API key not configured. Showing demo data.');
            showDemoWeather();
            return;
        }
        
        // Fetch real weather data
        fetchCurrentWeather();
        fetchForecast();
    }
    
    // Start weather functionality
    initWeather();
    
    // Refresh weather data every 10 minutes
    setInterval(() => {
        if (API_KEY !== '21dc82170f1ad5a2716325b610541025' && API_KEY) {
            fetchCurrentWeather();
            fetchForecast();
        }
    }, 600000); // 10 minutes
});
