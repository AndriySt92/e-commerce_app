import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getToken } from '../../helpers/getToken'
import { logout } from './userSlice'
import { IOrder, IOrderRequestData, IPaymentResult } from '../../Models/OrderTypes'

export interface IOrderState {
  orders: Array<IOrder> | null
  orderDetails: IOrder | null
  isLoading: boolean
  isSuccess: boolean
  error: string
}

const initialState: IOrderState = {
  orders: null,
  orderDetails: null,
  isLoading: false,
  isSuccess: false,
  error: '',
}

export const getMyOrders = createAsyncThunk<Array<IOrder>>(
  'order/getMyOrders',
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }

      const { data } = await axios.get(`/api/orders`, config)
      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message
      if (errorMessage === 'Not authorized, token failed') {
        localStorage.removeItem('user')
        dispatch(logout())
      }
      return rejectWithValue(errorMessage)
    }
  },
)

export const getOrderById = createAsyncThunk<IOrder, string>(
  'order/getOrderById',
  async function (id, { rejectWithValue, dispatch }) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }

      const { data } = await axios.get(`/api/orders/${id}`, config)
      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message
      if (errorMessage === 'Not authorized, token failed') {
        localStorage.removeItem('user')
        dispatch(logout())
      }
      return rejectWithValue(errorMessage)
    }
  },
)

export const createOrder = createAsyncThunk<void, IOrderRequestData>(
  'order/createOrder',
  async function (orderData, { rejectWithValue, dispatch }) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }

      await axios.post(`/api/orders`, orderData, config)

      return
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      if (errorMessage === 'Not authorized, token failed') {
        localStorage.removeItem('user')
        dispatch(logout())
      }
      return rejectWithValue(errorMessage)
    }
  },
)

export const payOrder = createAsyncThunk<void, IPaymentResult & { orderId: string }>(
  'order/payOrder',
  async function (payOrderData, { rejectWithValue, dispatch }) {
    try {
      const { orderId, ...paymentResult } = payOrderData
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }

      await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)
      return
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      if (errorMessage === 'Not authorized, token failed') {
        localStorage.removeItem('user')
        dispatch(logout())
      }
      return rejectWithValue(errorMessage)
    }
  },
)

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: {
    [getMyOrders.fulfilled.type]: (state, action: PayloadAction<Array<IOrder>>) => {
      state.isLoading = false
      state.error = ''
      state.orders = action.payload
    },
    [getMyOrders.pending.type]: (state) => {
      state.isLoading = true
    },
    [getMyOrders.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [getOrderById.fulfilled.type]: (state, action: PayloadAction<IOrder>) => {
      state.isLoading = false
      state.error = ''
      state.orderDetails = action.payload
    },
    [getOrderById.pending.type]: (state) => {
      state.isLoading = true
    },
    [getOrderById.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [createOrder.fulfilled.type]: (state) => {
      state.isLoading = false
      state.error = ''
      state.isSuccess = true
    },
    [createOrder.pending.type]: (state) => {
      state.isLoading = true
      state.isSuccess = false
    },
    [createOrder.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [payOrder.fulfilled.type]: (state) => {
      state.isLoading = false
      state.error = ''
      state.isSuccess = true
    },
    [payOrder.pending.type]: (state) => {
      state.isLoading = true
      state.isSuccess = false
    },
    [payOrder.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export default orderSlice.reducer
