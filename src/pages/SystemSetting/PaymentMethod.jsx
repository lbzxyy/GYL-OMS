/*
 * @Author: 李步钻 
 * @Date: 2019-10-23 14:34:37 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-12 11:41:06
 */
import React from 'react'
import '../CustomerManagement/CustomerManagement.scss';
import './SystemSetting.scss';
import PaymentModal from '../../components/Modal/paymentModal';
import PaymentList from '../../components/List/paymentList';
import { Form, Spin } from 'antd';
import { getPaymentData } from '../../api/SystemSetting';


class PaymentMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sellerForm: {},
            showLoading: false,
            isEN: false, // 是否是英文情况
            countryList: [], // 国家
            categoryList: [], // 种类
            paymentList: {}, // 付款方式数据
            isUpdate: false,
            isShowAdd: false,
        }
    }
    
    render() {
        const { isShowAdd } = this.state
        return (
            <div className="part-spin-cont PaymentMethod SupplierManagement">
            <Spin size='large' spinning={this.state.showLoading}></Spin>
           <div className="header">
              <div className="title">{window.intl.get('Menu.paymentMethod')}</div>
           </div>
           <div className="content">
               <Form labelCol={{ span: 4 }} labelAlign='left' wrapperCol={{ span: 12 }} >
                <div className="titleName">{window.intl.get('Menu.paymentMethod')}</div>
                <div className="addButton">
                    {
                        isShowAdd && <PaymentModal { ...this.props } getPaymentData={this.getPaymentData} />
                    }
                </div>
                <PaymentList edit="edit" ref="edit" getPaymentData={this.getPaymentData}/>
               </Form>
           </div>
           
       </div>
        )
    }
    componentDidMount() {
        this.getPaymentList()
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
    // 获取付款方式数据
     getPaymentData = () => {
         this.setState({
            isUpdate: true
         })
    }
    // 获取付款方式数据
    getPaymentList = async() => {
        let {data, errorCode} = await getPaymentData(JSON.parse(localStorage.getItem('accountData')).user.user.userid)
        if(errorCode === '100200') {
            if(data.length>0) {
                this.setState({
                    isShowAdd: false
                })
            }else{
                this.setState({
                    isShowAdd: true
                })
            }
            this.setState({
                paymentList: data[data.length-1]
            })
        }
    }
}
export default  Form.create({ name: 'sellerForm' })(PaymentMethod)

