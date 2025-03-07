import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_ROOT from "~/utils/constants";

export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async ({ categoryName, productName, minPrice, maxPrice, page = 0 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ROOT}/homepage/search-product`, {
        params: { categoryName, productName, minPrice, maxPrice, page },
      });
      return {
        products: response.data.data.products,
        totalItems: response.data.data.totalItems,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.currentPage,
      };
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
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.status = "idle";
      state.error = null;
      state.totalItems = 0;
      state.totalPages = 0;
      state.currentPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload.products;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;