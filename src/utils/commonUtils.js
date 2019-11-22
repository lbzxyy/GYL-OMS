/*
 * @Author: 李步钻 
 * @Date: 2019-05-10 16:04:30 
 * @Last Modified by:   李步钻 
 * @Last Modified time: 2019-07-10 16:04:30 
 */
import moment from 'moment';
import axios from '../common/axiosHttp';
import Big from 'big.js'
// import _ from 'lodash';
// import base from '../api/base.js';
// import qs from 'qs';

const numFunc = num => isNaN(Number(num)) ? 0 : Number(num)

export default {
    //  转换时间格式
    /**
     * 
     * @param {*} date // 时间值
     * @param {*} type // 格式
     */
    format(date, type) {
        return moment(date).format(type);
    },
    // 导出方法
    /**
     * 
     * @param {*} type 请求的类型
     * @param {*} url 请求的接口地址
     * @param {*} params 请求的参数
     * @param {*} fileName 下载的文件名
     * @param {*} typeName 文件类型如 .xls .pdf....
     */
    export (type, url, params, fileName, typeName) {
        if (type === 'get') {
            return axios.get(url, { params, responseType: 'blob' }).then((res) => {
                this._handleDownload(res, fileName, typeName)
            })
        } else if (type === 'post') {
            return axios.post(url, params, { responseType: 'blob' }).then((res) => {
                this._handleDownload(res, fileName, typeName)
            })
        }
    },
        /**
     * mm转换为px
     * @param value
     * @returns {number}
     */
    mmConversionPx(value) {
        var inch = value/25.4;
        var c_value = inch*this._getDPI()[0];
        return c_value;
    },
     /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    pxConversionMm(value) {
        var inch = value/this.conversion_getDPI()[0];
        var c_value = inch * 25.4;
        return c_value;
    },
    /**
     * 过滤回显列表文本 
     * @param {*} arr 要过滤的数组
     * @param {*} key 后台回显的值，此方法只考虑是返回数字的情况
     */
    filters(arr,key) {
      if(!Array.isArray(arr)) return ''
      return arr[key-1] || ''
    },

    // =========== 子方法统一放下面 不对外调用 ===================
    _handleDownload(res, fileName, typeName) {
        const content = res
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName + typeName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
        } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
        }
    },
   /**
     * 获取DPI
     * @returns {Array}
     */
    _getDPI () {
        // eslint-disable-next-line
        var arrDPI = new Array;
        if (window.screen.deviceXDPI) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        } else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
    },

    // 从对象中过滤key值
    getCustomObjByKes (obj, keys) {
        let res = {}
        // eslint-disable-next-line
        for (let item of keys) {
            let arr = item.split('-')
            res[arr[arr.length - 1]] = obj[arr[0]] || ''
        }
        return res
    },

    getQueryByLocation(key) {
        let searchObj = window.location.search.replace('?', '')
        let res = {}
        if (!searchObj) return res
        let a = searchObj.split('&')
        // eslint-disable-next-line
        for (let item of a) {
            let b = item.split('=')
            res[b[0]] = b[1]
        }
        if (key) return res[key]
        return res
    },

    // 加法
    numAdd(num1, num2) {
        num1 = numFunc(num1)
        num2 = numFunc(num2)
        return Number(Big(num1).plus(num2))
    },

    // 减法
    numSub(num1, num2) {
        num1 = numFunc(num1)
        num2 = numFunc(num2)
        return Number(Big(num1).minus(num2))
    },

    // 乘法
    numMulti(num1, num2) {
        num1 = numFunc(num1)
        num2 = numFunc(num2)
        return Number(Big(num1).times(num2))
    },
    // console.log('测试乘法->', numMulti(10015.48988832, Math.pow(10, 8)))

    // 除法
    numDiv(num1, num2) { // 注意除法num2为0的情况
        num1 = numFunc(num1)
        num2 = numFunc(num2)
        if (!num2) {
            return 0
        }
        return Number(Big(num1).div(num2))
    }
}
