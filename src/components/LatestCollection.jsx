import { Button } from "@mui/material";
import Title from "./Title";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestProducts } from "~/redux/features/activeProductSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "~/utils/formatPrice";
import { ClipLoader } from "react-spinners";

function LatestCollection() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector(
    (state) => state.products.latest
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLatestProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-40">
        <ClipLoader color="#36D7B7" size={50} />
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <Title text1={"SẢN PHẨM"} text2={"CÓ SẴN"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link
            to={`/product/${product.productId}`}
            key={product.id}
            className="relative border p-4 rounded-lg shadow-lg overflow-hidden transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-pink-100 hover:to-yellow-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-400 to-red-500 opacity-10 hover:opacity-30 transition duration-300"></div>

            <img
              src={product.productPicture}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-md transition transform hover:scale-110"
            />

            <h3 className="text-lg font-bold text-gray-800 mt-3">
              {product.productName}
            </h3>
            {/* Hiển thị số Zalo nếu giá = 0, ngược lại hiển thị giá tiền */}
            <p className="text-xl font-bold text-red-600">
              {product.productPrice === 0
                ? "Liên hệ Zalo: 0843532640"
                : formatPrice(product.productPrice)}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link to="/collection">
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #ff512f, #dd2476)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              padding: "10px 20px",
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(255, 0, 150, 0.4)",
              "&:hover": {
                background: "linear-gradient(to right, #dd2476, #ff512f)",
                boxShadow: "0 6px 15px rgba(255, 0, 150, 0.6)",
              },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            XEM THÊM
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LatestCollection;
