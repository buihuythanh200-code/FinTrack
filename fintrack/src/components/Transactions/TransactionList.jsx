import TransactionItem from "./TransactionItem.jsx";
function TransactionList() {
  return (
    <div className="flex flex-col gap-3 flex-1">
      <TransactionItem
        icon="fa-solid fa-burger"
        title="KFC Restaurant"
        subtitle="Food & Dining • Today, 12:30 PM"
        amount="-$15.50"
        amountColor="text-red-500"
        iconBg="bg-orange-50"
        iconColor="text-orange-500"
      />
      <TransactionItem
        icon="fa-solid fa-briefcase"
        title="Upwork Tech"
        subtitle="Freelance • Yesterday"
        amount="+$850.00"
        amountColor="text-[#009360]"
        iconBg="bg-[#009360]/10"
        iconColor="text-[#009360]"
      />
      <TransactionItem
        icon="fa-solid fa-bolt"
        title="Electric Bill"
        subtitle="Utilities • Mar 01"
        amount="-$45.00"
        amountColor="text-red-500"
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />
    </div>
  );
}

export default TransactionList;
