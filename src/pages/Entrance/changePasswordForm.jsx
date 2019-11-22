import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { changePassword } from '../../api/Entrance'
import md5 from 'md5'

// import './entrance.scss'

class NormalLoginForm extends Component {
  constructor(props) {
    super(props)
    this.phoneReg = /^[1]([3-9])[0-9]{9}$/
    this.emailReg = /^[\w.-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (values['newPassword'] !== values['passwordConfirm']) {
          return message.error('两次密码不同')
        }
        let sendData = {
          newPassword: md5(values['newPassword'].trim()),
          oldPassword: md5(values['oldPassword'].trim())
        }
        const { errorCode } = await changePassword(sendData)
        if (errorCode === '100200') {
          message.success('修改密码成功')
          this.props.history.push('/')
        }
      }
    });
  };

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  handleCancel () {
    if (window.location.pathname === '/entrance/changePassword') {
      window.history.back()
    } else {
      window.location.href = '/entrance/login'
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="bf find-password-cont">
        <div className="tc rect-cont">{window.intl.get('entrance.changePassword')}</div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item help=''>
            {getFieldDecorator('oldPassword', {
              rules: [{ required: true }],
            })(
              <Input
                allowClear
                type='password'
                placeholder={window.intl.get('placeholder.inputOldPassword')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('newPassword', {
              rules: [{
                validator: async (rule, value, cb) => {
                  let errorBool = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)
                  this.newPassword = value
                  if (!errorBool) {
                    throw new Error('密码必须在6~16位包含字母及数字，区分大小写')
                  } else {
                    cb()
                  }
                }
              }],
            })(
              <Input
                allowClear
                type="password"
                placeholder={window.intl.get('placeholder.inputNewPassword')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('passwordConfirm', {
              rules: [{
                validator: async (rule, value, cb) => {
                  let errorBool = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)
                  if (!errorBool) {
                    throw new Error('密码必须在6~16位包含字母及数字，区分大小写')
                  } else if (value !== this.newPassword) {
                    throw new Error('两次输入密码不一致')
                  } else {
                    cb()
                  }
                }
              }],
            })(
              <Input
                allowClear
                type="password"
                placeholder={window.intl.get('placeholder.confirmNewPassword')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" className="login-form-button">
              {window.intl.get('entrance.save')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" block htmlType="submit" className="login-form-button">
              <Link to="" onClick={this.handleCancel}>{window.intl.get('entrance.cancel')}</Link>
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(Form.create({ name: 'normal_login' })(NormalLoginForm))
