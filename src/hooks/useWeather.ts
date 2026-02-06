import { useState, useEffect, useCallback, useRef } from "react";
import type { WeatherData, CityOption, AirQualityData } from "../types/weather";
import { ALL_CITIES } from "../data/cities";

export function useCities() {
  return ALL_CITIES;
}

// Find the nearest city from the list given lat/lon
function findNearestCity(lat: number, lon: number): CityOption {
  let nearest = ALL_CITIES[0];
  let minDist = Infinity;
  for (const city of ALL_CITIES) {
    const dLat = city.lat - lat;
    const dLon = city.lon - lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  return nearest;
}

const DEFAULT_CITY = ALL_CITIES.find(c => c.name === "New York") || ALL_CITIES[0];

async function ipGeolocate(): Promise<CityOption> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return findNearestCity(data.latitude, data.longitude);
    }
  } catch {
    // ignore
  }

  // Try backup IP geolocation
  try {
    const res = await fetch("https://ip-api.com/json/?fields=lat,lon", { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    if (data.lat && data.lon) {
      return findNearestCity(data.lat, data.lon);
    }
  } catch {
    // ignore
  }

  return DEFAULT_CITY;
}

// Hook to detect user's location and return a default city
export function useUserLocation(): {
  detectedCity: CityOption | null;
  detecting: boolean;
  userCoords: { lat: number; lon: number } | null;
} {
  const [detectedCity, setDetectedCity] = useState<CityOption | null>(null);
  const [detecting, setDetecting] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function detect() {
      // Try browser geolocation first
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
            });
          });
          if (!cancelled) {
            const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            setUserCoords(coords);
            setDetectedCity(findNearestCity(coords.lat, coords.lon));
            setDetecting(false);
            return;
          }
        } catch {
          // Geolocation denied or timed out, fall through to IP
        }
      }

      // Fallback to IP geolocation
      if (!cancelled) {
        const city = await ipGeolocate();
        if (!cancelled) {
          setDetectedCity(city);
          setDetecting(false);
        }
      }
    }

    detect();
    return () => { cancelled = true; };
  }, []);

  return { detectedCity, detecting, userCoords };
}

export function useWeather(city: CityOption) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weathercode,cloud_cover,surface_pressure,windspeed_10m,winddirection_10m,uv_index&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m,relative_humidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,windspeed_10m_max,uv_index_max&timezone=auto&forecast_days=7`;

      const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=european_aqi,pm2_5,pm10`;

      const [weatherRes, aqRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqUrl).catch(() => null),
      ]);

      if (!weatherRes.ok) throw new Error("Failed to fetch weather data");

      const weatherJson = await weatherRes.json();

      const currentData = weatherJson.current;
      const weatherData: WeatherData = {
        current: {
          temperature: currentData.temperature_2m,
          windspeed: currentData.windspeed_10m,
          winddirection: currentData.winddirection_10m,
          weathercode: currentData.weathercode,
          is_day: currentData.is_day,
          time: currentData.time,
          relative_humidity_2m: currentData.relative_humidity_2m,
          apparent_temperature: currentData.apparent_temperature,
          precipitation: currentData.precipitation,
          surface_pressure: currentData.surface_pressure,
          cloud_cover: currentData.cloud_cover,
          visibility: 10000,
          uv_index: currentData.uv_index ?? 0,
        },
        hourly: weatherJson.hourly,
        daily: weatherJson.daily,
        timezone: weatherJson.timezone,
      };

      setWeather(weatherData);

      if (aqRes && aqRes.ok) {
        const aqJson = await aqRes.json();
        setAirQuality({
          current: {
            european_aqi: aqJson.current.european_aqi,
            pm2_5: aqJson.current.pm2_5,
            pm10: aqJson.current.pm10,
          },
        });
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [city.lat, city.lon]);

  useEffect(() => {
    // Initial fetch
    fetchWeather(true);

    // Auto-refresh every 60 seconds for real-time feel
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchWeather(false), 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchWeather]);

  return { weather, airQuality, loading, error, lastUpdated, refetch: fetchWeather };
}
