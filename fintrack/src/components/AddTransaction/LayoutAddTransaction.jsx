import FormAddTransaction from "./FormAddTransaction";
function LayoutAddTransaction({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-51 flex justify-center items-center"
      onClick={onClose}
    >
      {/* Ngăn sự kiện click lan ra ngoài nền đen khi click vào form */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-full flex justify-center"
      >
        <FormAddTransaction onClose={onClose} />
      </div>
    </div>
  );
}
export default LayoutAddTransaction;
