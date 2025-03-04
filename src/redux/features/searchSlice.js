import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_ROOT from "~/utils/constants";

// Async thunk để gọi API tìm kiếm sản phẩm
export const searchProducts = createAsyncThunk(
  "search/searchProducts",  
  async ({ categoryName, productName, minPrice, maxPrice }, { rejectWithValue }) => {
    console.log("welcome to searchProducts");
    try {
      const response = await axios.get(`${API_ROOT}/homepage/search-product`, {
        params: { categoryName, productName, minPrice, maxPrice },
      });
      console.log("searchProducts", response);
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchResults: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // Thêm action để xóa kết quả tìm kiếm
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions; // Xuất action clearSearchResults
export default searchSlice.reducer;