import { configureStore, combineReducers,  } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import productReducer from './reducers/productSlice'
import orderReducer from './reducers/orderSlice'

const rootReducer = combineReducers({
  userReducer,
  productReducer,
  orderReducer
})

export const store = configureStore({
    reducer: rootReducer
  })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch