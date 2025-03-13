import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "~/redux/features/activeProductSlice";
import { addToCart } from "~/redux/features/cartSlice";
import { toast } from "react-toastify";
import Hero_image from "~/assets/hero_img.jpg";
import { setSelectedProducts } from "~/redux/features/checkoutSlice";
import { formatPrice } from "~/utils/formatPrice";
import { fetchLatestProducts } from "~/redux/features/activeProductSlice";
import { ClipLoader } from "react-spinners";

function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    item: product,
    status: productStatus,
    error: productError,
  } = useSelector((state) => state.products.productDetail);

  const {
    items: latestProducts,
    status: latestProductsStatus,
    error: latestProductsError,
  } = useSelector((state) => state.products.latest);

  const selectedProducts = useSelector(
    (state) => state.checkout.selectedProducts
  );
  const { accessToken } = useSelector((state) => state.auth);

  const [selectedPart, setSelectedPart] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupBuyOpen, setIsPopupBuyOpen] = useState(false);

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (latestProductsStatus === "idle") {
      dispatch(fetchLatestProducts());
    }
  }, [latestProductsStatus, dispatch]);

  useEffect(() => {
    if (product?.partNames?.length > 0) {
      const initialColors = {};
      product.partNames.forEach((part, index) => {
        initialColors[index] = {
          colorID: part.partColors[0].colorID,
          partColor: part.partColors[0].partColor,
        };
      });
      setSelectedColors(initialColors);
    }
  }, [product]);

  if (productStatus === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36D7B7" size={50} />
      </div>
    );
  if (productStatus === "failed")
    return <p className="text-center text-red-500">Lỗi: {productError}</p>;
  if (!product) return <p className="text-center">Không tìm thấy sản phẩm.</p>;

  const handleColorChange = (partIndex, colorID, partColor) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [partIndex]: { colorID, partColor },
    }));
  };

  const openPopup = () => {
    if (!accessToken) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    setIsPopupOpen(true);
  };

  const openPopupBuy = () => {
    if (!accessToken) {
      toast.error("Bạn cần đăng nhập để mua sản phẩm!");
      return;
    }
    setIsPopupBuyOpen(true);
  };

  const handleAddToCart = () => {
    if (!productId || !product) {
      toast.error("Không tìm thấy sản phẩm!");
      return;
    }

    const cartItems = Object.keys(selectedColors).map((partIndex) => ({
      productPartId: product.partNames[partIndex]?.partID || null,
      partColorId: selectedColors[partIndex]?.colorID || null,
      productPartName: product.partNames[partIndex]?.partName || "",
      productPartColorName: selectedColors[partIndex]?.partColor || "",
    }));

    dispatch(addToCart({ productId, quantity, cartItems }));
    setIsPopupOpen(false);
    // toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    if (!productId || !product) {
      toast.error("Không tìm thấy sản phẩm!");
      return;
    }

    const orderDetails = {
      productId,
      productName: product.productName,
      pricePerProduct: product.price,
      quantity,
      imageURL: product.imageUrl || Hero_image,
      partList: Object.keys(selectedColors).map((partIndex) => ({
        partId: product.partNames[partIndex]?.partID || null,
        partName: product.partNames[partIndex]?.partName,
        partColor: selectedColors[partIndex]?.partColor,
        partDescription: "",
      })),
    };

    dispatch(setSelectedProducts([orderDetails]));
    navigate("/checkout");
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Details */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-100 object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">{product.productName}</h1>
              <p className="mt-2 text-gray-600">{product.description}</p>
              {product.price === 0 && (
                <div className="mt-4">
                  <p className="text-red-500 font-medium">
                    Lưu ý: Vì đây là hàng đặt trước, <br />
                    nên bạn vui lòng liên hệ chúng mình qua
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-gray-600">Zalo:</span>
                    <input
                      type="text"
                      value="0843532640"
                      readOnly
                      className="border p-1 rounded-lg cursor-pointer bg-gray-100"
                      onClick={(e) => e.target.select()}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("0843532640");
                        toast.success("Đã sao chép số điện thoại!");
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Part Selection */}
              {product.partNames && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Chọn bộ phận:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.partNames.map(({ partID, partName }, index) => (
                      <button
                        key={partID}
                        className={`w-3/10 px-4 py-2 border-2 rounded-lg ${
                          selectedPart === index
                            ? "border-black bg-gray-200"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedPart(index)}
                      >
                        {partName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product?.partNames && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Chọn màu:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.partNames[selectedPart]?.partColors.map(
                      ({ colorID, partColor }) => (
                        <button
                          key={colorID}
                          className={`w-10 h-10 rounded-full border-2 ${
                            selectedColors[selectedPart]?.colorID === colorID
                              ? "border-black scale-110"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: partColor }}
                          onClick={() =>
                            handleColorChange(selectedPart, colorID, partColor)
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                {product.price === 0 ? (
                  // Nút liên hệ Zalo khi giá = 0 (không có biểu tượng)
                  <a
                    href="https://zalo.me/0843532640"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition text-center"
                  >
                    Liên hệ Zalo
                  </a>
                ) : (
                  // Nút "Thêm vào giỏ hàng" và "Mua ngay" khi giá > 0
                  <>
                    <button
                      className="w-full sm:w-1/2 bg-orange-100 text-red-500 border-2 border-red-500 py-3 rounded-lg text-lg font-medium hover:bg-orange-200 transition"
                      onClick={openPopup}
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      className="w-full sm:w-1/2 bg-red-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-red-600 transition"
                      onClick={openPopupBuy}
                    >
                      Mua ngay
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Products */}
        <div className="lg:col-span-1 border-l border-gray-200 pl-5">
          <h2 className="text-lg font-semibold mb-2 pl-2">Sản Phẩm Mới</h2>
          <div
            className="space-y-2 overflow-y-auto pl-2"
            style={{
              maxHeight: "400px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {latestProductsStatus === "loading" ? (
              <div className="flex justify-center items-center">
                <ClipLoader color="#36D7B7" size={30} />
              </div>
            ) : latestProductsStatus === "failed" ? (
              <p className="text-center text-red-500">
                Lỗi: {latestProductsError}
              </p>
            ) : (
              latestProducts
                .filter((p) => p.productId !== productId)
                .map((product) => (
                  <Link
                    to={`/product/${product.productId}`}
                    key={product.productId}
                    className="flex items-center gap-2 p-2 border rounded-lg hover:shadow-lg transition"
                  >
                    <img
                      src={product.productPicture || Hero_image}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-sm font-medium">
                        {product.productName}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {formatPrice(product.productPrice)}
                      </p>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận sản phẩm</h2>
            <p className="text-lg font-medium">{product.productName}</p>
            <p className="text-red-500 font-semibold">{product.price}đ</p>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Chi tiết lựa chọn:</h3>
              {Object.keys(selectedColors).map((partIndex) => (
                <p key={partIndex}>
                  {product.partNames[partIndex]?.partName} -{" "}
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: selectedColors[partIndex]?.partColor,
                    }}
                  ></span>
                </p>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Số lượng:</h3>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            <p className="mt-4 text-lg font-bold">
              Tổng tiền: {product.price * quantity}đ
            </p>

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setIsPopupOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleAddToCart}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Now Popup */}
      {isPopupBuyOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận sản phẩm</h2>
            <p className="text-lg font-medium">{product.productName}</p>
            <p className="text-red-500 font-semibold">{product.price}đ</p>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Chi tiết lựa chọn:</h3>
              {Object.keys(selectedColors).map((partIndex) => (
                <p key={partIndex}>
                  {product.partNames[partIndex]?.partName} -{" "}
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: selectedColors[partIndex]?.partColor,
                    }}
                  ></span>
                </p>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Số lượng:</h3>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full mt-2 p-2 border rounded-lg"
              />
            </div>

            <p className="mt-4 text-lg font-bold">
              Tổng tiền: {product.price * quantity}đ
            </p>

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setIsPopupBuyOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
