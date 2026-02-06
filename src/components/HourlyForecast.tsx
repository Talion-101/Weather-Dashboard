import { WeatherIcon } from "./WeatherIcon";
import type { HourlyForecast as HourlyData } from "../types/weather";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  hourly: HourlyData;
  isDay: boolean;
}

export function HourlyForecastCard({ hourly, isDay }: Props) {
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex((t) => new Date(t) >= now);
  const startIdx = Math.max(0, currentHourIndex);
  const next24 = hourly.time.slice(startIdx, startIdx + 24);

  const chartData = next24.map((time, i) => {
    const idx = startIdx + i;
    return {
      time: new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(hourly.temperature_2m[idx]),
      rain: hourly.precipitation_probability[idx],
      humidity: hourly.relative_humidity_2m[idx],
      code: hourly.weathercode[idx],
    };
  });

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-sm col-span-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">24-Hour Forecast</h3>

      {/* Scrollable hourly icons */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {chartData.slice(0, 12).map((h, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 min-w-[60px] p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{h.time}</span>
            <WeatherIcon code={h.code} isDay={isDay} size={24} className="text-blue-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">{h.temp}°</span>
            <span className="text-xs text-blue-400">{h.rain}%</span>
          </div>
        ))}
      </div>

      {/* Temperature chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
              unit="°"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
              formatter={(value: number | undefined, name: string | undefined) => {
                if (name === "temp") return [`${value}°C`, "Temperature"];
                if (name === "rain") return [`${value}%`, "Rain Chance"];
                return [`${value}`, name ?? ""];
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#f97316" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
