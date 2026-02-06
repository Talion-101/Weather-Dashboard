import { useState, useEffect } from "react";
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  CloudRain,
  Sun,
  CloudSun,
  Loader2,
  Cloud,
  Globe,
} from "lucide-react";
import { useWeather, useCities, useUserLocation } from "./hooks/useWeather";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { MetricCard } from "./components/MetricCard";
import { HourlyForecastCard } from "./components/HourlyForecast";
import { DailyForecastCard } from "./components/DailyForecast";
import { AirQualityCard } from "./components/AirQualityCard";
import { SunCard } from "./components/SunCard";
import { CitySelector } from "./components/CitySelector";
import { getUVLabel, getWindDirection } from "./utils/weatherCodes";
import type { CityOption } from "./types/weather";

export function App() {
  const cities = useCities();
  const { detectedCity, detecting } = useUserLocation();
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);

  // Set the detected city as default once geolocation resolves
  useEffect(() => {
    if (detectedCity && !selectedCity) {
      setSelectedCity(detectedCity);
    }
  }, [detectedCity, selectedCity]);

  const cityToUse = selectedCity || cities[0];
  const { weather, airQuality, loading, error, lastUpdated, refetch } = useWeather(cityToUse);

  // Show detecting location screen
  if (detecting && !selectedCity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-5">
          <div className="relative inline-block">
            <Globe size={56} className="text-blue-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-400 border-2 border-slate-900 animate-ping" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Detecting your location...</p>
            <p className="text-blue-300/70 text-sm mt-1">Getting the most accurate weather for you</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500">
            <Cloud size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Unable to load weather data</h2>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-500 font-medium">Loading weather for {cityToUse.name}...</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const uvInfo = getUVLabel(weather.current.uv_index);
  const windDir = getWindDirection(weather.current.winddirection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
                <CloudSun size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Weather Dashboard</h1>
                <div className="flex items-center gap-2">
                  {/* Live indicator */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-xs text-gray-500">
                    {lastUpdated
                      ? `Live · Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                      : "Connecting..."}
                  </p>
                </div>
              </div>
            </div>

            <CitySelector cities={cities} selected={cityToUse} onSelect={setSelectedCity} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Row: Current Weather + Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CurrentWeatherCard current={weather.current} city={cityToUse} />

          <MetricCard
            icon={<Droplets size={20} />}
            label="Humidity"
            value={`${weather.current.relative_humidity_2m}%`}
            subValue={weather.current.relative_humidity_2m > 60 ? "High humidity" : "Comfortable"}
            colorClass="text-blue-500"
          />
          <MetricCard
            icon={<Wind size={20} />}
            label="Wind"
            value={`${Math.round(weather.current.windspeed)} km/h`}
            subValue={`Direction: ${windDir} (${weather.current.winddirection}°)`}
            colorClass="text-teal-500"
          />
        </div>

        {/* Second Row: More Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Gauge size={20} />}
            label="Pressure"
            value={`${Math.round(weather.current.surface_pressure)} hPa`}
            subValue="Atmospheric pressure"
            colorClass="text-purple-500"
          />
          <MetricCard
            icon={<CloudRain size={20} />}
            label="Precipitation"
            value={`${weather.current.precipitation} mm`}
            subValue="Current rainfall"
            colorClass="text-indigo-500"
          />
          <MetricCard
            icon={<Sun size={20} />}
            label="UV Index"
            value={`${weather.current.uv_index}`}
            subValue={uvInfo.label}
            colorClass={uvInfo.color}
          />
          <MetricCard
            icon={<Eye size={20} />}
            label="Cloud Cover"
            value={`${weather.current.cloud_cover}%`}
            subValue={weather.current.cloud_cover < 30 ? "Mostly clear" : weather.current.cloud_cover < 70 ? "Partly cloudy" : "Overcast"}
            colorClass="text-gray-500"
          />
        </div>

        {/* Hourly Forecast */}
        <HourlyForecastCard hourly={weather.hourly} isDay={!!weather.current.is_day} />

        {/* Bottom Row: Daily + Extras */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DailyForecastCard daily={weather.daily} />

          <div className="space-y-4">
            <SunCard
              sunrise={weather.daily.sunrise[0]}
              sunset={weather.daily.sunset[0]}
            />
            {airQuality && <AirQualityCard airQuality={airQuality} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-xs text-gray-400">
          Powered by{" "}
          <a
            href="https://open-meteo.com"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open-Meteo API
          </a>{" "}
          · Auto-refreshes every 60 seconds · {cities.length} cities worldwide
        </div>
      </footer>
    </div>
  );
}
