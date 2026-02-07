/**
 * Weather Module
 * Handles weather data fetching from Open-Meteo API
 */

const Weather = {
    // Current weather data
    currentData: null,

    // Weather code descriptions
    weatherCodes: {
        0: { description: 'Clear sky', icon: 'clear' },
        1: { description: 'Mainly clear', icon: 'partly-cloudy' },
        2: { description: 'Partly cloudy', icon: 'partly-cloudy' },
        3: { description: 'Overcast', icon: 'cloudy' },
        45: { description: 'Foggy', icon: 'fog' },
        48: { description: 'Depositing rime fog', icon: 'fog' },
        51: { description: 'Light drizzle', icon: 'rain' },
        53: { description: 'Moderate drizzle', icon: 'rain' },
        55: { description: 'Dense drizzle', icon: 'rain' },
        56: { description: 'Light freezing drizzle', icon: 'snow' },
        57: { description: 'Dense freezing drizzle', icon: 'snow' },
        61: { description: 'Slight rain', icon: 'rain' },
        63: { description: 'Moderate rain', icon: 'rain' },
        65: { description: 'Heavy rain', icon: 'rain' },
        66: { description: 'Light freezing rain', icon: 'snow' },
        67: { description: 'Heavy freezing rain', icon: 'snow' },
        71: { description: 'Slight snow', icon: 'snow' },
        73: { description: 'Moderate snow', icon: 'snow' },
        75: { description: 'Heavy snow', icon: 'snow' },
        77: { description: 'Snow grains', icon: 'snow' },
        80: { description: 'Slight rain showers', icon: 'rain' },
        81: { description: 'Moderate rain showers', icon: 'rain' },
        82: { description: 'Violent rain showers', icon: 'rain' },
        85: { description: 'Slight snow showers', icon: 'snow' },
        86: { description: 'Heavy snow showers', icon: 'snow' },
        95: { description: 'Thunderstorm', icon: 'thunderstorm' },
        96: { description: 'Thunderstorm with hail', icon: 'thunderstorm' },
        99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm' }
    },

    /**
     * Fetch weather data for a location
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {string} timezone - Timezone (optional)
     * @returns {Promise<Object>} Weather data
     */
    async fetchWeather(lat, lon, timezone = 'auto') {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=${timezone}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            
            const data = await response.json();
            this.currentData = this.processWeatherData(data);
            
            return this.currentData;
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    },

    /**
     * Process raw weather data from API
     * @param {Object} data - Raw API response
     * @returns {Object} Processed weather data
     */
    processWeatherData(data) {
        const current = data.current;
        const hourly = data.hourly;
        const daily = data.daily;

        return {
            current: {
                temperature: Math.round(current.temperature_2m),
                humidity: current.relative_humidity_2m,
                feelsLike: Math.round(current.apparent_temperature),
                weatherCode: current.weather_code,
                weatherDescription: this.getWeatherDescription(current.weather_code),
                windSpeed: Math.round(current.wind_speed_10m),
                uvIndex: current.uv_index || 0,
                isDay: this.isDayTime(data)
            },
            hourly: this.processHourlyData(hourly),
            daily: this.processDailyData(daily),
            timezone: data.timezone,
            sunrise: daily.sunrise[0],
            sunset: daily.sunset[0]
        };
    },

    /**
     * Process hourly forecast data
     * @param {Object} hourly - Hourly data from API
     * @returns {Array} Processed hourly forecast
     */
    processHourlyData(hourly) {
        const forecast = [];
        const now = new Date();
        const currentHour = now.getHours();
        
        // Get next 24 hours
        for (let i = 0; i < 24; i++) {
            const hourIndex = currentHour + i;
            if (hourIndex >= hourly.time.length) break;
            
            forecast.push({
                time: new Date(hourly.time[hourIndex]),
                temperature: Math.round(hourly.temperature_2m[hourIndex]),
                weatherCode: hourly.weather_code[hourIndex],
                weatherDescription: this.getWeatherDescription(hourly.weather_code[hourIndex])
            });
        }
        
        return forecast;
    },

    /**
     * Process daily forecast data
     * @param {Object} daily - Daily data from API
     * @returns {Array} Processed daily forecast
     */
    processDailyData(daily) {
        const forecast = [];
        
        for (let i = 0; i < daily.time.length; i++) {
            forecast.push({
                date: new Date(daily.time[i]),
                temperatureMax: Math.round(daily.temperature_2m_max[i]),
                temperatureMin: Math.round(daily.temperature_2m_min[i]),
                weatherCode: daily.weather_code[i],
                weatherDescription: this.getWeatherDescription(daily.weather_code[i]),
                sunrise: daily.sunrise[i],
                sunset: daily.sunset[i]
            });
        }
        
        return forecast;
    },

    /**
     * Get weather description from code
     * @param {number} code - Weather code
     * @returns {string} Weather description
     */
    getWeatherDescription(code) {
        return this.weatherCodes[code]?.description || 'Unknown';
    },

    /**
     * Get weather icon type from code
     * @param {number} code - Weather code
     * @returns {string} Icon type
     */
    getWeatherIcon(code) {
        return this.weatherCodes[code]?.icon || 'clear';
    },

    /**
     * Check if it's currently day time
     * @param {Object} data - Weather data
     * @returns {boolean} True if day time
     */
    isDayTime(data) {
        if (!data.daily || !data.daily.sunrise || !data.daily.sunset) {
            return true;
        }
        
        const now = new Date();
        const sunrise = new Date(data.daily.sunrise[0]);
        const sunset = new Date(data.daily.sunset[0]);
        
        return now >= sunrise && now <= sunset;
    },

    /**
     * Get current weather data
     * @returns {Object|null} Current weather data
     */
    getCurrentData() {
        return this.currentData;
    },

    /**
     * Format time for display
     * @param {Date} date - Date object
     * @returns {string} Formatted time
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Format date for display
     * @param {Date} date - Date object
     * @returns {string} Formatted date
     */
    formatDate(date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    },

    /**
     * Get SVG icon for weather code
     * @param {number} code - Weather code
     * @returns {string} SVG string
     */
    getWeatherIconSVG(code) {
        const iconType = this.getWeatherIcon(code);
        
        const icons = {
            clear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>`,
            
            'partly-cloudy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                <circle cx="12" cy="12" r="4"/>
                <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
            </svg>`,
            
            cloudy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>`,
            
            fog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 14h16M4 18h16M4 10h16M4 6h16"/>
            </svg>`,
            
            rain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
                <path d="M8 19l2 2M12 19l2 2M16 19l2 2"/>
            </svg>`,
            
            snow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
                <path d="M8 21l2-2M12 21l2-2M16 21l2-2"/>
                <path d="M8 15l2 2M12 15l2 2M16 15l2 2"/>
            </svg>`,
            
            thunderstorm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/>
                <path d="M13 11l-4 6h6l-4 6"/>
            </svg>`
        };
        
        return icons[iconType] || icons.clear;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Weather;
}
