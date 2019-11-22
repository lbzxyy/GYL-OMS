import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store/index';
import 'moment/locale/zh-cn';
import './assets/css/MarginPaddingMixin.scss'
import 'antd/dist/antd.css';
import './assets/css/index.scss';
import './assets/icon/iconfont.css';
import App from './App';

ReactDOM.render(
    <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
             <App />
        </PersistGate>
    </Provider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
