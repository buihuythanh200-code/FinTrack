import { formatCurrency } from "../../utils/format";
const StatCard = ({
  title,
  amount,
  trend,
  icon,
  trendColor,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md hover:border-gray-200 group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-14 h-14 rounded-full ${iconBg} ${iconColor} text-[1.2rem] flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}
        >
          <i className={icon}></i>
        </div>
        <span
          className={`${trendColor} text-[1.2rem] font-bold px-4 py-2 rounded-md`}
        >
          {trend}
        </span>
      </div>
      <div>
        <p className="text-gray-500 text-sm text-[1.4rem] font-medium">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">
          {formatCurrency(amount)}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
