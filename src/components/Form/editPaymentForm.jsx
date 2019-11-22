/*
 * @Author: 李步钻 
 * @Date: 2019-10-24 17:39:15 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-12 10:54:46
 */
import React from 'react';

import { Form, Input, Radio, Checkbox, Row, Col,} from 'antd';

class editPaymentForm extends React.Component {
  
 constructor(props) {
   super(props)

   this.state = {
     paymentShow: true, // 服务单选
     isOnline: false, // 选中线上充值
     isTransfer: false, // 选中银行转账
   }
 }
// 单选
 handelChange = (e) => {
  // const { setFieldsValue } = this.props.form
  if(e.target.value === '其它地区') {
    this.setState({
      paymentShow: false,
    },()=>{
      this.props.form.setFieldsValue({'receiptTypeArr':[]})
    })
  }else{
    this.setState({
      paymentShow: true,
    },()=>{
      this.props.form.setFieldsValue({'receiptTypeArr':[]})
    })
  }
 }
// 多选
handelCheckbox = (checkedValues) => {
  if(checkedValues.includes('线上')){
    this.setState({
      isOnline: true
    })
  }else{
    this.setState({
      isOnline: false
    })
  }

  if(checkedValues.includes('银行转账')){
    this.setState({
      isTransfer: true
    })
  }else{
    this.setState({
      isTransfer: false
    })
  }
  

}
componentDidMount() {
  const { payment } = this.props;
  payment.receiptTypeArr = payment.receiptType.split(',')
  payment.channelArr = payment.channel.split(',')
  if(payment && payment.receiptTypeArr.includes('线上')) { // 回显收款渠道
    this.setState({
      isOnline: true,
      paymentShow: true
    })
  }
  if((payment && payment.receiptTypeArr.includes('银行转账')) && (payment && payment.region === '中国大陆')){ // 回显第一种输入框
    this.setState({
      isTransfer: true,
      paymentShow: true
    })
  }
  if((payment && payment.receiptTypeArr.includes('银行转账')) && (payment && payment.region === '其它地区')){ // 回显第二种输入框
    this.setState({
      isTransfer: true,
      paymentShow: false
    })
  }
}


componentWillReceiveProps(nextProps) {
  // 取消关闭弹窗 重置初始化
  if(!nextProps.visible) {
    this.setState({
      paymentShow: true
    })
  }
  
}
  render() {
    const { payment } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
    };
    return (
      
      <div>
        <Form {...formItemLayout} labelAlign="left">
          <Form.Item  label={window.intl.get('SystemSetup.service')}>
            {getFieldDecorator('region', {
              initialValue: `${payment&&payment.region?payment.region:'中国大陆'}`,
              rules: [
                {
                  required: true,
                  message: `${window.intl.get('SystemSetup.pleaseSelect')}`,
                },
              ],
            })(
              <Radio.Group onChange={ this.handelChange }>
              <Radio value="中国大陆">{window.intl.get('SystemSetup.ChineseMainland')}</Radio>
              <Radio value="其它地区">{window.intl.get('SystemSetup.OtherArea')}</Radio>
            </Radio.Group>,
            )}
          </Form.Item>
         <Form.Item label={window.intl.get('Menu.paymentMethod')}>
            {getFieldDecorator('receiptTypeArr', {
              initialValue: payment&&payment.receiptType?payment.receiptType.split(','):[],
              rules: [
                {
                  required: true,
                  message: `${window.intl.get('SystemSetup.pleaseSelect')}`,
                },
              ],
            })(
              <Checkbox.Group style={{ width: '100%' }} onChange={ this.handelCheckbox }>
                {
                  this.state.paymentShow && <Row>
                     <Col span={10}>
                      <Checkbox value="线上">{window.intl.get('SystemSetup.OnlineTopup')}</Checkbox>
                    </Col>
                    <Col span={10}>
                    <Checkbox value="银行转账" >
                      {window.intl.get('SystemSetup.BankTransfer')}
                    </Checkbox>
                  </Col>
                  </Row>
                }
                 {
                 
                  !this.state.paymentShow && <Row>
                    <Col span={10}>
                    <Checkbox value="银行转账" >
                      {window.intl.get('SystemSetup.BankTransfer')}
                    </Checkbox>
                  </Col>
                  </Row>
                }
              </Checkbox.Group>,
            )}
          </Form.Item>
          
         
          {
            this.state.isOnline && this.state.paymentShow && <Form.Item label={window.intl.get('SystemSetup.channels')}>
            {getFieldDecorator('channelArr', {
              initialValue: payment&&payment.channel?payment.channel.split(','):[],
              rules: [
                {
                  required: true,
                  message: `${window.intl.get('SystemSetup.pleaseSelect')}`,
                },
              ],
            })(
              <Checkbox.Group style={{ width: '100%' }} >
                <Row>
                  <Col span={8}>
                    <Checkbox value="支付宝">{window.intl.get('SystemSetup.Alipay')}</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="微信">
                    {window.intl.get('SystemSetup.WeChat')}
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>,
            )}
          </Form.Item>
          }
          
          {
            this.state.isTransfer && <Form.Item label={window.intl.get('SystemSetup.accountName')}>
            {getFieldDecorator('openName', {
              initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.openName:''}`,
               rules: [
                {
                  required: true,
                  message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
                },
              ],
            })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
           </Form.Item>
          }
          


        {
          this.state.isTransfer && this.state.paymentShow && <div>
             <Form.Item label={window.intl.get('SystemSetup.bank')}>
          {getFieldDecorator('bankName', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.bankName:''}`,
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
              },
            ],
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.openBank')}>
          {getFieldDecorator('openAddress', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.openAddress:''}`,
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
              },
            ],
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item> 
        <Form.Item label={window.intl.get('SystemSetup.accountNumber')}>
          {getFieldDecorator('cardNo', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.cardNo:''}`,
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
              },
            ],
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
          </div>
        }
       
