import { Sunrise, Sunset } from "lucide-react";

interface Props {
  sunrise: string;
  sunset: string;
}

export function SunCard({ sunrise, sunset }: Props) {
  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sunriseTime = formatTime(sunrise);
  const sunsetTime = formatTime(sunset);

  // Calculate daylight hours
  const riseMs = new Date(sunrise).getTime();
  const setMs = new Date(sunset).getTime();
  const daylightHours = ((setMs - riseMs) / (1000 * 60 * 60)).toFixed(1);

  // Current progress through the day
  const now = Date.now();
  const progress = Math.max(0, Math.min(1, (now - riseMs) / (setMs - riseMs)));

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Sunrise & Sunset</h3>

      {/* Sun arc */}
      <div className="relative h-24 mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Arc path */}
          <path
            d="M 10 90 Q 100 -10 190 90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Filled arc */}
          <path
            d="M 10 90 Q 100 -10 190 90"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray={`${progress * 300} 300`}
          />
          {/* Sun dot */}
          <circle
            cx={10 + progress * 180}
            cy={90 - Math.sin(progress * Math.PI) * 100}
            r="6"
            fill="#f59e0b"
            className="drop-shadow-sm"
          />
        </svg>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sunrise size={18} className="text-orange-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{sunriseTime}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Daylight</p>
          <p className="text-sm font-bold text-amber-500">{daylightHours}h</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{sunsetTime}</p>
          </div>
          <Sunset size={18} className="text-indigo-400" />
        </div>
      </div>
    </div>
  );
}
