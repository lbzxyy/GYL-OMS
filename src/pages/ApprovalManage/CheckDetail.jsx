import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { approvalCheckDetail, checkApply } from '../../api/ApprovalManage'
import { Form, Input, Modal, Button, message } from 'antd';
import moment from 'moment';
import Big from 'big.js';
import utils from '../../utils/commonUtils'

import './Approval.scss';

const { getQueryByLocation } = utils

// const InputGroup = Input.Group;
// const { Search } = Input;
// const { Option } = Select;

// const { MonthPicker } = DatePicker

const platformTypeArr = [ 'Other', 'eBay', 'Amazon', 'Aliexpress' ]

class Entrance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      showLoading: false,
      applyType: 0,
      total: null,
      checkList: []
    }
  }

  UNSAFE_componentWillMount () {
    this.getCheckList()
    let accountData = {}
    try {
      accountData = JSON.parse(localStorage.accountData)
    } catch (error) {}
    this.setState({
      defaultOperater: accountData.user.user.username
    })
  }

  async getCheckList () {
    const { data = {} } = await approvalCheckDetail({
      pageNum: 1,
      pageSize: 999,
      examineStatus: 'Applying',
      userId: getQueryByLocation('id'),
      userType: 'Seller'
    })
    // eslint-disable-next-line
    let { list = [], total = 0 } = data
    this.setState({
      checkList: list,
      total
    })
  }

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  showModal = (type, applyId, shopAmount) => {
    this.setState({
      applyType: type,
      applyId,
      shopAmount,
      modalVisible: true
    })
  }

  handleCancel = e => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  };

  handleConfirm = () => {
    this.props.form.validateFields(async (err, values) => {
      console.log(err, values)
      if (!err) {
        console.log('Received values of form: ', values);
        let postData = {
          applyId: this.state.applyId,
          applyStatus: this.state.applyType ? 'Access' : 'Refuse',
          operator: values.operator,
          accessAmount: values.accessAmount
        }
        console.log(postData)
        const { errorCode } = await checkApply(postData)
        if (errorCode === '100200') {
          message.success('操作成功')
          this.setState({
            modalVisible: false
          })
          this.getCheckList()
        }
      }
    });
  }

  getStatusStr (status) {
    let text = ''
    switch (status) {
      case 'Applying':
        text = window.intl.get('creditApprovalList.applying')
        break;
      case 'Access':
        text = window.intl.get('creditApprovalList.access')
        break;
      case 'Refuse':
        text = window.intl.get('creditApprovalList.refuse')
        break;
      default:
        text = status
        break;
    }
    return text
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <div className='check-cont'>
        {/* <Spin size='large' spinning={this.state.showLoading}></Spin> */}
        <div className="header">
          <div className="title">{window.intl.get('approvalCheckDetail.title')}</div>
        </div>
        {
          this.state.checkList.map((item, index) => (
            <div className="mt-20 mb-20 ml-40 mr-40 check-item" key={index}>
              <div className="check-title">
                <span>{window.intl.get('approvalCheckDetail.check') + (index + 1)}</span>
                <div>
                  <Button onClick={this.showModal.bind(this, 0, item.applyId)}>{window.intl.get('approvalCheckDetail.refuse')}</Button>
                  <Button type="primary" className="ml-15" onClick={this.showModal.bind(this, 1, item.applyId, item.accessAmount)}>{window.intl.get('approvalCheckDetail.access')}</Button>
                </div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.submitPerson')}：</div>
                <div className="value">{item.operater || '--'}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.sellerType')}：</div>
                <div className="value">{item.userType === 'Seller' ? window.intl.get(`creditApprovalTable.${item.userType.toLowerCase()}`) : ''}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.applyType')}：</div>
                <div className="value">{window.intl.get(`approvalDetail.${item.applyType.toLowerCase()}`)}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.applyStatus')}：</div>
                <div className="value">{this.getStatusStr(item.applyStatus)}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.totalAmount')}：</div>
                <div className="value">$ {Big(item.totalAmount || 0).toFixed(2)}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.usedAmount')}：</div>
                <div className="value">$ {Big(item.usedAmount || 0).toFixed(2)}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.availableAmount')}：</div>
                <div className="value">$ {Big(item.useableAmount || 0).toFixed(2)}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('approvalDetailTable.shopAmount')}：</div>
                <div className="value">$ {Big(item.accessAmount || 0).toFixed(2)}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('approvalDetailTable.platformType')}：</div>
                <div className="value">{platformTypeArr[~~item.platformType] || '--'}/{item.shopName || '--'}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('creditApprovalTable.submitTime')}：</div>
                <div className="value">{moment(item.createTime.time).format('YYYY-MM-DD HH:MM:SS')}</div>
              </div>
              <div className="item">
                <div className="label">{window.intl.get('approvalDetailTable.applyAmount')}：</div>
                <div className="value">$ {item.applyAmount}</div>
              </div>
            </div>
          ))
        }

        <Modal
          width={575}
          footer={null}
          destroyOnClose
          onCancel={this.handleCancel}
          visible={this.state.modalVisible}
          title={this.state.applyType
            ?
            window.intl.get('checkDialog.access')
            :
            window.intl.get('checkDialog.refuse')}
        >
          <Form {...formItemLayout}>
            {
              !!this.state.applyType && (
                <Form.Item label={window.intl.get('checkDialog.shopAmount') + "："}>
                  <div className="shopAmount">$ {this.state.shopAmount}</div>
                </Form.Item>
              )
            }
            {
              !!this.state.applyType && (
                <Form.Item label={window.intl.get('checkDialog.creditLimit') + "："}>
                  {getFieldDecorator('accessAmount', {
                    rules: [
                      {
                        required: true,
                        message: window.intl.get('checkDialog.inputMsg'),
                      },
                      {
                        validator (rule, value, cb) {
                          if (value <= 0 || value > 100000) {
                            cb(window.intl.get('checkDialog.limitTips'))
                          } else {
                            cb()
                          }
                        }
                      }
                    ],
                  })(
                    <div>
                      <Input />
                      <div style={{ "lineHeight": "1.8"}}>{window.intl.get('checkDialog.checkTips')}</div>
                    </div>
                    )}
                </Form.Item>
              )
            }
            {
              !this.state.applyType && (
                <Form.Item label={window.intl.get('checkDialog.refuseReason') + "："}>
                  {getFieldDecorator('remark', {
                    rules: [
                      {
                        required: true,
                        message: window.intl.get('checkDialog.refusePlaceholder'),
                      }
                    ]
                  })(<Input.TextArea placeholder={window.intl.get('checkDialog.refusePlaceholder')} />)}
                </Form.Item>
              )
            }
            <Form.Item label={window.intl.get('checkDialog.operator') + "："}>
              {getFieldDecorator('operator', {
                initialValue: this.state.defaultOperater
              })(<Input disabled />)}
            </Form.Item>
          </Form>
          <div className="pl-20 footer-cont">
            <Button onClick={this.handleCancel}>取消</Button>
            <Button type="primary" onClick={this.handleConfirm}>确定</Button>
          </div>
        </Modal>
      </div>
    )
  }
}

// 使用withRouter获取this.props.location
export default withRouter(Form.create()(Entrance))
