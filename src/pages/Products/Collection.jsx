import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "~/redux/features/activeProductSlice";
import { fetchCategories } from "~/redux/features/categorySlice";
import Hero_image from "~/assets/hero_img.jpg";
import { searchProducts } from "~/redux/features/searchSlice";

function Collection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: products, status } = useSelector(
    (state) => state.products.all
  );
  const { categories } = useSelector((state) => state.categories);
  const { searchResults, status: searchStatus } = useSelector(
    (state) => state.search
  );

  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000000000000000000);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllProducts());
    }

    dispatch(fetchCategories());
  }, [status, dispatch]);

  const handleSearch = () => {
    dispatch(searchProducts({ productName: "", minPrice, maxPrice }))
      .unwrap()
      .then(() => {
        navigate("/collection");
      })
      .catch((error) => {
        console.error("Search failed:", error);
      });
  };

  const displayedProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t">
      {/* Sidebar Filter */}
      <div className="w-full sm:w-1/5 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Bộ Lọc</h2>
        <div>
          {categories?.map((category) => (
            <label key={category.id} className="block mb-2">
              <input type="radio" name="categoryFilter" className="mr-2" />
              {category.name}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="block mb-2">Giá tối thiểu:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Giá tối đa:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Áp dụng bộ lọc
        </button>
        <button
          onClick={() => {
            dispatch(fetchAllProducts());
            setMinPrice(1);
            setMaxPrice(999999);
          }}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Tải lại tất cả sản phẩm
        </button>
      </div>

      {/* Product List */}
      <div className="w-full sm:w-5/6 p-4">
        <h2 className="text-lg font-semibold mb-4">Sản Phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <Link
                to={`/product/${product.productID}`}
                key={product.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg hover:scale-110 transition ease-in-out"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-md font-medium mt-2">
                  {product.productName}
                </h3>
                <p className="text-gray-600">{product.price}đ</p>
                <p className="text-gray-600">
                  Số lượng: {product.stockQuantity}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Không có sản phẩm nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collection;
