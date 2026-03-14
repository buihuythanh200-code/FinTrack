import React from "react";
import { formatCurrency } from "../../utils/format";

function OverviewMiniCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-700",
}) {
  return (
    <div className="group relative bg-white p-7 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-start gap-4">
        {/* Phần Title và Value được tăng kích cỡ */}
        <div className="flex flex-col">
          <p className="text-[1.6rem] font-semibold text-gray-500 mb-1.5">
            {title}
          </p>
          <h4 className="text-4xl font-semibold text-gray-900 tracking-tight">
            {value}
          </h4>
        </div>

        {/* Phần Icon được làm to ra một chút */}
        {Icon && (
          <div
            className={`p-3.5 ${iconBg} ${iconColor} rounded-xl border border-gray-200 group-hover:bg-indigo-500
    group-hover:text-white shadow-sm  transition-all duration-300 group-hover:shadow-md`}
          >
            <Icon className="w-7 h-7" />
          </div>
        )}
      </div>

      {/* Phần Subtitle và Trend */}
      {(subtitle || trend) && (
        <div className="mt-6 flex items-center text-sm">
          {trend && (
            <span
              className={`flex items-center font-bold px-2.5 py-1 rounded-full text-xs mr-3 text-[1.2rem] ${
                trend === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </span>
          )}
          <p className="text-gray-500 text-[1.4rem] font-medium">{subtitle}</p>
        </div>
      )}
    </div>
  );
}

export default OverviewMiniCard;
