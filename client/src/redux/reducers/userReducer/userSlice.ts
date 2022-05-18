import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../../Models/UserTypes'
import { register, login, getUserProfile, updateProfile} from './Actions'

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