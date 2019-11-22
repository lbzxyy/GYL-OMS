/*
 * @Author: 李步钻 
 * @Date: 2019-09-19 17:55:42 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-15 17:29:44
 */

/**
 * axios封装
 * 
 */
import axios from 'axios';
import { message } from "antd";
// import { createBrowserHistory } from 'history';

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 跳转登录页
        case 401:
            break;
        case 403:
            message.error('权限不足，请联系管理员')
            break;
        case 404:
            message.error('请求的资源不存在')
            break;
        case 500:
            message.error('服务器异常，请稍后重试')
            break;
        default:
            console.log(other);
    }
}

// 创建axios实例
var instance = axios.create({
    timeout: 1000 * 60,
    baseURL: process.env.NODE_ENV === 'production'? 'https://gateway.brandslink.com:8443':'https://wg.brandslink.com:8443' // 环境地址
});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/** 
 * 请求拦截器 
 * 
 */
let loadingInstanceObj = {} // 所有loading实例数组
let CancelToken = axios.CancelToken
let source = CancelToken.source()
instance.interceptors.request.use(
    config => {
        config.cancelToken = source.token // 取消请求
        if(config.cancelToken && config.cancelObj && config.cancelObj.cancel) {
            config.cancelObj.cancel('中断请求');
            delete config.cancelObj;
        }
        if (!navigator.onLine) { // 断网提示
            source.cancel('网络故障，请检查!')
        }
        const token = localStorage.token || '5aa00880a4f8feadc20878e1b51c8cd2-PC-1569219608745';
        const i18n = localStorage.getItem("locale")?(localStorage.getItem("locale") === 'en'? 'en_us' : ''):(localStorage.getItem("defaultLng") === 'en'? 'en_us' : '');
        // console.log(i18n,'i18nvi18ni18ni18n')
        const platformType = '4';
        token && (config.headers.token = token)
        i18n && (config.headers.i18n = i18n);
        platformType && (config.headers.platformType = platformType)
        return config;
    },
    error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    res => {
        if (loadingInstanceObj[res.config['ts']]) {
            delete loadingInstanceObj[res.config['ts']]
        }
        if (!Object.keys(loadingInstanceObj).length) { // 解决请求"暂无数据"的显示问题
            // if (window.emptyDomArr && window.emptyDomArr.length) {
            //     for (let item of window.emptyDomArr) {
            //         console.log(item)
            //         item.innerHTML = '暂无数据'
            //     }
            // }
        }
        if (res.data.errorCode === "100406" || res.data.type === "application/json") {
            message.error(res.data.msg)
            setTimeout(() => {
                window.location.href = '/entrance/login'
                // createBrowserHistory().push('/login')
            }, 500);
        } else if (res.data.errorCode !== '100200' && res.data.errorCode !== '100501') { // res.data.errorCode == '100400' || res.data.errorCode == '100500'
            if (res.data.type !== "application/vnd.ms-excel" && res.data.type !== 'application/octet-stream'){  //导出excel的情况
                message.error(res.data.msg)
            }  
        }
        if (res.headers.token) {//保存token
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("platformType", res.data.platformType)
        }
        if (res.data.data === null) { // 解构默认值使用
            res.data.data = undefined
        }
        if (res.data.msg === undefined) { // 提示默认值
            res.data.msg = ''
        }
        return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res.data)
    },
    // 请求失败
    error => {
        // if (window.emptyDomArr && window.emptyDomArr.length) {
        //     for (let item of window.emptyDomArr) item.innerHTML = '暂无数据'
        // }
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理其他的情况
            if (error.message) { // 取消请求的message
                message.error(error.message)
            } else {
                message.error('服务故障，请检查！')
            }
            return Promise.resolve({}) // 解决业务解构报错
        }
    });

export default instance;
