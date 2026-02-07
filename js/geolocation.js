/**
 * Geolocation Module
 * Handles user location detection and coordinate management
 */

const Geolocation = {
    // Default location (Colombo, Sri Lanka)
    defaultLocation: {
        lat: 6.9271,
        lon: 79.8612,
        name: 'Colombo',
        country: 'Sri Lanka'
    },

    // Current location
    currentLocation: null,

    /**
     * Initialize geolocation
     * @returns {Promise<Object>} Location object with lat, lon, name, country
     */
    async init() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.log('Geolocation not supported, using default location');
                this.currentLocation = { ...this.defaultLocation };
                resolve(this.currentLocation);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    try {
                        // Get location name from coordinates
                        const locationName = await this.getLocationName(latitude, longitude);
                        
                        this.currentLocation = {
                            lat: latitude,
                            lon: longitude,
                            name: locationName.city || this.defaultLocation.name,
                            country: locationName.country || this.defaultLocation.country
                        };
                        
                        resolve(this.currentLocation);
                    } catch (error) {
                        console.error('Error getting location name:', error);
                        this.currentLocation = {
                            lat: latitude,
                            lon: longitude,
                            name: this.defaultLocation.name,
                            country: this.defaultLocation.country
                        };
                        resolve(this.currentLocation);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.currentLocation = { ...this.defaultLocation };
                    resolve(this.currentLocation);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes cache
                }
            );
        });
    },

    /**
     * Get location name from coordinates using reverse geocoding
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<Object>} Location name object
     */
    async getLocationName(lat, lon) {
        try {
            // Using Open-Meteo's geocoding API for reverse lookup
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch location name');
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                return {
                    city: result.name || result.city,
                    country: result.country || ''
                };
            }
            
            return { city: '', country: '' };
        } catch (error) {
            console.error('Error in reverse geocoding:', error);
            return { city: '', country: '' };
        }
    },

    /**
     * Search for a city by name
     * @param {string} query - City name to search
     * @returns {Promise<Array>} Array of matching cities
     */
    async searchCity(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
            );
            
            if (!response.ok) {
                throw new Error('Failed to search cities');
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                return data.results.map(result => ({
                    lat: result.latitude,
                    lon: result.longitude,
                    name: result.name,
                    country: result.country,
                    admin1: result.admin1 || '',
                    admin2: result.admin2 || ''
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Error searching cities:', error);
            return [];
        }
    },

    /**
     * Set current location manually
     * @param {Object} location - Location object with lat, lon, name, country
     */
    setLocation(location) {
        this.currentLocation = {
            lat: location.lat,
            lon: location.lon,
            name: location.name,
            country: location.country
        };
    },

    /**
     * Get current location
     * @returns {Object|null} Current location object
     */
    getLocation() {
        return this.currentLocation;
    },

    /**
     * Calculate distance between two coordinates (in kilometers)
     * @param {number} lat1 - First latitude
     * @param {number} lon1 - First longitude
     * @param {number} lat2 - Second latitude
     * @param {number} lon2 - Second longitude
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    /**
     * Convert degrees to radians
     * @param {number} degrees - Degrees to convert
     * @returns {number} Radians
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Geolocation;
}
