/*
 * @Author: 李步钻 
 * @Date: 2019-10-16 14:08:32 
 * @Last Modified by:   李步钻 
 * @Last Modified time: 2019-10-23 14:08:32 
 */
import * as actionType from './actionType';

import { routes } from '../../router/menu';

// 当前到pathname
const setPathname = playload => ({
  type: actionType.SET_PATHNAME,
  pathname: playload
})

// 添加标签页
const addTaglist = (playload,route) => async(dispatch, getState) => {
   function handleDispatch(data) {
     data.route = route; // 保存路由传参 防止丢失
     dispatch({
      type: actionType.ADD_TAGLIST,
      tag: data
     })
   }
 
   // ！！！！！！ 动态权限路由后，menus应该是动态回来的 届时使用递归方法 ！！！！！！！
  void function(){
    routes.forEach(ele=>{
    if(ele.key===playload) {
      handleDispatch(ele)
    }else if(ele.subs){
      ele.subs.forEach(ele2=>{
        if(ele2.key===playload){
          handleDispatch(ele2)
        }else if( ele2.subs){
          ele2.subs.forEach(ele3=>{
            if(ele3.key===playload){
              handleDispatch(ele3)
            }
          })
        }
      })
     }
    })
  }()
}
// 删除标签页
const deleteTag = playload =>({
  type: actionType.DELETE_TAG,
  tag: playload
})

// 清除所有标签页
const clearAll = playload =>({
  type: actionType.CLEAR_ALL
})

export {
  setPathname,
  addTaglist,
  deleteTag,
  clearAll
}