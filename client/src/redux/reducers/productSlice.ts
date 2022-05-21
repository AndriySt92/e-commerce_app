import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getToken } from '../../helpers/getToken'
import { IGetProductsResponse, IProduct, IReviewFormData } from '../../Models/ProductTypes'
import { logout } from './userSlice'

export interface IUserState {
  products: Array<IProduct> | null
  productDetails: IProduct | null
  currentPage: number
  totalPages: number
  isLoading: boolean
  isSuccess: boolean
  error: string
}

const initialState: IUserState = {
  products: null,
  productDetails: null,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isSuccess: false,
  error: '',
}

export const getProducts = createAsyncThunk<IGetProductsResponse, { keyword: string; pageNumber: number }>(
  'product/getProducts',
  async function ({ keyword = '', pageNumber = 1 }, { rejectWithValue }) {
    try {
      let data
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (keyword && !pageNumber) {
        data = await axios.get(`/api/products?keyword=${keyword}`, config)
        return data.data
      } else if (pageNumber && !keyword) {
        data = await axios.get(`/api/products?pageNumber=${pageNumber}`, config)
        return data.data
      } else if (keyword && pageNumber) {
        data = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`, config)
        return data.data
      }

      data = await axios.get(`/api/products/all`, config)
      return data.data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      return rejectWithValue(errorMessage)
    }
  },
)

export const getProductById = createAsyncThunk<IProduct, string>(
  'product/getProductById',
  async function (id, { rejectWithValue }) {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      return rejectWithValue(errorMessage)
    }
  },
)

export const createProductReview = createAsyncThunk<void, IReviewFormData>(
  'product/createProductReview',
  async function (review, { rejectWithValue, dispatch }) {
    try {
      const { productId, comment, rating } = review
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }

      await axios.post(`/api/products/${productId}/review`, { comment, rating }, config)

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

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: {
    [getProducts.fulfilled.type]: (state, action: PayloadAction<IGetProductsResponse>) => {
      state.isLoading = false
      state.error = ''
      state.products = action.payload.products
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages
    },
    [getProducts.pending.type]: (state) => {
      state.isLoading = true
    },
    [getProducts.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [getProductById.fulfilled.type]: (state, action: PayloadAction<IProduct>) => {
      state.isLoading = false
      state.error = ''
      state.productDetails = action.payload
    },
    [getProductById.pending.type]: (state) => {
      state.isLoading = true
    },
    [getProductById.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [createProductReview.fulfilled.type]: (state) => {
      state.isLoading = false
      state.error = ''
      state.isSuccess = true
    },
    [createProductReview.pending.type]: (state) => {
      state.isLoading = true
      state.isSuccess = false
    },
    [createProductReview.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export default productSlice.reducer
