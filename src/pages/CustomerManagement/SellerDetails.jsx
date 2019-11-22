/*
 * @Author: 李步钻 
 * @Date: 2019-09-24 13:44:13 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-11-01 14:16:05
 */
import React from 'react'
import './CustomerManagement.scss';
import { Form, Button, Spin, Select } from 'antd';
import { getSellerById, getCountry, getCategoryList } from '../../api/CustomerManagement.js';
import Zmage from 'react-zmage'
const { Option } = Select;

class SellerDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sellerForm: {},
            showLoading: false,
            isEN: false, // 是否是英文情况
            countryList: [], // 国家
            categoryList: [], // 种类
        }
    }
    
    render() {
       const { getFieldDecorator } = this.props.form;
        let operatingPeriod = this.state.sellerForm && this.state.sellerForm.operatingPeriod
        return (
            <div className="part-spin-cont SupplierManagement">
            <Spin size='large' spinning={this.state.showLoading}></Spin>
           <div className="header">
                    <div className="title">{window.intl.get('labelTitle.detail')}</div>
           </div>
           <div className="content">
               <Form labelCol={{ span: 4 }} labelAlign='left' wrapperCol={{ span: 12 }} >
                        <div className="titleName">{window.intl.get('labelTitle.sellerInfo')}</div>
                        <Form.Item label={window.intl.get('detailLabel.sellerUsername') + '：'}>
                   {getFieldDecorator('loginName', {
                       rules: [{ required: true}],
                   })(
                      <div>{ this.state.sellerForm.loginName}</div>
                   )}
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.sellerType') + '：'}>
                            <div>{this.state.sellerForm.sellerType === 1 ? window.intl.get('serverWords.personalSeller') : window.intl.get('serverWords.businessSeller')}</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.businessPlatform') + '：'}>
                            <div>{this.state.sellerForm.managementPlatform && this.state.sellerForm.managementPlatform.replace(',Wish', '').replace('Wish,', '').replace('Wish', '')}</div>
                   </Form.Item>
                   <Form.Item label={window.intl.get('detailLabel.majorType') + '：'}>
                       {getFieldDecorator('mainCategory', {
                         initialValue: this.state.sellerForm.mainCategory,
                    })(
                        <Select className="reset"  disabled style={{ width: 520 }}  mode="multiple">
                        {
                            this.state.categoryList.map(item => <Option key={item.id} value={item.id}>{!this.state.isEN?item.categoryName:item.categoryNameEn}</Option>)
                        }
                    </Select>
                    )}
                    </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.monthTurnover') + '：'}>
                            <div>{window.intl.get(`monthTurnover.${this.state.sellerForm.monthlyTurnover}`)}</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.supplierChainCompany') + '：'}>
                   {getFieldDecorator('supplyChainCompanyName', {
                       rules: [{ required: true}],
                   })(
                      <div>{ this.state.sellerForm.supplyChainCompanyName }</div>
                   )}
                   </Form.Item>
                        <div className="titleName">{window.intl.get('labelTitle.contactInfo')}</div>
                        <Form.Item label={window.intl.get('detailLabel.contacter') + '：'}>
                   {getFieldDecorator('userName', {
                       rules: [{ required: true}],
                   })(
                      <div>{ this.state.sellerForm.userName}</div>
                   )}
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.contactTelephone') + '：'}>
                      <div>{ this.state.sellerForm.mobile}</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.contactMail') + '：'}>
                      <div>{ this.state.sellerForm.email }</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.contactCellphone') + '：'}>
                      <div>{ this.state.sellerForm.phone}</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.contactQQ') + '：'}>
                      <div>{ this.state.sellerForm.qq}</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.contactAddress') + '：'}>
                      <div>{ this.state.sellerForm.address}</div>
                   </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.zipCode') + '：'}>
                      <div>{ this.state.sellerForm.postCode}</div>
                   </Form.Item>
                   {
                        this.state.sellerForm.sellerType !== 1 &&<div>

                        <div  className="titleName">{window.intl.get('labelTitle.companyInfo')}</div>
                        <Form.Item label={window.intl.get('detailLabel.companyName') + '：'}>
                       {getFieldDecorator('companyName', {
                           rules: [{ required: true}],
                       })(
                          <div>{ this.state.sellerForm.companyName}</div>
                       )}
                       </Form.Item>
                       <Form.Item label={window.intl.get('detailLabel.country/zone') + '：'}>
                        {getFieldDecorator('regArea', {
                             initialValue: [this.state.sellerForm.regArea===0?null:this.state.sellerForm.regArea],
                            rules: [{ required: true}],
                        })(
                           <Select className="reset" disabled style={{ width: 200 }}>
                              {
                                  this.state.countryList.map(item => <Option key={item.id} value={item.code}>{!this.state.isEN?item.name:item.nameEn}</Option>)
                              }
                           </Select>
                        )}
                        </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.registerAddress') + '：'}>
                       {getFieldDecorator('regAddress', {
                           rules: [{ required: true}],
                       })(
                          <div>{ this.state.sellerForm.regAddress}</div>
                       )}
                       </Form.Item>
                            <Form.Item label={window.intl.get('detailLabel.creditCode') + '：'}>
                       {getFieldDecorator('creditCode', {
                           rules: [{ required: true}],
                       })(
                          <div>{ this.state.sellerForm.creditCode}</div>
                       )}
                       </Form.Item>
                            <Form.Item label={window.intl.get('detailLabel.foundDate') + '：'}>
                       {getFieldDecorator('companyCreateDate', {
                         
                       })(
                           <div>{this.state.sellerForm.createDate}</div>
                       )}
                       </Form.Item>
                            <Form.Item label={window.intl.get('detailLabel.operatingPeriod') + '：'}>
                          <div>{operatingPeriod && operatingPeriod.split(',').join(' —— ')}</div>
                       </Form.Item>
                            <Form.Item label={window.intl.get('detailLabel.companyScale') + '：'}>
                                    <div>{window.intl.get(`companyScale.${this.state.sellerForm.companyScale}`)}</div>
                       </Form.Item>
                      
                        <Form.Item label={window.intl.get('detailLabel.legalPerson') + '：'}>
                       {getFieldDecorator('legalpersonName', {
                           rules: [{ required: true}],
                       })(
                          <div>{ this.state.sellerForm.legalpersonName}</div>
                       )}
                       </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.idCardNumber') + '：'}>
                       {getFieldDecorator('legalpersonIdentitycard', {
                           rules: [{ required: true}],
                       })(
                          <div>{ this.state.sellerForm.legalpersonIdentitycard}</div>
                       )}
                       </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.idCardFront') + '：'} style={{margin: `20px 0 20px 42px`}}>
                       {getFieldDecorator('identitycardFrontImage', {
                           rules: [{ required: true}],
                       })(
                        this.state.sellerForm.identitycardFrontImage===''?<div></div>:<Zmage width='100' height='100' src={this.state.sellerForm.identitycardFrontImage} alt=""/>
                       )}
                       </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.idCardBack') + '：'} style={{margin: `20px 0 20px 42px`}}>
                       {getFieldDecorator('identitycardReverseImage', {
                           rules: [{ required: true}],
                       })(
                        this.state.sellerForm.identitycardReverseImage===''?<div></div>:<Zmage width='100'  height='100' src={this.state.sellerForm.identitycardReverseImage} alt=""/>
                       )}
                       </Form.Item>
                        <Form.Item label={window.intl.get('detailLabel.businessLicense') + '：'} style={{margin: `20px 0 20px 42px`}}>
                       {getFieldDecorator('businessLicense', {
                           rules: [{ required: true}],
                       })(
                        this.state.sellerForm.businessLicense===''?<div></div>:<Zmage width='100'  height='100' src={this.state.sellerForm.businessLicense} alt=""/>
                       )}
                       </Form.Item>
                       
                     
                      <Form.Item label={window.intl.get('detailLabel.companyProfile') + '：'}>
                       {getFieldDecorator('companyProfile', {
                           rules: [{ required: true}],
                       })(
                          <div>{ this.state.sellerForm.companyProfile}</div>
                       )}
                       </Form.Item>
                       </div>

                   }
                   
                   <div className="underline"></div>
                   <div className="back"><Button type="primary" onClick={this.goBack} style={{width: '120px', background: '#007EEF'}}>{window.intl.get('common.back')}</Button></div>
               </Form>
           </div>
       </div>
        )
    }
    componentDidMount() {
        this.search()
        this.getCountry()
        this.getCategoryList()
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
    async search() {
        
        // let userId = this.props.match.params.userId
        let userId = this.props.location.state.id
        // let userId = this.props.location.query.id

        let params = {userId}
        this.setState({
            sellerForm: {},
            showLoading: true
        })
        let { data = {} } = await getSellerById(params);
        data.mainCategory = (data.mainCategory === '' || data.mainCategory === undefined) ? [] : data.mainCategory.split(",").map(Number)
        this.setState({
            sellerForm: data,
            showLoading: false
        })
    }
    goBack = () => {
        this.props.history.push({pathname: '/Customer/SellerManagement'})
    }
    async getCountry() {
        let params = {level: 1, parentId: 0}
        let { errorCode, data } = await getCountry(params)
        if(errorCode === '100200') {
            this.setState({
               countryList: data
            })
        }
    }
    async getCategoryList() {
       let params = {page: 1, row: 9999}
       let { errorCode, data } = await getCategoryList(params)
       if(errorCode === '100200') {
           this.setState({
               categoryList: data.pageInfo.list
           })
       }
   }
}
export default  Form.create({ name: 'sellerForm' })(SellerDetails)

