/*
 * @Author: 李步钻 
 * @Date: 2019-09-19 17:56:36 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-07 17:13:38
 */

 import axios from '../common/axiosHttp';
 import qs from 'qs';

// 获取供应商列表数据
 export function getSupplyList(params) {
    return axios.post(`/user/user/supplier/getSupplyPage`, qs.stringify(params)  )
 }
 // 获取供应商列表数据
 export function getSupplyAccount() {
   return axios.post(`/user/user/supplier/getTopUser` )
}
 
 // 获取卖家列表数据
 export function getSellerList(params) {
   return axios.post(`/user/seller/user/getSupplyPage`, qs.stringify(params)  )
}
 // 获取卖家账号数据 1:有效用户 2:审核中 3:审核失败 4:禁用 0:待激活
 export function getSellerAccount() {
   return axios.post(`/user/seller/user/getTopUser?type=1`, qs.stringify()  )
}
// 供应商查看 
export function getSupplierById(params) {
   return axios.get(`/user/user/supplier/getById`, { params })
}
// 卖家查看 
export function getSellerById(params) {
   return axios.get(`/user/seller/user/getById`, { params })
}
// 获取国家数据
export function getCountry(params) {
   return axios.get(`/user/area/code/getCountry`, { params })
}
// 商品种类
export function getCategoryList(params) {
   return axios.get(`/commodity/operate/category/list`, { params })
}
