import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Select } from 'antd';

import './header.scss'

const { Option } = Select;

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLogin: false,
      locale: localStorage.getItem('locale') || 'zh'
    }
    this.props.history.listen(route => {
      this.setState({
        showLogin: route.pathname.indexOf('/login') <= -1
      })
    })
  }

  handleChange = val => {
    // 语言切换
    this.setState(() => {
      return {
        locale: val
      }
    })
    localStorage.setItem('locale', val)
    window.location.reload()
  }

  componentDidMount () {
    this.setState({
      showLogin: this.props.location.pathname.indexOf('/login') <= -1
    })
  }

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  render () {
    return (
      <div className="bf headerContent">
        <div className="logo-cont">
          <i className="iconfont icon-xinLOGO"></i>
          <span>{window.intl.get('Header.brand')}</span>
        </div>
        <div className='login-lang'>
          {
            this.state.showLogin && (
              <Link className='mr-30' to='/entrance/login'>{window.intl.get('entrance.backLogin')}</Link>
            )
          }
          <Select defaultValue={this.state.locale} value={this.state.locale} onChange={this.handleChange}>
            <Option value="zh">中文</Option>
            <Option value="en">English</Option>
          </Select>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
