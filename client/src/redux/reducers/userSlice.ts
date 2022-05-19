import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  IUser,
  ILoginFormData,
  IRegisterFormData,
  IUpdateProfileFormData,
} from '../../Models/UserTypes'
import { getToken } from '../../helpers/getToken'
import { useAppDispatch } from '../../hooks/redux'

export interface IUserState {
  user: IUser | null
  userProfile: IUser | null
  isLoading: boolean
  isSuccess: boolean
  error: string
}

const initialState: IUserState = {
  user: null,
  userProfile: null,
  isLoading: false,
  isSuccess: false,
  error: '',
}

export const register = createAsyncThunk<IUser, IRegisterFormData>(
  'user/register',
  async function (registerFormData, { rejectWithValue }) {
    try {
      const { name, email, password } = registerFormData

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(`/api/users`, { name, email, password }, config)

      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      return rejectWithValue(errorMessage)
    }
  },
)

export const login = createAsyncThunk<IUser, ILoginFormData>(
  'user/login',
  async function (loginFormData, { rejectWithValue }) {
    try {
      const { email, password } = loginFormData

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(`/api/users/login`, { email, password }, config)

      localStorage.setItem('user', JSON.stringify(data))

      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      return rejectWithValue(errorMessage)
    }
  },
)

export const getUserProfile = createAsyncThunk<IUser, any>(
  'user/getUserProfile',
  async function (_, { rejectWithValue, dispatch }) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}1`,
        },
      }

      const { data } = await axios.get(`/api/users/profile`, config)

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

export const updateProfile = createAsyncThunk<IUser, IUpdateProfileFormData>(
  'user/updateProfile',
  async function (userDataForm, { rejectWithValue, dispatch }) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }

      const { data } = await axios.put(`/api/users/profile`, userDataForm, config)

      return data
    } catch (error) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      if (message === 'Not authorized, token failed') {
        localStorage.removeItem('user')
        dispatch(logout())
      }

      return rejectWithValue(message)
    }
  },
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
  extraReducers: {
    [login.fulfilled.type]: (state: IUserState, action: PayloadAction<IUser>) => {
      state.isLoading = false
      state.error = ''
      state.user = action.payload
    },
    [login.pending.type]: (state: IUserState) => {
      state.isLoading = true
    },
    [login.rejected.type]: (state: IUserState, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [register.fulfilled.type]: (state: IUserState, action: PayloadAction<IUser>) => {
      state.isLoading = false
      state.error = ''
      state.user = action.payload
    },
    [register.pending.type]: (state: IUserState) => {
      state.isLoading = true
    },
    [register.rejected.type]: (state: IUserState, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [getUserProfile.fulfilled.type]: (state: IUserState, action: PayloadAction<IUser>) => {
      state.isLoading = false
      state.error = ''
      state.userProfile = action.payload
    },
    [getUserProfile.pending.type]: (state: IUserState) => {
      state.isLoading = true
    },
    [getUserProfile.rejected.type]: (state: IUserState, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    [updateProfile.fulfilled.type]: (state: IUserState, action: PayloadAction<IUser>) => {
      state.isLoading = false
      state.error = ''
      state.user = action.payload
    },
    [updateProfile.pending.type]: (state: IUserState) => {
      state.isLoading = true
    },
    [updateProfile.rejected.type]: (state: IUserState, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const { setAuthUser, logout } = userSlice.actions

export default userSlice.reducer
