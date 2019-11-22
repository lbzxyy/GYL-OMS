/*
 * @Author: 李步钻 
 * @Date: 2019-09-20 17:55:23 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-06 15:13:30
 */
import React from 'react';
import './index.scss';
import Tag from '../Tag/tag';
import {connect} from 'react-redux';
import { setPathname, addTaglist } from '../../store/actions/tag';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Select, message, Dropdown, Avatar, Icon } from 'antd';
import { menus, others } from '../../router/menu.js';
import { findPathItem } from '../../utils/breadcrumb';
import { clearAll } from '../../store/actions/tag';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Option } = Select;
class LayoutPage extends React.Component {
    constructor (props) {
      super(props)
      let accountData = {}
      try {
        accountData = JSON.parse(localStorage.accountData)
      } catch (error) { }
      if (!accountData['user']) {
        this.props.history.push('/entrance/login')
        return
      }
      let username = accountData['user']['user']['username']
      let menuItem = findPathItem([...menus,...others],this.props.location.pathname)
      this.state = {
        username,
        locale: localStorage.getItem('locale') || 'zh',
        selectedKeys: [this.props.location.pathname.replace('/details', '')],
        breadcrumbs: menuItem.breadcrumbs || [], // 面包屑数据
        openKeys: [],
      }
      this.props.history.listen((route) => { // 监听路由
        const { addTaglist, setPathname } = this.props;
        addTaglist(route.pathname,route); // 添加标签
        setPathname(route.pathname); // 当前pathname

        let menuItem = findPathItem([...menus, ...others], route.pathname)
        this.setState(() => {
          return {
            breadcrumbs: menuItem.breadcrumbs || [],
            selectedKeys: [route.pathname]
          }
        })
      })
    }
    //切换中英文
    handleChangeLang = (val) => {
      this.setState(()=>{
        return {
          locale: val
        }
      })
      localStorage.setItem('locale', val)
      window.location.reload()
    }
    // 点击菜单栏
    onOpenChange = openKeys => {
      let rootSubmenuKeys = []
      menus.forEach( item => {
        rootSubmenuKeys.push(item.key) 
      })
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }
    componentDidMount() {
      const { addTaglist, setPathname } = this.props;
      const pathname = this.props.location.pathname
      addTaglist(pathname); // 添加标签
      setPathname(pathname); // 当前pathname
    }

    componentWillUnmount () {
      this.setState = () => {
        return
      }
    }

    // 退出登录不调接口
    logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('accountData')
      localStorage.removeItem('platformType')
      this.props.clearAll()
      message.success('退出登录成功')
      this.props.history.push('/entrance/login')
    }

    render() {
      const { pathname } = this.props; 
        const menu = (
          <Menu>
            <Menu.Item>
              <Link to='/entrance/changePassword'>{window.intl.get('Header.changePassword')}</Link>
            </Menu.Item>
            <Menu.Item>
            <span onClick={this.logout} className='mr-20' style={{ 'cursor': 'pointer' }}>{window.intl.get('Header.logout')}</span>
            </Menu.Item>
          </Menu>
        )

        return (
          <Layout style={{height: '100%'}} className='main-wrap'>
            <Header className="header">
              <div className="logo">
                <div className="project-name">  <i className="iconfont icon-xinLOGO"></i> {window.intl.get('Header.brand')}</div>
              </div>
              <div className="loginChange">
                {/* <Link to='/entrance/login' className='mr-20'>登录</Link> */}
                <Dropdown overlay={menu} className='mr-50'>
                  <div className='user-cont'>
                    <Avatar size={32} icon="user" />
                    <span className='ml-10 mr-10'>{this.state.username}</span>
                    <Icon type="caret-down" />
                  </div>
                </Dropdown>
                <Select defaultValue={ this.state.locale } value={ this.state.locale } onChange={this.handleChangeLang}>
                  <Option value="zh">中文</Option>
                  <Option value="en">English</Option>
                </Select>
              </div>
            </Header>
            <Layout >
              <Sider width={200} className='sideNav' style={{ background: '#fff',overflow: 'scroll', }}>
                <Menu
                  mode="inline"
                  selectedKeys={[pathname.replace('/details', '')]}
                  openKeys={this.state.openKeys}
                  onOpenChange={this.onOpenChange}
                  defaultSelectedKeys={this.state.selectedKeys}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  {
                    menus.map( item => {
                      if(item.subs && item.subs.length>0) {
                        return (
                          <SubMenu key={item.key} title={
                            <span>
                              <i className={item.icon}></i>
                              {window.intl.get(`Menu.${item.title}`)}
                            </span>
                          }>
                          {
                            item.subs.map(val => {
                              return <Menu.Item key={val.key}><Link to={val.key}><i className={val.icon}></i>{window.intl.get(`Menu.${val.title}`)}</Link></Menu.Item>
                            })
                          }
                          </SubMenu>
                        )
                      }else{
                        return <Menu.Item key={item.key}> <Link to={item.key}><i className={item.icon}></i>{window.intl.get(`Menu.${item.title}`)}</Link></Menu.Item>
                      }
                    })
                  }
                </Menu>
              </Sider>
               {/* <Layout className={this.state.breadcrumbs.length > 1 ? 'content-wrap' : 'no-padding content-wrap'}> */}
               <Layout className='no-padding content-wrap'>
                 <Tag {...this.props}/>
                <Content className='bf data-wrap'>
                    { this.props.children }
                </Content>
              </Layout> 
            </Layout>
          </Layout>
        );
    }
}
const mapStateToProps = (state) => ({
  tagList: state.Tag.tagList,
  pathname: state.Tag.pathname
});
const mapDispatchToProps = (dispatch) => ({
  addTaglist: (playload,route) =>{
    dispatch(addTaglist(playload,route))
  },
  setPathname: (playload) => {
    dispatch(setPathname(playload))
  },
  clearAll: (playload) => {
    dispatch(clearAll(playload))
  }  
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LayoutPage))

