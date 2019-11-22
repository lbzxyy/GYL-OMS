/*
 * @Author: 李步钻 
 * @Date: 2019-09-19 17:56:36 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-31 17:10:21
 */

 import axios from '../common/axiosHttp';
 import qs from 'qs';

// 获取用户维度授信列表
export const getCreditApplyUserInfo = data => {
   return axios.post('/finance/creditApply/getCreditApplyUserInfo', qs.stringify(data))
}

// 获取店铺维度授信列表
export const getCreditApplyShopInfo = data => {
   return axios.post('/finance/creditApply/getCreditApplyShopInfo', qs.stringify(data))
}

// 已通过审批的店铺数量
export const getCountOfShop = data => {
   return axios.post('/finance/creditApply/getCountOfShop', qs.stringify(data))
}

// 金额信息
export const getShopTotalAmount = data => {
   return axios.post('/finance/creditApply/getTotalAmount', qs.stringify(data))
}

// 审核详情
export const approvalCheckDetail = data => {
   return axios.post('/finance/creditApply/query', qs.stringify(data))
}

// 审批
export const checkApply = data => {
   return axios.post('/finance/creditApply/examine', qs.stringify(data))
}

// 提交调额
export const changeLimit = data => {
   return axios.post('/finance/creditApply/adjust', qs.stringify(data))
}

// 调额查询总额度
export const getSellerCreditInfo = sellerId => {
   return axios.post('/finance/account/getSellerCreditInfo', qs.stringify({ sellerId }))
}

// 导出报表
// export const exportExcel = params => {
//    return axios('/finance/creditApply/getCreditApplyUserInfo/export', { params })
// }
