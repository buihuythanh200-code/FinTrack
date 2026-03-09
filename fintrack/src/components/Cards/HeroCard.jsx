function HeroCard({ title, amount, trend, iconColor }) {
  return (
    <div className="lg:col-span-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-7 rounded-2xl shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-5 blur-2xl"></div>
      <div className="absolute bottom-0 right-10 w-24 h-24 rounded-full bg-[#009360] opacity-20 blur-xl"></div>
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[120px]">
        <div>
          <p className="text-gray-400 text-[1.6rem] font-medium mb-1">
            {title}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-1">
            {amount}
          </h2>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span className="bg-white/10 border border-white/20 text-white text-[1.4rem] font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
            <i
              className={`fa-solid fa-arrow-trend-up ${iconColor} text-[10px]`}
            ></i>
            {trend} vs last month
          </span>
        </div>
      </div>
    </div>
  );
}
export default HeroCard;
