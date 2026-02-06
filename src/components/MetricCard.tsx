import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
  subValue?: string;
  colorClass?: string;
}

export function MetricCard({ icon, label, value, subValue, colorClass = "text-blue-500" }: Props) {
  return (
    <div className="group rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl bg-gray-100 dark:bg-slate-700 ${colorClass}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subValue && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>
      )}
    </div>
  );
}
