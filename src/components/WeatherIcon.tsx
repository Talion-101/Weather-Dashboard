import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Moon,
  CloudMoon,
} from "lucide-react";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

export function WeatherIcon({ code, isDay = true, size = 24, className = "" }: WeatherIconProps) {
  const props = { size, className };

  if (!isDay && code <= 1) return <Moon {...props} />;
  if (!isDay && code <= 3) return <CloudMoon {...props} />;

  if (code <= 1) return <Sun {...props} />;
  if (code <= 2) return <CloudSun {...props} />;
  if (code <= 3) return <Cloud {...props} />;
  if (code <= 48) return <CloudFog {...props} />;
  if (code <= 57) return <CloudDrizzle {...props} />;
  if (code <= 67) return <CloudRain {...props} />;
  if (code <= 77) return <Snowflake {...props} />;
  if (code <= 86) return <Snowflake {...props} />;
  return <CloudLightning {...props} />;
}
