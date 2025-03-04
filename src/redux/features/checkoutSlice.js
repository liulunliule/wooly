import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedProducts: [],
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setSelectedProducts: (state, action) => {
            state.selectedProducts = action.payload;
        },
        clearCheckout: (state) => {
            state.selectedProducts = [];
        },
    },
});

export const { setSelectedProducts, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
