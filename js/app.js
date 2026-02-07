/**
 * Main Application
 * Initializes and coordinates all modules
 */

class WeatherApp {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }

        try {
            console.log('Initializing Weather Dashboard...');
            
            // Initialize UI module
            UI.init();
            
            // Initialize geolocation and load weather
            await this.loadInitialWeather();
            
            this.isInitialized = true;
            console.log('Weather Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            UI.showError('Failed to initialize weather dashboard. Please refresh the page.');
        }
    }

    /**
     * Load initial weather data
     */
    async loadInitialWeather() {
        try {
            // Get user's location
            const location = await Geolocation.init();
            console.log('Location:', location);
            
            // Load weather for the location
            await UI.loadWeatherForLocation(location);
            
        } catch (error) {
            console.error('Error loading initial weather:', error);
            throw error;
        }
    }

    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause updates
            UI.stopAutoUpdate();
            console.log('App paused (page hidden)');
        } else {
            // Page is visible, resume updates
            UI.loadWeatherForCurrentLocation();
            console.log('App resumed (page visible)');
        }
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload() {
        UI.cleanup();
        console.log('App cleanup complete');
    }
}

// Create app instance
const app = new WeatherApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    app.handleVisibilityChange();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    app.handleBeforeUnload();
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
    UI.loadWeatherForCurrentLocation();
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    UI.showError('You are offline. Please check your internet connection.');
});

// Export app instance for debugging
if (typeof window !== 'undefined') {
    window.WeatherApp = app;
    window.Geolocation = Geolocation;
    window.Weather = Weather;
    window.UI = UI;
}
