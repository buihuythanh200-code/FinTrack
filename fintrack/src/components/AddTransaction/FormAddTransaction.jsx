import { useState } from "react";

function FormAddTransaction() {
  const [active, setActive] = useState("expense");
  const [amount, setAmount] = useState(0);

  const formatNumber = (num) => {
    if (!num) return "";
    return Number(num).toLocaleString("en-US");
  };

  const handleClickUpAmount = () => {
    setAmount((prep) => Number(prep) + 1);
  };
  const handleClickDownAmount = () => {
    if (amount > 0) {
      setAmount((prep) => Number(prep) - 1);
    }
  };

  const tabClass = (type, activeColor) =>
    `relative z-10 flex-1 cursor-pointer rounded-xl px-4 py-2 text-center font-medium transition`;

  return (
    <div className="xl:w-[60%] bg-white rounded-2xl shadow-lg border border-gray-100">
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <h2 className="text-[1.6rem] font-semibold text-gray-800">
          Add Transaction
        </h2>

        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer">
          <i className="fa-solid fa-x text-gray-500"></i>
        </button>
      </header>

      <form className="p-8">
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1 bg-gray-100 py-[1rem] px-[1rem]">
            {/* Select Template Header */}
            <div className="flex items-center justify-between rounded-xl bg-white  cursor-pointer p-4">
              <h3 className="text-[1.4rem] font-semibold text-gray-700 opacity-70">
                Select Template
              </h3>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-gray-200 transition text-[1.4rem] cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>

            {/* Transaction Types */}
            <div className="mt-4 rounded-xl bg-white shadow-sm p-2">
              <div className="relative flex rounded-2xl bg-gray-100 p-1">
                <div
                  className={`
                    absolute top-1 bottom-1 rounded-xl transition-all duration-300
                    ${active === "expense" ? "left-1 w-[calc(33.333%-0.167rem)] bg-red-200" : ""}
                    ${active === "income" ? "left-1/3 w-[calc(33.333%-0.167rem)] bg-green-200" : ""}
                    ${active === "transfer" ? "left-2/3 w-[calc(33.333%-0.167rem)] bg-gray-200" : ""}
                `}
                ></div>

                <button
                  type="button"
                  onClick={() => {
                    setActive("expense");
                  }}
                  className={`${tabClass()} ${
                    active === "expense" ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  Expense
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActive("income");
                  }}
                  className={`${tabClass()} ${
                    active === "income" ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  Income
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActive("transfer");
                  }}
                  className={`${tabClass()} ${
                    active === "transfer" ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  Transfer
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2 mt-[1rem]">
              <label
                htmlFor="amount"
                className="text-[1.4rem] font-medium text-gray-700 cursor-pointer"
              >
                Amount <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-6">
                <div className="relative flex-2">
                  <input
                    id="amount"
                    type="text"
                    value={
                      Number(amount) > 0
                        ? `${active === "expense" ? "-" : ""}${formatNumber(amount)}`
                        : "0"
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setAmount(value);
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 bg-[white]"
                  />
                  <span className="flex flex-col absolute top-[50%] right-[1rem] translate-y-[-50%] text-[1rem]">
                    <i
                      className="fa-solid fa-caret-up"
                      onClick={handleClickUpAmount}
                    ></i>
                    <i
                      className="fa-solid fa-caret-down"
                      onClick={handleClickDownAmount}
                    ></i>
                  </span>
                </div>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="VND"
                    disabled
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 cursor-not-allowed"
                  />
                  <span className="flex flex-col absolute top-[50%] right-[1rem] translate-y-[-50%] text-[1rem]">
                    <i className="fa-solid fa-caret-up"></i>
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 rounded-xl border bg-white p-2 shadow-sm">
            Right column content
          </div>
        </div>
      </form>
    </div>
  );
}
export default FormAddTransaction;
