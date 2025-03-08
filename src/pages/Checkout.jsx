import { useState } from "react";
import {
  Button,
  TextField,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Hero_image from "~/assets/hero_img.jpg";
import { createPaymentLink } from "~/redux/features/paymentSlice"; // Action để gọi API thanh toán
import { formatPrice } from "~/utils/formatPrice";
import { toast } from "react-toastify";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", address: "", note: "" });
  const [isPaying, setIsPaying] = useState(false); // State để theo dõi trạng thái loading

  const selectedProducts = useSelector(
    (state) => state.checkout.selectedProducts
  );

  const totalAmount = selectedProducts.reduce(
    (total, item) => total + item.pricePerProduct * item.quantity,
    0
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = () => {
    if (!form.phone || !form.address) {
      alert("Vui lòng điền đầy đủ số điện thoại và địa chỉ.");
      return;
    }

    setIsPaying(true); // Bắt đầu loading

    const orderData = {
      description: "Thanh toán đơn hàng",
      customerNote: form.note,
      customerAddress: form.address,
      customerPhone: form.phone,
      productCheckoutRequestList: selectedProducts.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        price: product.pricePerProduct,
        quantity: product.quantity,
        partList: product.partList || [],
      })),
    };

    dispatch(createPaymentLink(orderData))
      .then((response) => {
        console.log("createPaymentLink(orderData) response", response);

        if (response?.payload?.checkoutUrl) {
          window.location.href = response.payload.checkoutUrl;
        } else {
          alert("Lỗi khi tạo link thanh toán, vui lòng thử lại!");
          // toast.error("Lỗi khi tạo link thanh toán, vui lòng thử lại!");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tạo link thanh toán:", error);
        alert("Lỗi khi tạo link thanh toán, vui lòng thử lại!");
      })
      .finally(() => {
        setIsPaying(false); // Kết thúc loading
      });
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Thanh toán</h2>

      {/* Danh sách sản phẩm */}
      <div className="border-b pb-4">
        {selectedProducts.map((item) => (
          <div
            key={item.productId}
            className="flex items-center space-x-4 mb-4"
          >
            <img
              src={item.imageURL || Hero_image}
              alt={item.productName}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500">
                {formatPrice(item.pricePerProduct)} x {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              {formatPrice(item.pricePerProduct * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-between items-center font-semibold text-lg py-4">
        <p>Tổng tiền:</p>
        <p className="text-red-500">{formatPrice(totalAmount)}</p>
      </div>

      {/* Thông tin người nhận */}
      <div className="space-y-4">
        <TextField
          label="Số điện thoại"
          fullWidth
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <TextField
          label="Địa chỉ nhận hàng"
          fullWidth
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <TextField
          label="Ghi chú khách hàng"
          fullWidth
          name="note"
          value={form.note}
          onChange={handleChange}
        />
      </div>

      {/* Nút Thanh toán */}
      <div className="mt-6 flex justify-between items-center">
        <Link to="/cart">
          <Button variant="outlined" color="primary">
            Quay lại giỏ hàng
          </Button>
        </Link>
        <Button
          variant="contained"
          color="warning"
          onClick={handleCheckout}
          disabled={isPaying}
          style={{ cursor: isPaying ? "wait" : "pointer" }}
        >
          {isPaying ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Thanh toán"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Checkout;
