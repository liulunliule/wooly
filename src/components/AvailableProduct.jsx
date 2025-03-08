import { Button } from "@mui/material";
import ProductItem from "./ProductItem";
import Title from "./Title";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useState } from "react";
import { fetchBestSellerProductAPI } from "~/apis";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellerProducts } from "~/redux/features/activeProductSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "~/utils/formatPrice";
import { ClipLoader } from "react-spinners";

function AvailableProduct() {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //     fetchBestSellerProductAPI().then((data) => {
  //         setProducts(data.data);
  //     });
  // }, []);
  const dispatch = useDispatch();
  const { items: products, status } = useSelector(
    (state) => state.products.bestSeller
  );
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBestSellerProducts());
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
      <div className="text-center py-8 text-3xl">
        <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {products.map((product) => (
          <Link
            to={`/product/${product.productId}`}
            key={product.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            {/* <ProductItem
              key={product.productId}
              productName={product.productName}
              productPicture={product.productPicture}
              productPrice={product.productPrice}
            /> */}
            <img
              src={product.productPicture}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-md hover:scale-110 transition ease-in-out"
            />
            <h3 className="text-md font-medium mt-2">{product.productName}</h3>
            <p className="text-gray-600">{formatPrice(product.productPrice)}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          component={Link}
          to="/collection"
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />} // Thêm icon
        >
          XEM THÊM
        </Button>
      </div>
    </div>
  );
}

export default AvailableProduct;
