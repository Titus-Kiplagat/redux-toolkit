import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';
import axios from 'axios';

const initialState = {
	cartItems,
	amount: 5,
	total: 0,
	isLoading: true,
};

const url = 'https://course-api.com/react-useReducer-cart-projectj';

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (thunkAPI) => {
	try {
		const response = await axios(url);
		return response.data;
	} catch (error) {
		thunkAPI.rejectWithValue(error);

	}
})

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		clearCart: (state) => {
			state.cartItems = [];
		},
		removeItem: (state, action) => {
			const id = action.payload;
			state.cartItems = state.cartItems.filter((item) => item.id !== id);
		},
		increment: (state, {payload}) => {
			const cartItem = state.cartItems.find((item) => item.id === payload.id);
			cartItem.amount += 1;
		},
		decrement: (state, { payload }) => {
			const cartItem = state.cartItems.find((item) => item.id === payload.id);
			cartItem.amount -= 1;
		},
		calculateTotals: (state) => {
			let amount = 0;
			let total = 0;
			state.cartItems.forEach((item) => {
				amount += item.amount;
				total += item.price * item.amount;
			});
			state.amount = amount;
			state.total = total;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCartItems.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchCartItems.fulfilled, (state, action) => {
			state.isLoading = false;
			state.cartItems = action.payload;
		});
		builder.addCase(fetchCartItems.rejected, (state) => {
			state.isLoading = false;
		});
	},
});

export const { clearCart, removeItem, increment, decrement, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;