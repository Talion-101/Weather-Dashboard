export const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "sun" },
  1: { description: "Mainly clear", icon: "sun" },
  2: { description: "Partly cloudy", icon: "cloud-sun" },
  3: { description: "Overcast", icon: "cloud" },
  45: { description: "Foggy", icon: "cloud-fog" },
  48: { description: "Rime fog", icon: "cloud-fog" },
  51: { description: "Light drizzle", icon: "cloud-drizzle" },
  53: { description: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { description: "Dense drizzle", icon: "cloud-drizzle" },
  56: { description: "Light freezing drizzle", icon: "cloud-drizzle" },
  57: { description: "Dense freezing drizzle", icon: "cloud-drizzle" },
  61: { description: "Slight rain", icon: "cloud-rain" },
  63: { description: "Moderate rain", icon: "cloud-rain" },
  65: { description: "Heavy rain", icon: "cloud-rain" },
  66: { description: "Light freezing rain", icon: "cloud-rain" },
  67: { description: "Heavy freezing rain", icon: "cloud-rain" },
  71: { description: "Slight snowfall", icon: "snowflake" },
  73: { description: "Moderate snowfall", icon: "snowflake" },
  75: { description: "Heavy snowfall", icon: "snowflake" },
  77: { description: "Snow grains", icon: "snowflake" },
  80: { description: "Slight rain showers", icon: "cloud-rain" },
  81: { description: "Moderate rain showers", icon: "cloud-rain" },
  82: { description: "Violent rain showers", icon: "cloud-rain" },
  85: { description: "Slight snow showers", icon: "snowflake" },
  86: { description: "Heavy snow showers", icon: "snowflake" },
  95: { description: "Thunderstorm", icon: "cloud-lightning" },
  96: { description: "Thunderstorm with hail", icon: "cloud-lightning" },
  99: { description: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
};

export function getWeatherInfo(code: number) {
  return weatherCodeMap[code] || { description: "Unknown", icon: "cloud" };
}

export function getWeatherGradient(code: number, isDay: boolean): string {
  if (!isDay) return "from-slate-900 via-indigo-950 to-slate-800";
  if (code <= 1) return "from-amber-400 via-orange-300 to-yellow-200";
  if (code <= 3) return "from-sky-400 via-blue-300 to-indigo-200";
  if (code <= 48) return "from-gray-400 via-gray-300 to-slate-200";
  if (code <= 57) return "from-sky-500 via-blue-400 to-slate-300";
  if (code <= 67) return "from-blue-600 via-blue-500 to-slate-400";
  if (code <= 77) return "from-blue-200 via-slate-200 to-white";
  if (code <= 82) return "from-blue-700 via-blue-500 to-slate-400";
  if (code <= 86) return "from-slate-300 via-blue-200 to-white";
  return "from-purple-700 via-indigo-600 to-slate-500";
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "text-green-500" };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-500" };
  if (uv <= 7) return { label: "High", color: "text-orange-500" };
  if (uv <= 10) return { label: "Very High", color: "text-red-500" };
  return { label: "Extreme", color: "text-purple-600" };
}

export function getAQILabel(aqi: number): { label: string; color: string; bg: string } {
  if (aqi <= 20) return { label: "Good", color: "text-green-600", bg: "bg-green-500" };
  if (aqi <= 40) return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-500" };
  if (aqi <= 60) return { label: "Moderate", color: "text-orange-600", bg: "bg-orange-500" };
  if (aqi <= 80) return { label: "Poor", color: "text-red-600", bg: "bg-red-500" };
  return { label: "Very Poor", color: "text-purple-700", bg: "bg-purple-600" };
}

export function getWindDirection(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}
