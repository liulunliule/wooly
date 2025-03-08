import { Button } from "@mui/material";
import Title from "./Title";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellerProducts } from "~/redux/features/activeProductSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "~/utils/formatPrice";
import { ClipLoader } from "react-spinners";

function AvailableProduct() {
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
            <div className="text-center py-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
                <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <Link
                        to={`/product/${product.productId}`}
                        key={product.id}
                        className="relative border border-blue-300 p-4 rounded-lg shadow-lg overflow-hidden transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-400 to-green-500 opacity-10 hover:opacity-30 transition duration-300"></div>

                        <img
                            src={product.productPicture}
                            alt={product.name}
                            className="w-full aspect-square object-cover rounded-md transition transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                        />

                        <h3 className="text-lg font-bold text-gray-800 mt-3">
                            {product.productName}
                        </h3>
                        <p className="text-xl font-bold text-blue-600">
                            {formatPrice(product.productPrice)}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <Button
                    component={Link}
                    to="/collection"
                    variant="contained"
                    sx={{
                        background:
                            "linear-gradient(to right, #36D7B7, #007bff)",
                        color: "white",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        textTransform: "none",
                        boxShadow: "0 4px 10px rgba(0, 123, 255, 0.4)",
                        "&:hover": {
                            background:
                                "linear-gradient(to right, #007bff, #36D7B7)",
                            boxShadow: "0 6px 15px rgba(0, 123, 255, 0.6)",
                        },
                    }}
                    endIcon={<ArrowForwardIcon />}
                >
                    XEM THÊM
                </Button>
            </div>
        </div>
    );
}

export default AvailableProduct;
