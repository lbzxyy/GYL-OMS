import React from 'react'
import '../../pages/SystemSetting/SystemSetting.scss';
import PaymentModal from '../Modal/paymentModal';
import { getPaymentData } from '../../api/SystemSetting';

import IMG from'../../assets/img/noData.png';
export default class PaymentList extends React.Component {
    state = {
        paymentList: [],
        isEN: false, // 是否是英文情况
    }
  
    componentDidMount() {
      this.getPaymentData()

        // 判断一下当前是什么语言
      if(localStorage.getItem("locale")?localStorage.getItem("locale") === 'en':localStorage.getItem("defaultLng") === 'en') {
          // 英语情况
          this.setState({
              isEN: true
          })
      }else{
          this.setState({
              isEN: false
          })
      }
   }
    componentWillReceiveProps(nextProps) {
        this.getPaymentData()
    } 

    // 获取付款方式数据
    getPaymentData = async() => {
        let {data, errorCode} = await getPaymentData(JSON.parse(localStorage.getItem('accountData')).user.user.userid)
        if(errorCode === '100200') {
            this.setState({
                paymentList: data[data.length-1]
            })
        }
    }
    // 针对三个特定的字段 前端根据后台返回的数据 进行中英文翻译
    dealIn18nRegion = (str) => {
        if(!str) return
        let result;
        let arr = str.split(',')
        if(arr.includes('中国大陆')) {
            result = 'Chinese mainland'
        }else if(arr.includes('其它地区')){
            result = 'Other area'
        }
      return result;
    }
    dealIn18nReceiptType = (str) => {
        if(!str) return
        let result;
        let arr = str.split(',')
        if(arr.includes('银行转账') && arr.includes('线上')){
            result = 'Online top-up, Bank transfer'
        }
        else if(arr.includes('银行转账')){
            result = 'Online top-up'
        }else if(arr.includes('线上')){
            result = 'Bank transfer'
        }
        
      return result;
    }
    dealIn18nChannel = (str) => {
        if(!str) return
        let result;
        let arr = str.split(',')
        if(arr.includes('支付宝') && arr.includes('微信')){
            result = 'Alipay, WeChat'
        }
        else if(arr.includes('支付宝')){
            result = 'Alipay'
        }else if(arr.includes('微信')){
            result = 'WeChat'
        }
        
      return result;
    }

    render() {
        let payment = this.state.paymentList
        const { isEN } = this.state
        let region, receiptType, channel
        if(payment) {
             region = this.dealIn18nRegion(payment.region)
             receiptType = this.dealIn18nReceiptType(payment.receiptType)
             channel = this.dealIn18nChannel(payment.channel)
        }
        

        return <div className="company-info-cont PaymentList">
            {
                payment?<div>
                    <div className="title">
                    <div className="paymentName">{window.intl.get('Menu.paymentMethod')}</div>
                        <PaymentModal {...this.props} payment={payment} edit="edit" getPaymentData={this.getPaymentData} />
                    </div>
                    <div className="p-20 ">
                        <div className="sub-content">

                            <div className="item">
                                <div className="label">{window.intl.get('SystemSetup.service')}：</div>
                                
                                {
                                    isEN?<div className="value">{ region }</div>:<div className="value">{payment.region}</div> 
                                }
                            </div>
                            <div className="item">
                                <div className="label">{window.intl.get('Menu.paymentMethod')}：</div>
                                {
                                    isEN?<div className="value">{ receiptType }</div>:<div className="value">{payment.receiptType}</div>
                                }
                            </div>
                            {
                                payment.channel &&  <div className="item">
                                <div className="label">{window.intl.get('SystemSetup.channels')}：</div>
                                {
                                    isEN?<div className="value">{ channel }</div>:<div className="value">{payment.channel}</div>
                                }
                                    
                                </div>
                            }
                        
                            {
                                payment.bankcardInfo && <div>
                                    {
                                        payment.bankcardInfo.openName &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.accountName')}：</div>
                                            <div className="value">{payment.bankcardInfo.openName}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.bankName &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.bank')}：</div>
                                            <div className="value">{payment.bankcardInfo.bankName}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.openAddress &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.openBank')}：</div>
                                            <div className="value">{payment.bankcardInfo.openAddress}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.cardNo &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.accountNumber')}：</div>
                                            <div className="value">{payment.bankcardInfo.cardNo}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.swiftCode && 
                                        <div className="item">
                                            <div className="label">SWIFT：</div>
                                            <div className="value">{payment.bankcardInfo.swiftCode}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.receiptBankName && <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.collectingBank')}：</div>
                                            <div className="value">{payment.bankcardInfo.receiptBankName}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.busCardNo &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.businessAccount')}：</div>
                                            <div className="value">{payment.bankcardInfo.busCardNo}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.receiptBankAddress1 &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.receivingBankAddress')} 1：</div>
                                            <div className="value">{payment.bankcardInfo.receiptBankAddress1}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.receiptBankAddress2 &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.receivingBankAddress')} 2：</div>
                                            <div className="value">{payment.bankcardInfo.receiptBankAddress2}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.benefitBankAddress3 &&   <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.beneficiaryBankAddress') + '3'}：</div>
                                            <div className="value">{payment.bankcardInfo.benefitBankAddress3}</div>
                                        </div>
                                    }
                                    {
                                        payment.bankcardInfo.currency &&  <div className="item">
                                        <div className="label">{window.intl.get('SystemSetup.currency')}：</div>
                                            <div className="value">{payment.bankcardInfo.currency === 'USD'? `${window.intl.get('SystemSetup.US')}`: ''}</div>
                                        </div> 
                                    }
                                    
                                </div>
                            }
                        </div>
                    </div>
                </div>:<div className="noData">
                    <img width="330px" height="244px" src={IMG} alt="暂无数据"/>
                    <div>{window.intl.get('SystemSetup.noData')}</div>
                </div>
            }

        </div>
    }
}
