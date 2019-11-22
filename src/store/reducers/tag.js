/*
 * @Author: 李步钻 
 * @Date: 2019-10-26 14:08:09 
 * @Last Modified by:   李步钻 
 * @Last Modified time: 2019-10-23 14:08:09 
 */
const TagState = {
  pathname: '',
  tagList: [] 
}

export default  (state = TagState, action) => {
  let isReapt = action.type === 'ADD_TAGLIST'?state.tagList.some(v=> v.key === action.tag.key):false
  switch(action.type) {
    case 'SET_PATHNAME':
      return {
        ...state,
        pathname: action.pathname
      }
    case 'ADD_TAGLIST':
      return {
        ...state,
        tagList: isReapt?[...state.tagList]:[...state.tagList,action.tag]
      }
    case 'DELETE_TAG':
      return {
        ...state,
        tagList: [...state.tagList.filter( tag => tag.key !== action.tag)]
      }
    case 'CLEAR_ALL': 
      return {
        ...state,
        tagList: []
      }
    default:
      return state
  }
  
}