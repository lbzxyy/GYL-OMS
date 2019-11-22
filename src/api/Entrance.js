/*
 * @Author: 李步钻 
 * @Date: 2019-09-19 17:56:36 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-09-23 09:24:12
 */

 import axios from '../common/axiosHttp';
 import qs from 'qs';

// 获取供应商列表数据
export const login = data => {
   return axios.post(`/user/login/home`, qs.stringify(data))
}

// 退出登录不调接口
// export const logout = () => {
//    return axios.post('/user/loginOut')
// }

// 获取验证码
export const sendCode = params => {
   return axios('/user/seller/user/forget/sendMsg', { params })
}

// 修改密码（忘记密码时）
export const resetPassword = data => {
   return axios.post('/user/supply/chain/forget/checkMsg', qs.stringify(data))
}

// 更改密码
export const changePassword = data => {
   return axios.post('/user/supply/chain/updatePassword', qs.stringify(data))
}
