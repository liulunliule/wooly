import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_ROOT from "~/utils/constants";

export const createPaymentLink = createAsyncThunk(
  "payment/createPaymentLink",
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.accessToken; 

      if (!token) throw new Error("Không tìm thấy token!");

      const response = await axios.post(
        `${API_ROOT}/order/create-payment-link`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("createPaymentLink paymentData",paymentData);
      console.log("createPaymentLink response", response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Đã xảy ra lỗi");
    }
  }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        paymentLink: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentLink.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPaymentLink.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.paymentLink = action.payload;
            })
            .addCase(createPaymentLink.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default paymentSlice.reducer;
