/**
 * UI Module
 * Handles UI updates, theme switching, and user interactions
 */

const UI = {
    // DOM elements
    elements: {},

    // Auto-update interval
    updateInterval: null,
    timeInterval: null,

    // Current location data
    currentLocation: null,

    /**
     * Initialize UI module
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.startClock();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            // Time display
            currentTime: document.getElementById('currentTime'),
            localTime: document.getElementById('localTime'),
            
            // Search
            citySearch: document.getElementById('citySearch'),
            searchBtn: document.getElementById('searchBtn'),
            searchResults: document.getElementById('searchResults'),
            
            // States
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            weatherDisplay: document.getElementById('weatherDisplay'),
            errorMessage: document.getElementById('errorMessage'),
            retryBtn: document.getElementById('retryBtn'),
            
            // Location
            cityName: document.getElementById('cityName'),
            countryName: document.getElementById('countryName'),
            lastUpdated: document.getElementById('lastUpdated'),
            
            // Current weather
            weatherIcon: document.getElementById('weatherIcon'),
            temperature: document.getElementById('temperature'),
            weatherDescription: document.getElementById('weatherDescription'),
            feelsLike: document.getElementById('feelsLike'),
            
            // Details
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            uvIndex: document.getElementById('uvIndex'),
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),
            
            // Forecasts
            hourlyForecast: document.getElementById('hourlyForecast'),
            dailyForecast: document.getElementById('dailyForecast'),
            
            // Theme
            themeIndicator: document.getElementById('themeIndicator'),
            body: document.body
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search input
        this.elements.citySearch.addEventListener('input', this.debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Search button
        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch(this.elements.citySearch.value);
        });

        // Search on Enter key
        this.elements.citySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(this.elements.citySearch.value);
            }
        });

        // Retry button
        this.elements.retryBtn.addEventListener('click', () => {
            this.loadWeatherForCurrentLocation();
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Start clock
     */
    startClock() {
        this.updateTime();
        this.updateLocalTime();
        this.timeInterval = setInterval(() => {
            this.updateTime();
            this.updateLocalTime();
            this.checkThemeUpdate();
        }, 1000);
    },

    /**
     * Update time display
     */
    updateTime() {
        const now = new Date();
        this.elements.currentTime.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    },

    /**
     * Check and update theme based on current time in selected city
     */
    checkThemeUpdate() {
        if (Weather.currentData && Weather.currentData.sunrise && Weather.currentData.sunset && Weather.currentData.timezone) {
            const now = new Date();
            const timezone = Weather.currentData.timezone;
            
            // Format current time in the location's timezone
            const nowInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
            
            // Get sunrise and sunset times
            const sunrise = new Date(Weather.currentData.sunrise);
            const sunset = new Date(Weather.currentData.sunset);
            
            // Compare only the time portion (hours and minutes)
            const nowHours = nowInTimezone.getHours();
            const nowMinutes = nowInTimezone.getMinutes();
            const sunriseHours = sunrise.getHours();
            const sunriseMinutes = sunrise.getMinutes();
            const sunsetHours = sunset.getHours();
            const sunsetMinutes = sunset.getMinutes();
            
            // Convert to minutes for easier comparison
            const nowTotalMinutes = nowHours * 60 + nowMinutes;
            const sunriseTotalMinutes = sunriseHours * 60 + sunriseMinutes;
            const sunsetTotalMinutes = sunsetHours * 60 + sunsetMinutes;
            
            // Check if it's day or night in the selected city's timezone
            const isDay = nowTotalMinutes >= sunriseTotalMinutes && nowTotalMinutes <= sunsetTotalMinutes;
            this.updateTheme(isDay);
        }
    },

    /**
     * Show loading state
     */
    showLoading() {
        this.elements.loadingState.style.display = 'block';
        this.elements.errorState.style.display = 'none';
        this.elements.weatherDisplay.classList.remove('active');
    },

    /**
     * Hide loading state
     */
    hideLoading() {
        this.elements.loadingState.style.display = 'none';
    },

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'block';
        this.elements.weatherDisplay.classList.remove('active');
    },

    /**
     * Hide error state
     */
    hideError() {
        this.elements.errorState.style.display = 'none';
    },

    /**
     * Show weather display
     */
    showWeatherDisplay() {
        this.elements.loadingState.style.display = 'none';
        this.elements.errorState.style.display = 'none';
        this.elements.weatherDisplay.classList.add('active');
    },

    /**
     * Update location info
     * @param {Object} location - Location object
     */
    updateLocation(location) {
        this.elements.cityName.textContent = location.name;
        this.elements.countryName.textContent = location.country;
        this.currentLocation = location;
    },

    /**
     * Update last updated time
     */
    updateLastUpdated() {
        const now = new Date();
        this.elements.lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}`;
    },

    /**
     * Update current weather
     * @param {Object} weather - Weather data
     */
    updateCurrentWeather(weather) {
        // Update weather icon
        this.elements.weatherIcon.innerHTML = Weather.getWeatherIconSVG(weather.weatherCode);
        
        // Update temperature
        this.elements.temperature.textContent = weather.temperature;
        
        // Update description
        this.elements.weatherDescription.textContent = weather.weatherDescription;
        
        // Update feels like
        this.elements.feelsLike.textContent = weather.feelsLike;
        
        // Update details
        this.elements.humidity.textContent = `${weather.humidity}%`;
        this.elements.windSpeed.textContent = `${weather.windSpeed} km/h`;
        this.elements.uvIndex.textContent = weather.uvIndex;
        
        // Update sunrise/sunset
        if (Weather.currentData && Weather.currentData.sunrise) {
            const sunrise = new Date(Weather.currentData.sunrise);
            const sunset = new Date(Weather.currentData.sunset);
            this.elements.sunrise.textContent = Weather.formatTime(sunrise);
            this.elements.sunset.textContent = Weather.formatTime(sunset);
        }
        
        // Update local time
        this.updateLocalTime();
    },

    /**
     * Update local time display
     */
    updateLocalTime() {
        if (Weather.currentData && Weather.currentData.timezone) {
            const now = new Date();
            const options = {
                timeZone: Weather.currentData.timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            this.elements.localTime.textContent = now.toLocaleTimeString('en-US', options);
        } else {
            this.elements.localTime.textContent = '--:--';
        }
    },

    /**
     * Update hourly forecast
     * @param {Array} hourly - Hourly forecast data
     */
    updateHourlyForecast(hourly) {
        this.elements.hourlyForecast.innerHTML = '';
        
        hourly.forEach((hour, index) => {
            const item = document.createElement('div');
            item.className = 'forecast-item stagger-item';
            item.style.animationDelay = `${index * 0.05}s`;
            
            item.innerHTML = `
                <div class="forecast-time">${Weather.formatTime(hour.time)}</div>
                <div class="forecast-icon">${Weather.getWeatherIconSVG(hour.weatherCode)}</div>
                <div class="forecast-temp">${hour.temperature}°</div>
            `;
            
            this.elements.hourlyForecast.appendChild(item);
        });
    },

    /**
     * Update daily forecast
     * @param {Array} daily - Daily forecast data
     */
    updateDailyForecast(daily) {
        this.elements.dailyForecast.innerHTML = '';
        
        daily.forEach((day, index) => {
            const item = document.createElement('div');
            item.className = 'forecast-item stagger-item';
            item.style.animationDelay = `${index * 0.05}s`;
            
            item.innerHTML = `
                <div class="forecast-day">${Weather.formatDate(day.date)}</div>
                <div class="forecast-day-icon">
                    ${Weather.getWeatherIconSVG(day.weatherCode)}
                    <span>${day.weatherDescription}</span>
                </div>
                <div class="forecast-temps">
                    <span class="forecast-temp-max">${day.temperatureMax}°</span>
                    <span class="forecast-temp-min">${day.temperatureMin}°</span>
                </div>
            `;
            
            this.elements.dailyForecast.appendChild(item);
        });
    },

    /**
     * Update theme based on time
     * @param {boolean} isDay - True if day time
     */
    updateTheme(isDay) {
        if (isDay) {
            this.elements.body.classList.remove('night-theme');
            this.elements.themeIndicator.textContent = 'Day';
        } else {
            this.elements.body.classList.add('night-theme');
            this.elements.themeIndicator.textContent = 'Night';
        }
    },

    /**
     * Handle city search
     * @param {string} query - Search query
     */
    async handleSearch(query) {
        if (!query || query.trim().length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = await Geolocation.searchCity(query);
        this.displaySearchResults(results);
    },

    /**
     * Display search results
     * @param {Array} results - Search results
     */
    displaySearchResults(results) {
        if (results.length === 0) {
            this.hideSearchResults();
            return;
        }

        this.elements.searchResults.innerHTML = '';
        
        results.forEach((result, index) => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.style.animationDelay = `${index * 0.05}s`;
            
            const locationText = result.admin1 
                ? `${result.name}, ${result.admin1}, ${result.country}`
                : `${result.name}, ${result.country}`;
            
            item.innerHTML = `
                <div class="city">${result.name}</div>
                <div class="country">${locationText}</div>
            `;
            
            item.addEventListener('click', () => {
                this.selectCity(result);
            });
            
            this.elements.searchResults.appendChild(item);
        });
        
        this.elements.searchResults.classList.add('active');
    },

    /**
     * Hide search results
     */
    hideSearchResults() {
        this.elements.searchResults.classList.remove('active');
    },

    /**
     * Select a city from search results
     * @param {Object} city - City object
     */
    async selectCity(city) {
        this.hideSearchResults();
        this.elements.citySearch.value = '';
        
        Geolocation.setLocation(city);
        await this.loadWeatherForLocation(city);
    },

    /**
     * Load weather for current location
     */
    async loadWeatherForCurrentLocation() {
        this.showLoading();
        
        try {
            const location = Geolocation.getLocation();
            if (!location) {
                location = await Geolocation.init();
            }
            
            await this.loadWeatherForLocation(location);
        } catch (error) {
            this.showError('Unable to load weather data. Please try again.');
        }
    },

    /**
     * Load weather for a specific location
     * @param {Object} location - Location object
     */
    async loadWeatherForLocation(location) {
        this.showLoading();
        
        try {
            const weather = await Weather.fetchWeather(location.lat, location.lon);
            
            this.updateLocation(location);
            this.updateCurrentWeather(weather.current);
            this.updateHourlyForecast(weather.hourly);
            this.updateDailyForecast(weather.daily);
            this.updateTheme(weather.current.isDay);
            this.updateLastUpdated();
            
            this.showWeatherDisplay();
            
            // Start auto-update
            this.startAutoUpdate();
        } catch (error) {
            console.error('Error loading weather:', error);
            this.showError('Unable to load weather data. Please try again.');
        }
    },

    /**
     * Start auto-update interval
     */
    startAutoUpdate() {
        // Clear existing interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Update every 10 minutes
        this.updateInterval = setInterval(async () => {
            const location = Geolocation.getLocation();
            if (location) {
                try {
                    const weather = await Weather.fetchWeather(location.lat, location.lon);
                    this.updateCurrentWeather(weather.current);
                    this.updateHourlyForecast(weather.hourly);
                    this.updateDailyForecast(weather.daily);
                    this.updateTheme(weather.current.isDay);
                    this.updateLastUpdated();
                } catch (error) {
                    console.error('Error updating weather:', error);
                }
            }
        }, 10 * 60 * 1000); // 10 minutes
    },

    /**
     * Stop auto-update interval
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    },

    /**
     * Stop clock
     */
    stopClock() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    },

    /**
     * Cleanup
     */
    cleanup() {
        this.stopAutoUpdate();
        this.stopClock();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
