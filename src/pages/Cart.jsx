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
  clearCart,
} from "~/redux/features/cartSlice";
import { setSelectedProducts } from "~/redux/features/checkoutSlice";
import { formatPrice } from "~/utils/formatPrice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartProducts, status } = useSelector((state) => state.cart);
  const selectedProducts = useSelector(
    (state) => state.checkout.selectedProducts
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // const handleCheckboxChange = (event, product) => {
  //   if (event.target.checked) {
  //     dispatch(setSelectedProducts([...selectedProducts, product]));
  //   } else {
  //     dispatch(
  //       setSelectedProducts(
  //         selectedProducts.filter(
  //           (p) => p.cartDetailId !== product.cartDetailId
  //         )
  //       )
  //     );
  //   }
  // };
  const handleCheckboxChange = (event, product) => {
    const selectedProduct = {
      cartDetailId: product.cartDetailId,
      productId: product.productId,
      productName: product.productName,
      pricePerProduct: product.pricePerProduct,
      quantity: product.quantity,
      imageURL: product.imageURL,
      partList: product.parts.map((part) => ({
        partId: part.productPartId,
        partName: part.productPartName,
        partDescription: "part infor for " + part.productPartName,
        partColor: part.productPartColorName,
      })),
    };

    if (event.target.checked) {
      dispatch(setSelectedProducts([...selectedProducts, selectedProduct]));
    } else {
      dispatch(
        setSelectedProducts(
          selectedProducts.filter(
            (p) => p.cartDetailId !== product.cartDetailId
          )
        )
      );
    }
  };

  const handleQuantityChange = (cartDetailId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartQuantity({ cartDetailId, newQuantity }));
  };

  const handleRemoveProduct = (cartDetailId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
      )
    ) {
      dispatch(removeCartItem(cartDetailId));
    }
  };

  const handleClearCart = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?"
      )
    ) {
      dispatch(clearCart());
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    navigate("/checkout");
  };

  console.log("selectedProducts", selectedProducts);

  const totalPrice = selectedProducts.reduce(
    (total, product) => total + product.pricePerProduct * product.quantity,
    0
  );

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"GIỎ HÀNG"} text2={"CỦA BẠN"} />
      </div>

      {status === "loading" ? (
        <div className="text-center text-lg">Đang tải giỏ hàng...</div>
      ) : cartProducts.length > 0 ? (
        <div className="space-y-6">
          {cartProducts.map((product) => (
            <div
              key={product.cartDetailId}
              className="flex items-center space-x-6 border-b py-4"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedProducts.some(
                      (p) => p.cartDetailId === product.cartDetailId
                    )}
                    onChange={(e) => handleCheckboxChange(e, product)}
                  />
                }
                label=""
              />

              <img
                src={product.imageURL}
                alt={product.productName}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-medium text-lg">{product.productName}</p>
                <div className="mt-2 space-y-1">
                  {product.parts.map((part, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span>{part.productPartName}</span>
                      <span className="ml-2">
                        - Màu:{" "}
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: part.productPartColorName }}
                        ></span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500 font-medium">
                {/* <p>{product?.pricePerProduct?.toLocaleString()}đ</p> */}
                <p>{formatPrice(product.pricePerProduct)}</p>
              </div>

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

              <div className="text-sm font-medium">
                <p>
                  {/* {(
                    product.pricePerProduct * product.quantity
                  ).toLocaleString()}
                  đ */}
                  {formatPrice(product.pricePerProduct * product.quantity)}
                </p>
              </div>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveProduct(product.cartDetailId)}
                className="ml-4"
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-500">
          Chưa có sản phẩm nào trong giỏ hàng.
        </div>
      )}

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
              onClick={handleProceedToCheckout}
            >
              THANH TOÁN
            </Button>
          </div>
        </div>
      )}

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
