/*
 * @Author: 李步钻 
 * @Date: 2019-09-24 13:44:06 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-09 20:56:56
 */
import React from 'react'
import './CustomerManagement.scss';
import { Form, Button, Spin, Select } from 'antd';
import { getSupplierById, getCountry, getCategoryList } from '../../api/CustomerManagement.js';
import Zmage from 'react-zmage'
const { Option } = Select;

 class SupplierDetails extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
            supplierForm: {},
            showLoading: false,
            isEN: false, // 是否是英文情况
            countryList: [], // 国家
            categoryList: [], // 种类
         }
     }
     
     render() {
        const { getFieldDecorator } = this.props.form;
         let operatingPeriod = this.state.supplierForm.operatingPeriod
         return (
            <div className="part-spin-cont SupplierManagement">
            <Spin size='large' spinning={this.state.showLoading}></Spin>
            <div className="header">
                     <div className="title">{window.intl.get('labelTitle.detail')}</div>
            </div>
            <div className="content">
                <Form labelCol={{ span: 4 }} labelAlign='left' wrapperCol={{ span: 12 }} >
                   <div className="titleName">{window.intl.get('labelTitle.supplierInfo')}</div>
                   <Form.Item label={window.intl.get('supplierManageList.supplierUsername') + '：'}>
                    {getFieldDecorator('loginName', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.loginName}</div>
                    )}
                    </Form.Item> 
                    <Form.Item label={window.intl.get('sellerManageList.supplierChainCompany') + '：'}>
                    {getFieldDecorator('supplyChainCompanyName', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.supplyChainCompanyName }</div>
                    )}
                    </Form.Item> 
                    <Form.Item label={window.intl.get('detailLabel.CycleClearing') + '：'}>
                    {getFieldDecorator('closedCircle', {
                        rules: [{ required: true}],
                    })(
                        <div>{window.intl.get(`settlement.${this.state.supplierForm.closedCircle}`)}</div>
                    )}
                    </Form.Item>
                        {
                        // eslint-disable-next-line
                        this.state.supplierForm.closedStatus == 5 && (
                        <div>
                            <Form.Item label={window.intl.get('detailLabel.settlementRatio') + '：'}>
                            {getFieldDecorator('settlementRatio', {
                                rules: [{ required: true}],
                            })(
                                <div>{this.state.supplierForm.proportion.length + ' ' + window.intl.get('serverWords.ratio')}</div>
                            )}
                            </Form.Item> 
                            <Form.Item label={window.intl.get('detailLabel.settlementProportionValue') + '：'}>
                            {getFieldDecorator('settlementProportionValue', {
                                rules: [{ required: true}],
                            })(
                            <div>{ this.state.supplierForm.settlementProportionValue}</div>
                            )}
                            </Form.Item>
                        </div>
                        )
                    }
                  

                    <div className="titleName">{window.intl.get('labelTitle.contactInfo')}</div>
                    <Form.Item label={window.intl.get('detailLabel.contacter') + '：'}>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.userName}</div>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.contactTelephone') + '：'}>
                       <div>{ this.state.supplierForm.mobile}</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.contactMail') + '：'}>
                       <div>{ this.state.supplierForm.email }</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.contactCellphone') + '：'}>
                       <div>{ this.state.supplierForm.phone}</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.contactQQ') + '：'}>
                       <div>{ this.state.supplierForm.qq}</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.contactAddress') + '：'}>
                       <div>{ this.state.supplierForm.address}</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.zipCode') + '：'}>
                       <div>{ this.state.supplierForm.postCode}</div>
                    </Form.Item>
                         <div className="titleName">{window.intl.get('labelTitle.companyInfo')}</div>
                         <Form.Item label={window.intl.get('detailLabel.companyName') + '：'}>
                    {getFieldDecorator('companyName', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.companyName}</div>
                    )}
                    </Form.Item>
                    <Form.Item label={window.intl.get('detailLabel.country/zone') + '：'}>
                    {getFieldDecorator('regArea', {
                         initialValue: [this.state.supplierForm.regArea===0?null:this.state.supplierForm.regArea],
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
                       <div>{ this.state.supplierForm.regAddress}</div>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.creditCode') + '：'}>
                    {getFieldDecorator('creditCode', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.creditCode}</div>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.foundDate') + '：'}>
                    {getFieldDecorator('companyCreateDate', {
                    })(
                       <div>{ this.state.supplierForm.createDate}</div>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.operatingPeriod') + '：'}>
                             <div>{operatingPeriod && operatingPeriod.split(',').join(' —— ')}</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.companyScale') + '：'}>
                             <div>{window.intl.get(`companyScale.${this.state.supplierForm.companyScale}`)}</div>
                    </Form.Item>
                     <Form.Item label={window.intl.get('detailLabel.majorType') + '：'}>
                       {getFieldDecorator('mainCategory', {
                         initialValue: this.state.supplierForm.mainCategory,
                    })(
                        <Select className="reset"  disabled style={{ width: 520 }}  mode="multiple">
                        {
                            this.state.categoryList.map(item => <Option key={item.id} value={item.id}>{!this.state.isEN?item.categoryName:item.categoryNameEn}</Option>)
                        }
                    </Select>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.monthTurnover') + '：'}>
                             <div>{window.intl.get(`monthTurnover.${this.state.supplierForm.monthlyTurnover}`)}</div>
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.legalPerson') + '：'}>
                    {getFieldDecorator('legalpersonName', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.legalpersonName}</div>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.idCardNumber') + '：'}>
                    {getFieldDecorator('idCard', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.idCard}</div>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.idCardFront') + '：'} style={{margin: `20px 0 20px 42px`}}>
                    {getFieldDecorator('idCardFImage', {
                        rules: [{ required: true}],
                    })(
                        this.state.supplierForm.idCardFImage===''?<div></div>:<Zmage width='100' height='100' src={this.state.supplierForm.idCardFImage} alt=""/>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.idCardBack') + '：'} style={{margin: `20px 0 20px 42px`}}>
                    {getFieldDecorator('idCardRImage', {
                        rules: [{ required: true}],
                    })(
                        this.state.supplierForm.idCardRImage===''?<div></div>:<Zmage width='100' height='100' src={this.state.supplierForm.idCardRImage} alt=""/>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.businessLicense') + '：'} style={{margin: `20px 0 20px 42px`}}>
                    {getFieldDecorator('businessLicense', {
                        rules: [{ required: true}],
                    })(
                        this.state.supplierForm.businessLicense===''?<div></div>:<Zmage width='100' height='100' src={this.state.supplierForm.businessLicense} alt=""/>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.brandLicensing') + '：'} style={{margin: `20px 0 20px 42px`}}>
                    {getFieldDecorator('brandLicensing', {
                        rules: [{ required: true}],
                    })(
                        this.state.supplierForm.brandLicensing===''?<div>{window.intl.get('detailLabel.noBrand')}</div>:<Zmage width='100' src={this.state.supplierForm.brandLicensing} alt=""/>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.otherLicense') + '：'} style={{margin: `20px 0 20px 42px`}}>
                    {getFieldDecorator('otherCertificates', {
                    })(
                        this.state.supplierForm.otherCertificates===''?<div></div>:<Zmage width='100' height='100' src={this.state.supplierForm.otherCertificates} alt=""/>
                    )}
                    </Form.Item>
                         <Form.Item label={window.intl.get('detailLabel.companyProfile') + '：'}>
                    {getFieldDecorator('companyProfile', {
                        rules: [{ required: true}],
                    })(
                       <div>{ this.state.supplierForm.companyProfile}</div>
                    )}
                    </Form.Item>
                    <div className="underline"></div>
                    <div className="back"><Button type="primary" onClick={this.goBack} style={{width: '120px',  background: '#007EEF'}}>{window.intl.get('common.back')}</Button></div>
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
        //  let userId = this.props.match.params.userId
         let userId = this.props.location.state.id
         let params = {userId}
         this.setState({
             supplierForm: {},
             showLoading: true
         })
         let { data = {} } = await getSupplierById(params);
         this._deal(data) // 处理各种数据与回显
         this.setState({
            supplierForm: data,
            showLoading: false
         })
     }
     goBack = () => {
         this.props.history.push({pathname: '/Customer/SupplierManagement'})
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
    _deal(data) {
        data.mainCategory = data.mainCategory===''?[]:(data.mainCategory || '').split(",").map(Number)
        data.settlementProportionValue = data.proportion===[]?null:data.proportion.map(item=>{
            return item=item*100 +　'%'
        }).join(' —— ')

        data.closedStatus = data.closedCircle
        
        switch (data.closedCircle) {
           case '1':
                data.closedCircle = 'weekly'
             break;
           case '2':
                data.closedCircle = 'monthHalf'
             break;
           case '3':
                data.closedCircle = 'monthly'
             break;
           case '4':
                data.closedCircle = 'timely'
             break;
           case '5':
                data.closedCircle = 'account'
             break;
           default:
             break;
         }
    }
     
 }
 export default  Form.create({ name: 'supplierForm' })(SupplierDetails)
 
