function BudgetProgressCard({ budgets, formatCurrency }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[1.8rem] font-[700] text-gray-900 tracking-tight">
          Budget Progress
        </h3>
        <a
          href="/budgets"
          className="px-4 py-2 text-[1.4rem] font-[600] text-white bg-[#009360] rounded-lg hover:bg-[#007a50] transition-all duration-300 flex items-center justify-center"
        >
          View All
        </a>
      </div>

      <div className="space-y-7">
        {budgets.map((item) => {
          const percent = Math.min((item.spent / item.limit) * 100, 100);
          const isOver = item.spent > item.limit;

          return (
            <div key={item.id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[1.6rem] font-[600] text-gray-800">
                    {item.category}
                  </p>
                  <p className="text-[1.4rem] font-medium text-gray-500 mt-0.5">
                    {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                  </p>
                </div>

                {/* Nhãn tag to và đệm dày hơn */}
                <span
                  className={`text-[1.2rem] font-bold px-4 py-2 rounded-full ${
                    isOver
                      ? "bg-red-50 text-red-600"
                      : "bg-[#009360]/10 text-[#009360]"
                  }`}
                >
                  {isOver ? "Over Budget" : `${Math.round(percent)}% used`}
                </span>
              </div>

              {/* Tăng độ dày thanh tiến trình */}
              <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${isOver ? "bg-red-500" : item.color}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetProgressCard;
