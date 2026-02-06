import { Wind } from "lucide-react";
import { getAQILabel } from "../utils/weatherCodes";
import type { AirQualityData } from "../types/weather";

interface Props {
  airQuality: AirQualityData;
}

export function AirQualityCard({ airQuality }: Props) {
  const { european_aqi, pm2_5, pm10 } = airQuality.current;
  const aqiInfo = getAQILabel(european_aqi);
  const percentage = Math.min((european_aqi / 100) * 100, 100);

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-green-500">
          <Wind size={20} />
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Air Quality</span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{european_aqi}</span>
        <span className={`text-sm font-semibold ${aqiInfo.color}`}>{aqiInfo.label}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full ${aqiInfo.bg} transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
          <span className="text-xs text-gray-500 dark:text-gray-400">PM2.5</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{pm2_5?.toFixed(1)} µg/m³</p>
        </div>
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
          <span className="text-xs text-gray-500 dark:text-gray-400">PM10</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{pm10?.toFixed(1)} µg/m³</p>
        </div>
      </div>
    </div>
  );
}
