import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { gerCompanyDetail, getCountries } from '../../api/SystemSetting'
import { Spin } from 'antd'
import Zmage from 'react-zmage'

import './SystemSetting.scss';

class Entrance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      companyDetail: {},
      countries: [],
      showLoading: false
    }
  }

  UNSAFE_componentWillMount () {
    this.gerCompanyDetail()
    this.getCountries()
  }

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  async gerCompanyDetail () {
    let accountData = {}
    try {
      accountData = JSON.parse(localStorage.accountData)
    } catch (error) {}
    if (!accountData['user']) {
      this.props.history.push('/entrance/login')
      return
    }
    let id = accountData['user']['user']['userid']
    this.state = Object.assign(this.state, { showLoading: true })
      this.setState(() => {
        return this.state
      })
    const { data = {} } = await gerCompanyDetail({ id })
      this.setState(() => {
        return {
          companyDetail: data,
          showLoading: false
        }
      })
  }

  async getCountries () {
    const { data = {} } = await getCountries()
    this.setState({ countries: data })
  }

  render () {
    let operatingPeriod = this.state.companyDetail.operatingPeriod
    let countryNameKey = localStorage.getItem('locale') === 'zh' ? 'name' : 'nameEn'
    return (
      <div className='part-spin-cont company-info-cont'>
        <Spin size='large' spinning={this.state.showLoading}></Spin>
        <div className="header">
          <div className="title">{window.intl.get('Menu.companyInfo')}</div>
        </div>
        <div className="p-20 content">
          <div className="subtitle">{window.intl.get('labelTitle.contactInfo')}</div>
          <div className="sub-content">
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.contacter')}：</div>
              <div className="value">{this.state.companyDetail.userName}</div>
            </div>
            {
              !!this.state.companyDetail.mobile && (<div className="item">
                <div className="label">{window.intl.get('detailLabel.contactTelephone')}：</div>
                <div className="value">{this.state.companyDetail.mobile}</div>
              </div>)
            }
            <div className="item">
              <div className="label">{window.intl.get('detailLabel.contactMail')}：</div>
              <div className="value">{this.state.companyDetail.email}</div>
            </div>
            <div className="item">
              <div className="label">{window.intl.get('detailLabel.contactCellphone')}：</div>
              <div className="value">{this.state.companyDetail.phone}</div>
            </div>
            {
              !!this.state.companyDetail.qq && (
                <div className="item">
                  <div className="label">{window.intl.get('detailLabel.contactQQ')}：</div>
                  <div className="value">{this.state.companyDetail.qq}</div>
                </div>
              )
            }
            {
              !!this.state.companyDetail.address && (
                <div className="item">
                  <div className="label">{window.intl.get('detailLabel.contactAddress')}：</div>
                  <div className="value">{this.state.companyDetail.address}</div>
                </div>
              )
            }
            {
              !!this.state.companyDetail.postCode && (
                <div className="item">
                  <div className="label">{window.intl.get('detailLabel.zipCode')}：</div>
                  <div className="value">{this.state.companyDetail.postCode}</div>
                </div>
              )
            }
          </div>
          <div className="subtitle">{window.intl.get('labelTitle.companyInfo')}</div>
          <div className="sub-content">
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.companyName')}：</div>
              <div className="value">{this.state.companyDetail.companyName}</div>
            </div>
            {
              !!this.state.companyDetail.regArea && (<div className="item">
                <div className="is-required label">{window.intl.get('detailLabel.country/zone')}：</div>
                <div className="value">
                  {
                    // eslint-disable-next-line
                    ((this.state.countries.find(item => item.code == this.state.companyDetail.regArea)) || {})[countryNameKey]
                    ||
                    // eslint-disable-next-line
                    ((this.state.countries.find(item => item.id == this.state.companyDetail.regArea)) || {})[countryNameKey]
                    ||
                    this.state.companyDetail.regArea
                  }
                </div>
              </div>)
            }
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.registerAddress')}：</div>
              <div className="value">{this.state.companyDetail.regAddress}</div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.creditCode')}：</div>
              <div className="value">{this.state.companyDetail.creditCode}</div>
            </div>
            {
              !!this.state.companyDetail.creditDate && (
                <div className="item">
                  <div className="label">{window.intl.get('detailLabel.foundDate')}：</div>
                  <div className="value">{this.state.companyDetail.creditDate}</div>
                </div>
              )
            }
            {
              !!operatingPeriod && (
                <div className="item">
                  <div className="label">{window.intl.get('detailLabel.operatingPeriod')}：</div>
                  <div className="value">{operatingPeriod && operatingPeriod.split(',').join(' —— ')}</div>
                </div>
              )
            }
            <div className="item">
              <div className="label">{window.intl.get('detailLabel.companyScale')}：</div>
              <div className="value">{window.intl.get(`companyScale.${this.state.companyDetail.companyScale}`)}</div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.legalPerson')}：</div>
              <div className="value">{this.state.companyDetail.legalpersonName}</div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.idCardNumber')}：</div>
              <div className="value">{this.state.companyDetail.idCard}</div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.idCardFront')}：</div>
              <div className="value">
                <Zmage width="100" src={this.state.companyDetail.identitycardFrontImage} alt={this.state.companyDetail.identitycardFrontImage}/>
              </div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.idCardBack')}：</div>
              <div className="value">
                <Zmage width="100" src={this.state.companyDetail.identitycardReverseImage} alt={this.state.companyDetail.identitycardReverseImage}/>
              </div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.businessLicense')}：</div>
              <div className="value">
                <Zmage width="100" src={this.state.companyDetail.businessLicense} alt={this.state.companyDetail.businessLicense}/>
              </div>
            </div>
            <div className="item">
              <div className="is-required label">{window.intl.get('detailLabel.companyProfile')}：</div>
              <div className="value">{this.state.companyDetail.companyProfile}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// 使用withRouter获取this.props.location
export default withRouter(Entrance)
