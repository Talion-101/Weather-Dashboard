export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  surface_pressure: number;
  cloud_cover: number;
  visibility: number;
  uv_index: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
  precipitation_probability: number[];
  windspeed_10m: number[];
  relative_humidity_2m: number[];
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  windspeed_10m_max: number[];
  uv_index_max: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  timezone: string;
}

export interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface AirQualityData {
  current: {
    european_aqi: number;
    pm2_5: number;
    pm10: number;
  };
}