        {
          !this.state.paymentShow && this.state.isTransfer && <div>
          <Form.Item label="SWIFT">
          {getFieldDecorator('swiftCode', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.swiftCode:''}`,
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
              },
            ],
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.collectingBank')}>
          {getFieldDecorator('receiptBankName', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.receiptBankName:''}`,
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
              },
            ],
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.businessAccount')}>
          {getFieldDecorator('busCardNo', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.busCardNo:''}`,
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseEnter')}`,
              },
            ],
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.receivingBankAddress') + '1'}>
          {getFieldDecorator('receiptBankAddress1', {
           initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.receiptBankAddress1:''}`,
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.receivingBankAddress') + '2'}>
          {getFieldDecorator('receiptBankAddress2', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.receiptBankAddress2:''}`,
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.beneficiaryBankAddress') + '3'}>
          {getFieldDecorator('benefitBankAddress3', {
            initialValue: `${payment&&payment.bankcardInfo?payment.bankcardInfo.benefitBankAddress3:''}`,
          })(<Input placeholder={window.intl.get('SystemSetup.pleaseEnter')}/>)}
        </Form.Item>
        <Form.Item label={window.intl.get('SystemSetup.currency')}>
          {getFieldDecorator('currencyArr', {
            initialValue: payment.bankcardInfo&&payment.bankcardInfo.currency?payment.bankcardInfo.currency.split(','):[],
            rules: [
              {
                required: true,
                message: `${window.intl.get('SystemSetup.pleaseSelect')}`,
              },
            ],
          })(
            <Checkbox.Group style={{ width: '100%' }} >
            <Row>
              <Col span={8}>
                <Checkbox value="USD" >
                  {window.intl.get('SystemSetup.US')}
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>,
          )}
        </Form.Item>
          </div>
        }


        </Form>
       
      </div>
    );
  }
}
export default  Form.create({ name: 'editPaymentForm' })(editPaymentForm);
