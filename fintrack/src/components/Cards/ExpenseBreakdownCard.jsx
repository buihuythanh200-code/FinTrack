function ExpenseBreakdownCard({ data }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        {/* Chữ to, đậm và chặt chẽ hơn */}
        <h3 className="text-[1.8rem] font-[700] text-gray-900 tracking-tight">
          Expense Breakdown
        </h3>
        <a
          href="/reports"
          className="px-4 py-2 text-[1.4rem] font-[600] text-white bg-[#009360] rounded-lg hover:bg-[#007a50] transition-all duration-300 flex items-center justify-center"
        >
          Details
        </a>
      </div>

      {/* Tăng khoảng cách giữa các dòng */}
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[1.6rem] font-[600] text-gray-700">
                {item.name}
              </p>
              <span className="text-[1.2rem] font-bold text-gray-900">
                {item.value}%
              </span>
            </div>

            {/* Tăng độ dày của thanh progress từ h-2.5 lên h-3.5 */}
            <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  index === 0
                    ? "bg-[#009360]"
                    : index === 1
                      ? "bg-orange-500"
                      : index === 2
                        ? "bg-blue-500"
                        : index === 3
                          ? "bg-purple-500"
                          : "bg-gray-400"
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseBreakdownCard;
