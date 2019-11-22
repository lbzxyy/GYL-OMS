import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { sendCode, resetPassword } from '../../api/Entrance'
import md5 from 'md5'

// import './entrance.scss'

class NormalLoginForm extends Component {
  constructor (props) {
    super(props)
    this.phoneReg = /^[1]([3-9])[0-9]{9}$/
    this.emailReg = /^[\w.-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
    this.state = {
      countDown: 0
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let usernameData = this.getPhoneOrEmailByUsername()
        if (!usernameData) return
        if (values['passWord'] !== values['passwordConfirm']) {
          return message.error('两次密码不同')
        }
        let sendData = {
          code: values['code'],
          passWord: md5(values['passWord'].trim())
        }
        sendData = Object.assign({}, sendData, usernameData)
        const { errorCode } = await resetPassword(sendData)
        if (errorCode === '100200') {
          message.success('修改密码成功')
          this.props.history.push('/')
        }
      }
    });
  };

  sendCode = () => {
    let username = this.props.form.getFieldValue('username')
    if (!this.phoneReg.test(username) && !this.emailReg.test(username)) {
      return message.error('请输入正确的用户名')
    }
    let countDown = 120
    this.setState({ countDown })
    this.sendCodeServer()
    let timer = setInterval(() => {
      if (!countDown) {
        clearInterval(timer)
      } else {
        this.setState({
          countDown: --countDown
        })
      }
    }, 1000);
  }

  // 发送验证码服务
  sendCodeServer = async () => {
    let paramsData = {
      type: '15' // 固定值15
    }
    let usernameData = this.getPhoneOrEmailByUsername()
    if (!usernameData) return
    paramsData = Object.assign({}, paramsData, usernameData)
    const { errorCode } = await sendCode(paramsData)
    if (errorCode === '100200') {
      message.success('验证码发送成功')
    }
  }

  // 根据用户名判断是手机还是邮箱
  getPhoneOrEmailByUsername () {
    let form = this.props.form
    let username = form.getFieldValue('username') || ''
    if (!this.phoneReg.test(username) && !this.emailReg.test(username)) {
      message.error('请输入正确的手机号或邮箱')
      return null
    } else if (this.phoneReg.test(username)) {
      return { phone: username }
      // paramsData = Object.assign({}, paramsData, { phone })
    } else if (this.emailReg.test(username)) {
      return { email: username }
      // paramsData = Object.assign({}, paramsData, { email })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="find-password-cont">
        <div className="tc rect-cont">{window.intl.get('entrance.findPassword')}</div>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item help=''>
            {getFieldDecorator('username', {
              rules: [{ required: true }],
            })(
              <Input
                allowClear
                placeholder={window.intl.get('placeholder.inputPhoneOrMail')}
              />,
            )}
          </Form.Item>
          <Form.Item className='code-item' help=''>
            {getFieldDecorator('code', {
              rules: [{ required: true }],
            })(
              <Input
                allowClear
                type="password"
                placeholder={window.intl.get('placeholder.inputAuthCode')}
              />,
            )}
            <Button
              className={this.state.countDown ? 'dis ml-15' : 'ml-15'}
              onClick={this.sendCode}>
              {this.state.countDown ? this.state.countDown + 's ' + window.intl.get('entrance.getAgain') : window.intl.get('entrance.getAuthCode')}
            </Button>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('passWord', {
              rules: [{
                validator: async (rule, value, cb) => {
                  let errorBool = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)
                  this.passWord = value
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
                placeholder={window.intl.get('placeholder.inputPasswordWithRule')}
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
                  } else if (value !== this.passWord) {
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
                placeholder={window.intl.get('placeholder.confirmPassword')}
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" className="login-form-button">
              {window.intl.get('entrance.changeNow')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" block htmlType="submit" className="login-form-button">
              <Link to='/entrance/login'>{window.intl.get('entrance.loginNow')}</Link>
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(Form.create({ name: 'normal_login' })(NormalLoginForm))
