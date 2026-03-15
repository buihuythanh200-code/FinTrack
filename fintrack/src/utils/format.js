export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

export const parseLocalDate = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatMonthInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const formatTransactionDate = (dateString) => {
  if (!dateString) return "";

  const date = dateString.includes("T")
    ? new Date(dateString)
    : parseLocalDate(dateString);

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const transactionDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = today - transactionDay;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    return `Hôm nay, ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffDays === 1) {
    return "Hôm qua";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

export const parseDateInput = (value) => {
  return parseLocalDate(value);
};
