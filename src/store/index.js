/*
 * @Author: 李步钻 
 * @Date: 2019-10-16 14:07:31 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-05 15:24:56
 */
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducers)

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);
const store = createStore(persistedReducer, enhancer);

export const persistor = persistStore(store)

export default store;