import Header from "../../components/Header.jsx";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* thanh header */}
      <Header />

      {/* Hiển thị các trang */}
      <main>{children}</main>
    </div>
  );
}
export default MainLayout;
