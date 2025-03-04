import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_ROOT from "~/utils/constants";

// Async thunk để gọi API tìm kiếm sản phẩm
export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async ({ productName, minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ROOT}/homepage/search-product`, {
        params: { productName, minPrice, maxPrice },
      });
      console.log("searchProducts",response.data.data);
      
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
  reducers: {},
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

export default searchSlice.reducer;