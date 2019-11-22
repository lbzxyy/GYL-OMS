import React, { Component } from 'react'
import { Form, Input, Button, message, Spin } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { login } from '../../api/Entrance'
import md5 from 'md5'

// import './entrance.scss'

class NormalLoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLoading: false
    }
  }

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        values['passWord'] = md5(values['passWord'])
        let sendData = Object.assign({}, values, { type: 4 })
        this.setState(() => {
          return {
            showLoading: true
          }
        })
        const { data = {}, errorCode } = await login(sendData)
        this.setState(() => {
          return {
            showLoading: false
          }
        })
        if (errorCode === '100200') {
          message.success('登录成功')
          localStorage.setItem('token', data.token)
          localStorage.setItem('accountData', JSON.stringify(data))
          localStorage.setItem('platformType', 4)
          this.props.history.push('/')
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-form-cont">
        <Spin size='large' spinning={this.state.showLoading}></Spin>
        <div className="tc rect-cont">{window.intl.get('entrance.userLogin')}</div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                allowClear
                placeholder={window.intl.get('placeholder.inputUsername')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('passWord', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                allowClear
                type="password"
                placeholder={window.intl.get('placeholder.inputUsername')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" className="login-form-button">
              {window.intl.get('entrance.login')}
            </Button>
          </Form.Item>
          <Form.Item className="tr">
            <Link to='/entrance/findPassword' className='forget-link'>{window.intl.get('entrance.forgetPassword')}？</Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(Form.create({ name: 'normal_login' })(NormalLoginForm))
