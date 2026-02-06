import { WeatherIcon } from "./WeatherIcon";
import { getWeatherInfo, getWeatherGradient } from "../utils/weatherCodes";
import type { CurrentWeather } from "../types/weather";
import type { CityOption } from "../types/weather";
import { MapPin, Thermometer } from "lucide-react";

interface Props {
  current: CurrentWeather;
  city: CityOption;
}

export function CurrentWeatherCard({ current, city }: Props) {
  const info = getWeatherInfo(current.weathercode);
  const gradient = getWeatherGradient(current.weathercode, !!current.is_day);
  const isDay = !!current.is_day;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 shadow-2xl col-span-full lg:col-span-2`}>
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <div className={`flex items-center gap-2 ${isDay ? "text-gray-800/70" : "text-white/70"}`}>
            <MapPin size={16} />
            <span className="text-sm font-medium">{city.name}, {city.country}</span>
          </div>
          <div className="flex items-end gap-3">
            <span className={`text-7xl font-bold tracking-tight ${isDay ? "text-gray-900" : "text-white"}`}>
              {Math.round(current.temperature)}°
            </span>
            <span className={`text-lg font-medium pb-3 ${isDay ? "text-gray-800/70" : "text-white/70"}`}>C</span>
          </div>
          <p className={`text-lg font-medium ${isDay ? "text-gray-800" : "text-white/90"}`}>{info.description}</p>
          <div className={`flex items-center gap-2 text-sm ${isDay ? "text-gray-700/80" : "text-white/60"}`}>
            <Thermometer size={14} />
            <span>Feels like {Math.round(current.apparent_temperature)}°C</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <WeatherIcon
            code={current.weathercode}
            isDay={isDay}
            size={120}
            className={`${isDay ? "text-gray-800/80" : "text-white/80"} drop-shadow-lg`}
          />
        </div>
      </div>
    </div>
  );
}
