const TransactionItem = ({
  icon,
  title,
  subtitle,
  amount,
  amountColor,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${iconBg} ${iconColor} flex items-center justify-center text-lg group-hover:scale-110 transition-all duration-300`}
        >
          <i className={icon}></i>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${amountColor}`}>{amount}</span>
    </div>
  );
};

export default TransactionItem;
