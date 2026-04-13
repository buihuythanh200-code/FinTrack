const categoriesRepo = require("../repositories/dashboardRepository");
const getCategoriesForForm = async (req, res) => {
  try {
    // 1. Gọi Repo lấy data thô (Chạy song song bằng Promise.all cho tốc độ nhanh hơn)
    const [parents, children] = await Promise.all([
      categoriesRepo.getParentCategories(),
      categoriesRepo.getSubCategories(),
    ]);

    // 2. Logic lồng ghép (Mapping)
    const groupedCategories = parents.map((parent) => {
      return {
        id: parent.id,
        name: parent.name,
        type: parent.type,
        // Lọc danh mục con theo parent_category_id
        children: children
          .filter((child) => child.parent_category_id === parent.id)
          .map((child) => ({
            id: child.id,
            name: child.name,
            icon: child.icon,
            color: child.color,
            bgColor: child.bg_color, // Nhớ map sang camelCase để UI React dễ đọc
          })),
      };
    });

    // 3. Trả về cho Frontend
    return res.status(200).json({
      success: true,
      message: "Lấy danh mục thành công",
      data: groupedCategories,
    });
  } catch (error) {
    console.error("Lỗi getCategoriesForForm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

module.exports = {
  getCategoriesForForm,
};
