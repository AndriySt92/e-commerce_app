import { configureStore, combineReducers,  } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import productReducer from './reducers/productSlice'

const rootReducer = combineReducers({
  userReducer,
  productReducer

})

export const store = configureStore({
    reducer: rootReducer
  })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch