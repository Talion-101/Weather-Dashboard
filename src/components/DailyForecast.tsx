import { WeatherIcon } from "./WeatherIcon";
import { getWeatherInfo } from "../utils/weatherCodes";
import type { DailyForecast as DailyData } from "../types/weather";

interface Props {
  daily: DailyData;
}

export function DailyForecastCard({ daily }: Props) {
  const days = daily.time.map((time, i) => {
    const date = new Date(time);
    const dayName = i === 0 ? "Today" : date.toLocaleDateString([], { weekday: "short" });
    const info = getWeatherInfo(daily.weathercode[i]);
    return {
      day: dayName,
      date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
      description: info.description,
      code: daily.weathercode[i],
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      rain: daily.precipitation_probability_max[i],
      precip: daily.precipitation_sum[i],
    };
  });

  const overallMax = Math.max(...daily.temperature_2m_max);
  const overallMin = Math.min(...daily.temperature_2m_min);
  const range = overallMax - overallMin || 1;

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-sm col-span-full lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Forecast</h3>
      <div className="space-y-1">
        {days.map((d, i) => {
          const leftPct = ((d.min - overallMin) / range) * 100;
          const widthPct = ((d.max - d.min) / range) * 100;
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <span className="w-12 text-sm font-semibold text-gray-900 dark:text-white">{d.day}</span>
              <span className="w-16 text-xs text-gray-500 dark:text-gray-400">{d.date}</span>
              <WeatherIcon code={d.code} size={22} className="text-blue-500 flex-shrink-0" />
              <span className="w-8 text-sm text-blue-400 font-medium text-right">{d.rain}%</span>
              <span className="w-10 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">{d.min}°</span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full relative mx-2">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500"
                  style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 5)}%` }}
                />
              </div>
              <span className="w-10 text-sm font-bold text-gray-900 dark:text-white">{d.max}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
