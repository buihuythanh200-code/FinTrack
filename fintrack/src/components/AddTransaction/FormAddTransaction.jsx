import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import axios
function FormAddTransaction({ onClose }) {
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  const [active, setActive] = useState("expense");
  const [amount, setAmount] = useState(0);
  const [openWallet, setOpenWallet] = useState(false);

  const [isTemplate, setIsTemplate] = useState(false);
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("cleared");

  const [wallet, setWallet] = useState("Tiền mặt");
  const [wallets, setWallets] = useState([]);

  const [isOpenCate, setIsOpenCate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dropdownRef = useRef(null);

  // datetime
  // State Ngày giờ (Lấy thời gian hiện tại làm mặc định)
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    // Điều chỉnh múi giờ để hiển thị đúng giờ local trong input datetime-local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenCate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Handle select category
  const handleSelect = (category) => {
    setSelectedCategory(category);
    setIsOpenCate(false);
  };

  // Gọi API Khi Component vừa render lần đầu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Nhớ thay port 5000 bằng port mà server Node.js của bạn đang chạy
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/categories",
        );

        // Backend trả về: { success: true, message: "...", data: [...] }
        if (response.data.success) {
          setGroupedCategories(response.data.data); // Gán mảng data vào State
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục từ Backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Gọi API wallets Khi Component vừa render lần đầu
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        // Nhớ thay port 5000 bằng port mà server Node.js của bạn đang chạy
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/wallets",
        );

        // Backend trả về: { success: true, message: "...", data: [...] }
        if (response.data.success && response.data.data.length > 0) {
          setWallets(response.data.data); // Gán mảng data vào State
          setWallet(response.data.data[0].name); // Tự động chọn ví đầu tiên từ DB
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục từ Backend:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallets();
  }, []);

  // Hàm xử lý khi bấm nút lưu
  const handleAddRecord = async (e) => {
    e.preventDefault(); // Ngăn form reload lại trang

    // 1. Validate cơ bản (Bắt buộc phải nhập tiền và chọn danh mục)
    if (Number(amount) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ!");
      return; // Dừng lại không chạy tiếp
    }
    if (!selectedCategory) {
      alert("Vui lòng chọn danh mục!");
      return;
    }
    // 2. Gom dữ liệu lại thành 1 Object chuẩn bị gửi xuống Backend

    const transactionData = {
      type: active,
      amount: Number(amount),
      walletName: wallet,
      categoryId: selectedCategory.id,
      dateTime: dateTime,
      isTemplate: isTemplate,
      note: note,
      payer: payer,
      paymentType: paymentType,
      paymentStatus: paymentStatus,
    };

    // 3. Thực hiện gọi API lưu dữ liệu (Tạm thời console.log để test)
    console.log("Dữ liệu chuẩn bị gửi đi:", transactionData);

    // axios.post('/api/transactions', transactionData).then(...)
    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions",
        transactionData,
      );

      if (response.data.success) {
        alert("Thêm giao dịch thành công");
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi lưu giao dịch:", error);
      alert("Không thể lưu giao dịch, vui lòng thử lại!");
    }
  };

  // Đặt dòng này ở thân Component (trước phần return)
  const selectedWallet = wallets.find((item) => item.name === wallet) || {
    id: "",
    name: "Đang tải...",
    type: "",
    icon: "fa-solid fa-spinner fa-spin", // Hiển thị icon load khi chờ API
  };

  const tabClass = (type, activeColor) =>
    `relative z-10 flex-1 cursor-pointer rounded-xl px-4 py-2 text-center font-medium transition`;

  return (
    <div className="xl:w-[60%] bg-white rounded-2xl shadow-lg border border-gray-100">
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <h2 className="text-[1.6rem] font-semibold text-gray-800">
          Add Transaction
        </h2>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
          onClick={onClose}
        >
          <i className="fa-solid fa-x text-gray-500"></i>
        </button>
      </header>

      <form>
        <div className="flex">
          {/* Left Column */}
          <div className="flex-1 bg-gray-100 p-[1.5rem]">
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
                Số tiền <span className="text-red-500">*</span>
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600 bg-[white]"
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
                  <span className="flex flex-col absolute top-[50%] right-[1rem] translate-y-[-50%] text-gray-400 text-xs leading-none">
                    <i className="fa-solid fa-caret-up"></i>
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="mt-[1rem]">
              <h2
                className="text-[1.4rem] font-medium text-gray-700 cursor-pointer"
                onClick={() => {
                  setOpenWallet((prev) => !prev);
                }}
              >
                Account
              </h2>
              <div
                className={`flex items-center justify-between w-full rounded-lg border  px-4 py-2 outline-none  bg-[white] mt-[0.2rem] cursor-pointer relative ${openWallet === true ? "border-green-600" : "border-gray-300"}`}
                onClick={() => {
                  setOpenWallet((prev) => !prev);
                }}
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-[1.4rem]">
                    <i className={selectedWallet.icon}></i>
                  </span>

                  <h3 className="text-[1.4rem] font-medium text-gray-800">
                    {selectedWallet.name}
                  </h3>
                </div>

                {/* Right */}
                <div className="flex flex-col items-center justify-center text-gray-400 text-xs leading-none">
                  <i className="fa-solid fa-caret-up"></i>
                  <i className="fa-solid fa-caret-down -mt-1"></i>
                </div>

                {/* item absolute */}
                <div
                  className={`absolute top-[120%] left-0 w-full ${openWallet ? "" : "hidden"} z-10`}
                >
                  {wallets.map((item) => {
                    return (
                      <div
                        className="flex items-center justify-between w-full rounded-lg  px-4 py-2 outline-none focus:border-blue-500 bg-[white] mt-[0.2rem] cursor-pointer "
                        onClick={() => {
                          setWallet(item.name);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input id="account" type="text" className="hidden" />

                          <span className="text-gray-600 text-[1.4rem]">
                            <i className={item.icon}></i>
                          </span>

                          <h3 className="text-[1.4rem] font-medium text-gray-800">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center text-gray-400 text-[1.4rem] leading-none">
                          {item.name === wallet ? (
                            <i class="fa-solid fa-check"></i>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Start Danh mục */}
            <div className="mt-[1rem] relative" ref={dropdownRef}>
              <h2 className="text-[1.4rem] font-medium text-gray-700 cursor-pointer ">
                Danh mục <span className="text-red-500">*</span>
              </h2>
              {/* Box Input chọn danh mục */}

              <div
                onClick={() => setIsOpenCate(!isOpenCate)}
                className="flex items-center justify-between gap-5 w-full rounded-lg border px-4 py-2 outline-none bg-white cursor-pointer border-gray-300 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {selectedCategory ? (
                    <>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCategory.bgColor} ${selectedCategory.color}`}
                      >
                        <i className={selectedCategory.icon}></i>
                      </span>
                      <span className="text-gray-800 font-medium">
                        {selectedCategory.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-500 w-8 h-8 flex items-center justify-center">
                        <i className="fa-solid fa-layer-group text-lg"></i>
                      </span>
                      <span className="text-gray-400 select-none">
                        Chọn danh mục
                      </span>
                    </>
                  )}
                </div>

                <span className="flex flex-col text-gray-400 text-xs leading-none">
                  <i className="fa-solid fa-caret-up"></i>
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>

              {/* Dropdown List */}
              {isOpenCate && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[350px] overflow-y-auto p-2">
                  {/* Hiển thị chữ Đang tải nếu API chưa lấy xong */}
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </div>
                  ) : (
                    // Logic map dữ liệu đã lấy từ API (Hoàn toàn khớp với code cũ của bạn)
                    groupedCategories.map((group) => (
                      <div key={group.id} className="mb-2">
                        <div className="flex items-center gap-2 px-2 py-2">
                          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            {group.name}
                          </span>
                          <div className="flex-1 h-[1px] bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                          {group.children.map((child) => (
                            <div
                              key={child.id}
                              onClick={() => handleSelect(child)}
                              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-50 ${
                                selectedCategory?.id === child.id
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${child.bgColor} ${child.color}`}
                              >
                                <i className={`${child.icon} text-lg`}></i>
                              </div>
                              <span className="text-gray-700 font-medium">
                                {child.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* End Nhãn */}

            {/* Start Lịch */}
            {/* 2. Date & Time */}
            <div>
              <h2 className="text-[1.4rem] font-medium text-gray-800 mb-2">
                Date & Time
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <i className="fa-regular fa-calendar"></i>
                </div>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 outline-none focus:border-[#0da45d] focus:ring-1 focus:ring-[#0da45d] bg-white text-gray-800"
                />
              </div>
            </div>

            {/* 3. Checkbox */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="create-template"
                onChange={(e) => setIsTemplate(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#0da45d] focus:ring-[#0da45d] cursor-pointer"
              />
              <label
                htmlFor="create-template"
                className="text-gray-800 cursor-pointer text-[1.4rem] select-none"
              >
                Create template from this record
              </label>
            </div>

            {/* 4. Buttons */}
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                className="w-full bg-[#0da45d] hover:bg-[#0b8b4f] text-white font-semibold py-3 rounded-full transition-colors shadow-sm"
                onClick={handleAddRecord}
              >
                Add record
              </button>
              <button
                type="button"
                className="w-full bg-transparent border border-[#3b82f6] text-[#3b82f6] hover:bg-blue-50 font-semibold py-3 rounded-full transition-colors"
              >
                Add and create another
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 rounded-xl bg-white p-2 shadow-sm p-[1.5rem]">
            <h2 className="text-[1.6rem] font-semibold text-gray-800">
              Other details
            </h2>

            {/* 1. Note */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[1.3rem] font-semibold text-gray-800">
                Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your record"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[1.1rem] text-gray-800 outline-none focus:border-[#0da45d] focus:ring-1 focus:ring-[#0da45d] placeholder:text-gray-400"
              />
            </div>

            {/* 2. Payer */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[1.3rem] font-semibold text-gray-800">
                Payer
              </label>
              <input
                type="text"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[1.1rem] text-gray-800 outline-none focus:border-[#0da45d] focus:ring-1 focus:ring-[#0da45d]"
              />
            </div>

            {/* 3. Payment type */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[1.3rem] font-semibold text-gray-800">
                Payment type
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-[1.1rem] text-gray-800 outline-none focus:border-[#0da45d] focus:ring-1 focus:ring-[#0da45d] cursor-pointer"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                </select>
                {/* Icon 2 mũi tên lên xuống */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex flex-col items-center justify-center text-gray-400 text-[10px]">
                  <i className="fa-solid fa-chevron-up"></i>
                  <i className="fa-solid fa-chevron-down mt-[1px]"></i>
                </span>
              </div>
            </div>

            {/* 4. Payment status */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[1.3rem] font-semibold text-gray-800">
                Payment status
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-[1.1rem] text-gray-800 outline-none focus:border-[#0da45d] focus:ring-1 focus:ring-[#0da45d] cursor-pointer"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="cleared">Cleared</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                {/* Icon 2 mũi tên lên xuống */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex flex-col items-center justify-center text-gray-400 text-[10px]">
                  <i className="fa-solid fa-chevron-up"></i>
                  <i className="fa-solid fa-chevron-down mt-[1px]"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default FormAddTransaction;
