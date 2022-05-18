import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  IUser,
  ILoginFormData,
  IRegisterFormData,
  IUpdateProfileFormData,
} from '../../../Models/UserTypes'
import { getToken } from '../../../helpers/getToken'
import { logout } from './userSlice'

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

      localStorage.setItem('user', JSON.stringify(data.data))
      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message

      return rejectWithValue(errorMessage)
    }
  },
)

export const getUserProfile = createAsyncThunk<IUser, { userId: string }>(
  'user/getUserProfile',
  async function (userId, { rejectWithValue, dispatch }) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }

      const { data } = await axios.get(`/api/users/${userId}`, config)
      return data
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message ? error.response.data.message : error.message
      if (errorMessage === 'Not authorized, token failed') {
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
        dispatch(logout())
      }

      return rejectWithValue(message)
    }
  },
)
