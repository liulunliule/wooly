import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import API_ROOT from "~/utils/constants";

const getAuthHeaders = (getState) => {
  const token = getState().auth.accessToken;
  if (!token) throw new Error("Unauthorized");
  return { Authorization: `Bearer ${token}` };
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, cartItems }, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.accessToken; 

    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await axios.post(
        `${API_ROOT}/cart/add?productId=${productId}&quantity=${quantity}`,
        cartItems,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đã thêm vào giỏ hàng thành công!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Thêm vào giỏ hàng thất bại!");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);

      const response = await axios.get(`${API_ROOT}/cart/get-cart`, { headers });

      console.log("fetchCart response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("fetchCart error:", error);
      toast.error("Không thể lấy dữ liệu giỏ hàng!");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartDetailId, newQuantity }, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);

      const response = await axios.put(
        `${API_ROOT}/cart/update-quantity?cartDetailId=${cartDetailId}&newQuantity=${newQuantity}`,
        {},
        { headers }
      );

      console.log("updateCartQuantity response:", response.data);
      toast.success("Cập nhật số lượng thành công!");
      return { cartDetailId, newQuantity };
    } catch (error) {
      console.error("updateCartQuantity error:", error);
      toast.error("Cập nhật số lượng thất bại!");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartDetailId, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);

      const response = await axios.delete(`${API_ROOT}/cart/remove?cartDetailId=${cartDetailId}`, { headers });

      console.log("removeCartItem response:", response.data);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
      return cartDetailId;
    } catch (error) {
      console.error("removeCartItem error:", error);
      toast.error("Xóa sản phẩm thất bại!");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);

      const response = await axios.delete(`${API_ROOT}/cart/clear`, { headers });

      console.log("clearCart response:", response.data);
      toast.success("Giỏ hàng đã được xóa toàn bộ!");
      return [];
    } catch (error) {
      console.error(" clearCart error:", error);
      toast.error("Xóa giỏ hàng thất bại!");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Thêm sản phẩm vào giỏ hàng
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Lấy giỏ hàng từ API
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Cập nhật số lượng
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { cartDetailId, newQuantity } = action.payload;
        const product = state.items.find((item) => item.cartDetailId === cartDetailId);
        if (product) product.quantity = newQuantity;
      })

      // Xóa sản phẩm khỏi giỏ hàng
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.cartDetailId !== action.payload);
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
