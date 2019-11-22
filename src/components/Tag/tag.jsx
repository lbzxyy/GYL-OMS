import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { deleteTag, clearAll } from '../../store/actions/tag';

import { Tabs,Icon } from 'antd';
const { TabPane } = Tabs;

class TagComponet extends React.Component {
 
  // 删除标签页
  onEdit = (item) => {
    const { tagList, deleteTag } = this.props;
    deleteTag(item);
    let index = this.findIndex(item)
    if(index===0&&tagList.length>1) {
      this.props.history.push(tagList[index+1].key)
    }else if(index===0&&tagList.length<=1){
      this.props.history.push('/')
    }else{
      this.props.history.push(tagList[index-1].key)
      
    }
  } 
  onChange = activeKey => {
    const { tagList } = this.props;
    let index = this.findIndex(activeKey)
    // 兼容详情页传参 
    this.props.history.push({pathname:activeKey,state: tagList[index].route?tagList[index].route.state:null})
  }

  // 清除所有标签
  clearAll = () => {
    this.props.clearAll()
    this.props.history.push('/')
  }

  findIndex = (tag) => {
    let i;
    this.props.tagList.forEach((item,index) => {
      if(item.key === tag) {
        i = index
      }
    })
    return i;
  }


  render() {
    const { tagList, pathname } = this.props;
    return(
      <div className="taglist" >
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={pathname}
          type="editable-card"
          onEdit={this.onEdit}
          tabBarGutter={0}
        >
          {tagList.map((item) => (
            <TabPane 
            tab={ window.intl.get(`Menu.${item.title}`)} 
            // closable={index!==0}
            key={item.key}>
            </TabPane>
          ))}
        </Tabs>
        <div className="clearAll" onClick={this.clearAll}><Icon type="close" /></div>
      </div>
    )
  }
} 
const mapStateToProps = (state) => ({
  tagList: state.Tag.tagList,
  pathname: state.Tag.pathname
});
const mapDispatchToProps = (dispatch) => ({
  deleteTag: (playload) => {
    dispatch(deleteTag(playload))
  },
  clearAll: (playload) => {
    dispatch(clearAll(playload))
  }
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TagComponet))
