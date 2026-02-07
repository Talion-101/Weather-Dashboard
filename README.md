# Live Weather Dashboard 🌤️

A modern, responsive weather website with real-time updates, automatic day/night theming, and worldwide city search. Built with vanilla HTML, CSS, and JavaScript - no frameworks required!

![Weather Dashboard](https://img.shields.io/badge/Weather-Dashboard-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![GitHub Pages](https://img.shields.io/badge/deployment-GitHub%20Pages-blue)

## ✨ Features

- 🌍 **Automatic Location Detection** - Shows weather for your current location by default
- 🔍 **City Search** - Search any city worldwide with autocomplete suggestions
- 🌅 **Day/Night Themes** - Automatic theme switching based on local time with smooth transitions
- 🔄 **Auto-Update** - Refreshes weather data every 10 minutes without page reload
- 📱 **Responsive Design** - Mobile-first approach, works perfectly on all devices
- 🎨 **Modern UI** - Clean, beautiful interface with smooth animations
- ⚡ **Fast & Lightweight** - No frameworks, pure vanilla JavaScript
- 🆓 **Free API** - Uses Open-Meteo API (no API key required)

## 🚀 Live Demo

Coming soon! Deploy to GitHub Pages to see it in action.

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for weather data
- GitHub account (for deployment)

## 🛠️ Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Open `index.html` in your browser**
   - Simply double-click `index.html` or
   - Use a local server: `python -m http.server 8000` or `npx serve`

## 🌐 Deployment to GitHub Pages

### Option 1: Using GitHub Web Interface

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to repository **Settings** → **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**
7. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Using Git Command Line

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/yourusername/weather-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow steps 3-7 from Option 1.

## 📁 Project Structure

```
weather-dashboard/
├── index.html              # Main HTML file
├── css/
│   ├── themes.css          # Day/night theme variables
│   ├── animations.css      # Animation definitions
│   └── styles.css          # Main stylesheet
├── js/
│   ├── app.js              # Main application logic
│   ├── weather.js          # Weather API integration
│   ├── geolocation.js      # Location services
│   └── ui.js               # UI updates and interactions
├── plans/
│   └── project-plan.md     # Detailed project plan
├── .nojekyll               # GitHub Pages configuration
└── README.md               # This file
```

## 🎨 Features in Detail

### Automatic Location Detection
- Uses browser Geolocation API
- Falls back to Colombo, Sri Lanka if permission denied
- Displays city and country name

### City Search
- Real-time search with autocomplete
- Search by city name worldwide
- Shows country and region information
- Click to select and view weather

### Day/Night Theme
- Detects local time of selected location
- Smooth 1-second transition between themes
- Day theme: Light colors, sun animations
- Night theme: Dark colors, moon/stars animations
- Automatic switching based on sunrise/sunset

### Weather Data Display
- Current temperature (°C)
- Weather condition with animated icon
- Feels like temperature
- Humidity percentage
- Wind speed (km/h)
- UV Index
- Sunrise/Sunset times
- Local time at location
- 24-hour hourly forecast
- 7-day daily forecast

### Auto-Update
- Refreshes weather data every 10 minutes
- Updates time display every second
- Smooth transitions when data updates
- Shows last updated timestamp
- Pauses when page is hidden (saves resources)

## 🎯 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Customization

### Change Default Location

Edit `js/geolocation.js`:
```javascript
defaultLocation: {
    lat: 6.9271,      // Your latitude
    lon: 79.8612,     // Your longitude
    name: 'Colombo',  // Your city name
    country: 'Sri Lanka' // Your country
}
```

### Change Auto-Update Interval

Edit `js/ui.js`:
```javascript
// Change 10 * 60 * 1000 to your desired interval in milliseconds
this.updateInterval = setInterval(async () => {
    // ...
}, 10 * 60 * 1000); // 10 minutes
```

### Customize Colors

Edit `css/themes.css` to modify day/night theme colors:
```css
:root {
    --bg-primary: #87CEEB;
    --accent: #FF6B6B;
    /* ... more variables */
}
```

## 📊 API Used

This project uses the **Open-Meteo API**:
- **Weather Data**: https://open-meteo.com/
- **Geocoding**: https://geocoding-api.open-meteo.com/
- **Completely free**
- **No API key required**
- **No rate limiting**

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Icons created with SVG
- Fonts from [Google Fonts](https://fonts.google.com/) (Inter)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ using vanilla HTML, CSS, and JavaScript
