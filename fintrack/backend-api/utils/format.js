export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

export const formatTransactionDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  // reset giờ ngày để so sánh
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const transactionDay = new Date(
    date.getFullYear,
    date.getMonth,
    date.getDay(),
  );

  const diffTime = today - transactionDay;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Today
  if (diffDays === 0) {
    return `Hôm nay, ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  //Yesterday
  if (diffDays === 1) {
    return "Hôm qua";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};
