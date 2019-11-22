/*
 * @Author: 李步钻 
 * @Date: 2019-09-19 17:56:36 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-31 17:10:21
 */

 import axios from '../common/axiosHttp';
//  import qs from 'qs';

// 获取供应链公司详情
export const gerCompanyDetail = params => {
   return axios('/user/supply/chain/get', { params })
}

// 获取国家地区列表
export const getCountries = () => {
   return axios('/user/area/code/getCountry?level=1&parentId=0')
}

// 添加收款方式
export const addPayment = (params) => {
   return axios.post('/finance/supply/bank/add', params)
}
// 编辑收款方式
export const editPayment = (params) => {
   return axios.post('/finance/supply/bank/update-SupplyReceiptChannel', params)
}
// 查询供应链收款方式
export const getPaymentData = (id) => {
   return axios.post(`/finance/supply/bank/select-SupplyReceiptChannel?supplyId=${id}`)
}