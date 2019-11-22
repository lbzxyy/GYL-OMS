/*
 * @Author: 李步钻 
 * @Date: 2019-10-24 17:39:23 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-01 14:13:27
 */
import { Modal, Button , message} from 'antd';
import React from 'react';
import PaymentForm from '../Form/paymentForm';
import EditPaymentForm from '../Form/editPaymentForm';
import { addPayment, editPayment } from '../../api/SystemSetting';
export default class PaymentModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    },()=>{
      setTimeout(()=>{
        document.getElementsByClassName('ant-modal-body')[0].scrollTop  = 0;  // 滚动条回顶部
      })
    });
  };

  handleOk = () => {
    const { edit } = this.props;
    if(!edit) {
      this.add()
    }else{
      this.edit()
    }
   
  };
  // 添加
  add = () => {
    const { getPaymentData } = this.props;
    this.refs.paymentRef.validateFieldsAndScroll( async(err, values) => {
      if (!err) {
        if(this.state.confirmLoading) return;
        const params = this._handleParams(values)
        let {errorCode} =  await addPayment(params)
        if(errorCode === '100200') {
          await getPaymentData()
          message.success(`${window.intl.get('SystemSetup.addSuccessfully')}`)
          this.setState({
            confirmLoading: true,
          });
          setTimeout(() => {
            this.setState({
              visible: false,
              confirmLoading: false,
            });
          }, 1000);
        }
      }else{
        console.log(err);
      }
    });
  }
 // 编辑
 edit = () => {
  const { payment, getPaymentData } = this.props;
  this.refs.paymentRef.validateFieldsAndScroll( async(err, values) => {
    if (!err) {
      if(this.state.confirmLoading) return;
      const params = this._handleParams(values)
      params.id = payment.id
      let {errorCode} =  await editPayment(params)
      if(errorCode === '100200') {
        await getPaymentData()
        message.success(`${window.intl.get('SystemSetup.editSuccessfully')}`)
        this.setState({
          confirmLoading: true,
        });
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        }, 1000);
      }
    }else{
      console.log(err);
    }
  });
}


  // 取消 关闭
  handleCancel = () => {
    this.refs.paymentRef.resetFields()
    this.setState({
      visible: false,
    });
  };

  _handleParams = (obj) => {
    if(obj.channelArr) {
      obj.channel = obj.channelArr.join(',')
    }else{
      obj.channel = "" // 后台需要这种情况写死 页面是没有选择的
    }
    if(obj.receiptTypeArr) {
      obj.receiptType = obj.receiptTypeArr.join(',')
    }
    obj.supplyId = JSON.parse(localStorage.getItem('accountData')).user.user.userid
    obj.parentUserId = JSON.parse(localStorage.getItem('accountData')).user.user.topUserId
    obj.bankcardInfo =  {
      openName: obj.openName,
      bankName: obj.bankName,
      openAddress: obj.openAddress,
      cardNo: obj.cardNo,
      swiftCode: obj.swiftCode,
      receiptBankName: obj.receiptBankName,
      busCardNo: obj.busCardNo,
      receiptBankAddress1: obj.receiptBankAddress1,
      receiptBankAddress2: obj.receiptBankAddress2,
      benefitBankAddress3: obj.benefitBankAddress3,
      // currency: currency,

    }
    if(obj.currencyArr) {
      obj.bankcardInfo.currency= obj.currencyArr.join(',')
    }
    return obj
  }

  render() {
    const { edit, payment } = this.props;
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        {
          edit?<Button type="primary" size="small" onClick={this.showModal}>{window.intl.get('common.edit')}</Button>:<Button type="primary" onClick={this.showModal}>{window.intl.get('SystemSetup.AddPaymentMethod')}</Button>
        }
    
        <Modal
          title={ edit? `${window.intl.get('SystemSetup.editPayment')}`:`${window.intl.get('SystemSetup.addPayment')}`}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          width='570px'
          centered
          destroyOnClose
        >
          {/* <PaymentForm {...this.state}  ref='paymentRef' payment={payment} edit={edit} ></PaymentForm> */}
          
         {
           edit?<EditPaymentForm {...this.state}  ref='paymentRef' payment={payment} edit={edit} ></EditPaymentForm>:<PaymentForm {...this.state}  ref='paymentRef' />
         }
          
        </Modal>
      </div>
    );
  }
}
