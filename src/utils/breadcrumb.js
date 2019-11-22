/*
 * @Author: 李步钻 
 * @Date: 2019-09-26 16:35:40 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-09-26 18:00:43
 */

/**
 * 
 * @param {*} menus 菜单数据
 * @param {*} path 当前的url
 */
export function findPathItem (menus, path) {
    let  temp = {}
    let forFn = function (menus, path) {
      for (let i = 0; i < menus.length; i++) {
        let item = menus[i]
        if (item.key === path) {
          temp = item
          break
        } else {
          if (item.subs) {
            forFn(item.subs, path)
          }
        }
      }
    }
    forFn(menus, path)
    return temp
}
