import { formatTransactionDate } from "../../utils/format.js";
import TransactionItem from "./TransactionItem.jsx";
function TransactionList({ transactions }) {
  return (
    <div className="flex flex-col gap-3 flex-1">
      {transactions.map((item) => {
        return (
          <TransactionItem
            icon={item.icon}
            title={item.title}
            subtitle={`${item.category} • ${formatTransactionDate(item.date)}`}
            amount={item.amount}
            amountColor={
              Number(item.amount) < 0 ? "text-red-500" : "text-[#009360]"
            }
            iconBg={item.iconBg}
            iconColor={item.iconColor}
          />
        );
      })}
    </div>
  );
}

export default TransactionList;
