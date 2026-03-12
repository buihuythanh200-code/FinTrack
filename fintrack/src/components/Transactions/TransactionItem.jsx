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
          className={`w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center text-[1.4rem] group-hover:scale-110 transition-all duration-300`}
        >
          <i className={icon}></i>
        </div>
        <div>
          <p className="text-[1.4rem] font-semibold text-gray-900">{title}</p>
          <p className="text-[1.2rem] text-gray-500">{subtitle}</p>
        </div>
      </div>
      <span className={`text-[1.2rem] font-semibold ${amountColor}`}>
        {amount}
      </span>
    </div>
  );
};

export default TransactionItem;
