import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { reduxBatch } from '@manaflair/redux-batch'
import { persistStore } from 'redux-persist'
import { rootReducer, rootSaga } from '@/store/rootReducer'

const sagaMiddleware = createSagaMiddleware()
// 中间件
const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  }),
  sagaMiddleware,
]

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [reduxBatch],
})

export const persistor = persistStore(store as any)

sagaMiddleware.run(rootSaga)

export default store
