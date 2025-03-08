import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "~/redux/features/activeProductSlice";
import { fetchCategories } from "~/redux/features/categorySlice";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  searchProducts,
  clearSearchResults,
} from "~/redux/features/searchSlice";
import { formatPrice } from "~/utils/formatPrice";
import { ClipLoader } from "react-spinners"; // Import ClipLoader

function Collection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: products,
    status: productsStatus,
    totalItems: allTotalItems,
    totalPages: allTotalPages,
    currentPage: allCurrentPage,
  } = useSelector((state) => state.products.all);

  const {
    searchResults,
    status: searchStatus,
    totalItems: searchTotalItems,
    totalPages: searchTotalPages,
    currentPage: searchCurrentPage,
  } = useSelector((state) => state.search);

  const { categories, status: categoriesStatus } = useSelector(
    (state) => state.categories
  );

  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000000000000000000);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchAllProducts(page));
    }
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [productsStatus, categoriesStatus, dispatch, page]);

  useEffect(() => {
    if (
      selectedCategory ||
      minPrice !== 1 ||
      maxPrice !== 1000000000000000000
    ) {
      setPage(0);
      handleSearch(0);
    }
  }, [selectedCategory, minPrice, maxPrice]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowCategories(false);
  };

  const handleSearch = (page = 0) => {
    dispatch(
      searchProducts({
        categoryName: selectedCategory || "",
        productName: "",
        minPrice,
        maxPrice,
        page,
      })
    )
      .unwrap()
      .then(() => {
        navigate("/collection");
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error("Search failed:", error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(page);
    }
  };

  const handleReset = () => {
    setMinPrice(1);
    setMaxPrice(1000000000000000000);
    setSelectedCategory(null);
    dispatch(clearSearchResults());
    dispatch(fetchAllProducts(0));
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (
      selectedCategory ||
      minPrice !== 1 ||
      maxPrice !== 1000000000000000000
    ) {
      handleSearch(newPage);
    } else {
      dispatch(fetchAllProducts(newPage));
    }
  };

  const displayedProducts = searchResults.length > 0 ? searchResults : products;
  const currentTotalPages =
    searchResults.length > 0 ? searchTotalPages : allTotalPages;
  const currentPage =
    searchResults.length > 0 ? searchCurrentPage : allCurrentPage;

  // Loading state
  if (productsStatus === "loading" || categoriesStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36D7B7" size={50} />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t">
      <div className="w-full sm:w-1/5 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Bộ Lọc</h2>
        <div>
          <h3
            className="font-medium mb-2 cursor-pointer flex items-center"
            onClick={() => setShowCategories(!showCategories)}
          >
            Danh mục {showCategories ? "▲" : "▼"}
            {selectedCategory && (
              <span className="ml-2 text-gray-400">{selectedCategory}</span>
            )}
          </h3>
          {showCategories && (
            <div>
              {categories?.map((category) => (
                <label key={category.id} className="block mb-2">
                  <input
                    type="radio"
                    name="categoryFilter"
                    className="mr-2"
                    checked={selectedCategory === category.name}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4">
          <label className="block mb-2">Giá tối thiểu:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Giá tối đa:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Tải lại tất cả sản phẩm
        </button>
      </div>

      <div className="w-full sm:w-5/6 p-4">
        <h2 className="text-lg font-semibold mb-4">Sản Phẩm</h2>
        {searchStatus === "loading" ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader color="#36D7B7" size={30} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <Link
                  to={`/product/${product.productID}`}
                  key={product.productID}
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
                  <p className="text-gray-600">{formatPrice(product.price)}</p>
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
        )}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300 flex items-center"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="mx-4 self-center">
            Trang {currentPage + 1} / {currentTotalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === currentTotalPages - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-300 flex items-center"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Collection;
