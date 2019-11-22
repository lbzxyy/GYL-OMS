import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Header from '../../components/Header/header';

import './entrance.scss';

class Entrance extends Component {
  render () {
    return (
      <div className={this.props.location.pathname === '/entrance/login' ? 'entrance-cont login' : 'entrance-cont find-password'}>
        <Header />
        {this.props.children}
      </div>
    )
  }
}

// 使用withRouter获取this.props.location
export default withRouter(Entrance)
