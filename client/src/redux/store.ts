import { configureStore, combineReducers,  } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'

const rootReducer = combineReducers({
  userReducer
})

export const store = configureStore({
    reducer: rootReducer
  })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch