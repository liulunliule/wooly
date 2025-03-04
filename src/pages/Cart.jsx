import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Title from "~/components/Title";
import Hero_image from "~/assets/hero_img.jpg";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartQuantity,
  removeCartItem,
  clearCart, // Thêm action xóa toàn bộ giỏ hàng
} from "~/redux/features/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartProducts, status } = useSelector((state) => state.cart);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchCart()); // Fetch cart khi component mount
  }, [dispatch]);

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedProducts((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((productId) => productId !== id)
      );
    }
  };

  const handleQuantityChange = (cartDetailId, newQuantity) => {
    if (newQuantity < 1) return; // Không cho số lượng nhỏ hơn 1
    dispatch(updateCartQuantity({ cartDetailId, newQuantity }));
  };

  const handleRemoveProduct = (cartDetailId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
    );
    if (confirmDelete) {
      dispatch(removeCartItem(cartDetailId));
    }
  };

  const handleClearCart = () => {
    const confirmDeleteAll = window.confirm(
      "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?"
    );
    if (confirmDeleteAll) {
      dispatch(clearCart());
    }
  };

  const totalPrice = cartProducts.reduce((total, product) => {
    if (selectedProducts.includes(product.cartDetailId)) {
      return total + product.pricePerProduct * product.quantity;
    }
    return total;
  }, 0);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"GIỎ HÀNG"} text2={"CỦA BẠN"} />
      </div>

      {/* Loading State */}
      {status === "loading" && (
        <div className="text-center text-lg">Đang tải giỏ hàng...</div>
      )}

      {/* Cart content */}
      <div className="space-y-6">
        {cartProducts.length > 0 ? (
          cartProducts.map((product) => (
            <div
              key={product.cartDetailId}
              className="flex items-center space-x-6 border-b py-4"
            >
              {/* Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedProducts.includes(product.cartDetailId)}
                    onChange={(e) =>
                      handleCheckboxChange(e, product.cartDetailId)
                    }
                  />
                }
                label=""
              />

              {/* Product Image */}
              <img
                src={product.imageURL || Hero_image} // Nếu không có ảnh, dùng ảnh mặc định
                alt={product.productName}
                className="w-24 h-24 object-cover rounded"
              />

              {/* Product Name */}
              <div className="flex-1">
                <p className="font-medium text-lg">{product.productName}</p>
              </div>

              {/* Product Price */}
              <div className="text-sm text-gray-500 font-medium">
                <p>{product.pricePerProduct.toLocaleString()}đ</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-2">
                <p className="text-sm">Số lượng:</p>
                <input
                  type="number"
                  value={product.quantity}
                  min="1"
                  className="w-16 text-center border border-gray-300 rounded"
                  onChange={(e) =>
                    handleQuantityChange(
                      product.cartDetailId,
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* Total Price */}
              <div className="text-sm font-medium">
                <p>
                  {(
                    product.pricePerProduct * product.quantity
                  ).toLocaleString()}
                  đ
                </p>
              </div>

              {/* Delete Button */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveProduct(product.cartDetailId)}
                className="ml-4"
              >
                Xóa
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center text-lg text-gray-500">
            Chưa có sản phẩm nào trong giỏ hàng.
          </div>
        )}
      </div>

      {/* Tổng tiền của sản phẩm đã chọn */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-100 border-t">
          <p className="font-medium text-lg">Tổng tiền:</p>
          <div className="flex items-center space-x-4">
            <p className="font-bold text-xl text-red-500">
              {totalPrice.toLocaleString()}đ
            </p>
            <Button
              variant="contained"
              color="warning"
              className="text-white px-8"
              onClick={() => navigate("/checkout")}
            >
              THANH TOÁN
            </Button>
          </div>
        </div>
      )}

      {/* Nút xóa toàn bộ giỏ hàng */}
      {cartProducts.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outlined" color="error" onClick={handleClearCart}>
            XÓA TẤT CẢ SẢN PHẨM
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Link to="/collection">
          <Button variant="contained" color="primary">
            TIẾP TỤC MUA SẮM
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
