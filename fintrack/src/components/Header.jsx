import logo from "../assets/logo-removebg-preview.png";
import LayoutAddTransaction from "./AddTransaction/LayoutAddTransaction";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
function Header() {
  // hook này sẽ trả về object location, trong đó .pathname là đường dẫn hiện tại (vd: /transactions)
  const location = useLocation();
  const currentPath = location.pathname;
  // handle nền form new transaction
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-26">
          {/* 1. CỤM LOGO & BRAND */}
          <a
            href="/dashboard"
            className="flex items-center flex-shrink-0 cursor-pointer"
          >
            <img
              src={logo}
              alt="Wallet Logo"
              className="h-auto w-[8rem] object-contain"
            />
          </a>

          {/* 2. CỤM NAVIGATION (Menu chính - Ẩn trên mobile) */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4">
            <a
              href="/dashboard"
              className={`px-5 py-3 rounded-lg text-[1.6rem] font-semibold transition-colors ${
                currentPath === "/dashboard"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Dashboard
            </a>
            <a
              href="/transactions"
              className={`px-5 py-3 rounded-lg text-[1.6rem] font-semibold transition-colors ${
                currentPath === "/transactions"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Transactions
            </a>
            <a
              href="/transactions"
              className={`px-5 py-3 rounded-lg text-[1.6rem] font-semibold transition-colors ${
                currentPath === "/calendar"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Calendar
            </a>
            <a
              href="/budgets"
              className={`px-5 py-3 rounded-lg text-[1.6rem] font-semibold transition-colors ${
                currentPath === "/budgets"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Budgets
            </a>
            <a
              href="/reports"
              className={`px-5 py-3 rounded-lg text-[1.6rem] font-semibold transition-colors ${
                currentPath === "/reports"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Reports
            </a>
          </nav>

          {/* 3. CỤM ACTIONS & PROFILE */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Nút Thêm giao dịch nhanh (Sử dụng màu xanh ngọc có opacity nhẹ để dịu mắt) */}
            <button
              className="flex items-center gap-2 bg-[#009360]/90 hover:bg-[#009360] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="fa-solid fa-plus"></i>
              <span className="max-sm:hidden">New Transaction</span>
            </button>
            {/* Gọi Component và truyền Props vào */}
            <LayoutAddTransaction
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />

            <button className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100 cursor-pointer">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="relative cursor-pointer group flex justify-center items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-[#009360]/50 transition-all">
                <i className="fa-solid fa-user text-gray-500"></i>
              </div>
              {/* Tên người dùng */}
              <span className="text-[1.4rem] font-medium text-gray-700 group-hover:text-[#009360] transition-colors">
                {JSON.parse(localStorage.getItem("user"))?.name || "Khách"}
              </span>

              {/* Icon tam giác (Caret Down) */}
              <i className="fa-solid fa-caret-down text-gray-400 text-[1.2rem] group-hover:rotate-180 transition-transform duration-300"></i>
            </div>

            <button className="md:hidden p-2 text-gray-500 hover:text-gray-900">
              <i className="fa-solid fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
