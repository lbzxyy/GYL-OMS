import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { getCreditApplyUserInfo } from '../../api/ApprovalManage';
import { Input, Select, DatePicker, Button, Table, Pagination } from 'antd';
import utils from '../../utils/commonUtils'
import moment from 'moment';
import Big from 'big.js'

import './Approval.scss';

const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = Select;

const { RangePicker } = DatePicker

const columns = [
  {
    title: window.intl.get('creditApprovalTable.submitPerson'),
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: window.intl.get('creditApprovalTable.sellerType'),
    dataIndex: 'userType',
    key: 'userType',
    render (text) {
      return window.intl.get(`creditApprovalTable.${text.toLowerCase()}`)
    }
  },
  {
    title: window.intl.get('creditApprovalTable.totalAmount'),
    dataIndex: 'creditLimit',
    key: 'creditLimit',
    render (text) {
      return Big(text).toFixed(2)
    }
  },
  {
    title: window.intl.get('creditApprovalTable.availableAmount'),
    dataIndex: 'freeCreditLimit',
    key: 'freeCreditLimit',
    render(text) {
      return Big(text).toFixed(2)
    }
  },
  {
    title: window.intl.get('creditApprovalTable.usedAmount'),
    dataIndex: 'usedCreditLimit',
    key: 'usedCreditLimit',
    render(text) {
      return Big(text).toFixed(2)
    }
  },
  {
    title: window.intl.get('creditApprovalTable.submitTime'),
    dataIndex: 'applyTime',
    key: 'applyTime',
  },
  {
    title: window.intl.get('creditApprovalTable.checkTime'),
    dataIndex: 'checkTime',
    key: 'checkTime',
  },
  {
    title: window.intl.get('creditApprovalTable.status'),
    dataIndex: 'applyStatus',
    key: 'applyStatus',
    render (item) {
      let text, color
      switch (item) {
        case 'Applying':
          text = window.intl.get('creditApprovalList.applying')
          color = '#333'
          break;
        case 'Access':
          text = window.intl.get('creditApprovalList.access')
          color = 'green'
          break;
        case 'Refuse':
          text = window.intl.get('creditApprovalList.refuse')
          color = 'red'
          break;
        default:
          text = item
          break;
      }
      return <div style={{ color }}>{text}</div>
    }
  },
  {
    title: window.intl.get('creditApprovalTable.operating'),
    key: 'action',
    render: item => (
      <span>
        <Link to={'/Approval/CreditApproval/detail?id=' + item.userId + '&person=' + item.username + '&sellerType=' + item.userType}>{window.intl.get('creditApprovalList.view')}</Link>
        {
          item.applyStatus === 'Applying' && (<Link className="ml-15" to={"/Approval/CreditApproval/check?id=" + item.userId}>{window.intl.get('creditApprovalList.check')}</Link>)
        }
      </span>
    ),
  },
];

class Entrance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLoading: false,
      dataSource: [],
      page: 1,
      limit: 10,
      total: 0,
      applyStatus: '',
      dateArray: [],
      sellerName: ''
    }
  }

  UNSAFE_componentWillMount () {
    // let accountData
    // try {
    //   accountData = JSON.parse(localStorage.accountData)
    // } catch (e) {
    //   accountData = {}
    // }
    // console.log(accountData.user.user.userid)
    this.getList()
  }

  async getList () {
    let postData = {
      pageNum: this.state.page,
      pageSize: this.state.limit,
      // userId: 774,
      userType: 'Seller',
      applyStatus: this.state.applyStatus || undefined,
      sellerName: this.state.sellerName || undefined
    }
    if (this.state.dateArray.length) {
      postData['beginDate'] = this.state.dateArray[0].format('YYYY-MM-DD HH:mm:SS')
      postData['endDate'] = this.state.dateArray[1].format('YYYY-MM-DD HH:mm:SS')
    }
    const { data = {} } = await getCreditApplyUserInfo(postData)
    let { list = [], total } = data
    list.forEach(item => {
      item.applyTime = moment(item.createTime.time).format('YYYY-MM-DD HH:mm:SS')
      item.checkTime = item.applyStatus === 'Applying' ? '--' : moment(item.updateTime.time).format('YYYY-MM-DD HH:mm:SS')
    })
    this.setState({
      dataSource: list,
      total
    })
  }

  handleChangePagination = (page, limit) => {
    this.setState({
      page: page,
      limit: limit
    }, this.getList)
  }

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  handleChangeSearch () {
    //
  }

  handleInput = e => {
    let val = e.target.value
    if (val) {
      this.setState({ sellerName: val })
    } else {
      this.setState({
        sellerName: val,
        page: 1
      }, this.getList)
    }
  }

  handleSearch = (val) => {
    if (!val) return
    this.setState({
      page: 1
    }, this.getList)
  }

  // 搜索条件改变
  handleCommonChange = (key, value) => {
    this.setState({ [key]: value }, this.getList)
  }

  // 重置
  handleReset = () => {
    this.setState({
      applyStatus: '',
      sellerName: '',
      dateArray: []
    }, this.getList)
  }

  exportExcel = async () => {
    let params = {
      pageNum: this.state.page,
      pageSize: this.state.limit,
      applyStatus: this.state.applyStatus || undefined,
      sellerName: this.state.sellerName || undefined
    }
    if (this.state.dateArray.length) {
      params['beginDate'] = this.state.dateArray[0].format('YYYY-MM-DD HH:mm:SS')
      params['endDate'] = this.state.dateArray[1].format('YYYY-MM-DD HH:mm:SS')
    }
    let url = '/finance/creditApply/getCreditApplyUserInfo/export'
    utils.export('get', url, params, '授信审批表', '.xlsx')
  }

  render () {
    return (
      <div className='approval-cont'>
        {/* <Spin size='large' spinning={this.state.showLoading}></Spin> */}
        <div className="header">
          <div className="title">{window.intl.get('creditApprovalList.title')}</div>
          <div className="search">
            <InputGroup compact>
              <Select defaultValue="companyName">
                <Option value="companyName">{window.intl.get('creditApprovalList.submitPerson')}</Option>
              </Select>
              <Search
                allowClear
                enterButton
                ref={this.myRef}
                style={{ width: '70%' }}
                onChange={this.handleInput}
                onSearch={this.handleSearch}
                value={this.state.sellerName}
                placeholder={window.intl.get('common.searchPlaceholder')} />
            </InputGroup>
          </div>
        </div>
        <div className="p-20 content">
          <Select defaultValue="jack" style={{ width: 120 }}>
            <Option value="jack">{window.intl.get('creditApprovalList.submitTime')}</Option>
            <Option value="lucy">{window.intl.get('creditApprovalList.checkTime')}</Option>
          </Select>
          <RangePicker
            showTime
            placeholder={[window.intl.get('creditApprovalList.startTime'), window.intl.get('creditApprovalList.endTime')]}
            value={this.state.dateArray}
            className="ml-20 custom-picker"
            dropdownClassName="custom-picker"
            onChange={this.handleCommonChange.bind(this, 'dateArray')} />
          <Select
            className="ml-20"
            style={{ width: 120 }}
            value={this.state.applyStatus}
            onChange={this.handleCommonChange.bind(this, 'applyStatus')}>
            <Option value="">{window.intl.get('creditApprovalList.all')}</Option>
            <Option value="Applying">{window.intl.get('creditApprovalList.applying')}</Option>
            <Option value="Access">{window.intl.get('creditApprovalList.access')}</Option>
            <Option value="Refuse">{window.intl.get('creditApprovalList.refuse')}</Option>
          </Select>
          <Button type="link" onClick={this.handleReset}>{window.intl.get('creditApprovalList.reset')}</Button>
          <div className="mt-15">
            <Button type="primary" onClick={this.exportExcel}>{window.intl.get('creditApprovalList.export')}</Button>
          </div>
          <Table rowKey="userId" pagination={false} className="mt-15" dataSource={this.state.dataSource} columns={columns} />
          <div className="mt-20 mb-20 pagination-cont">
            <Pagination
              showSizeChanger
              current={this.state.page}
              defaultPageSize={this.state.limit}
              total={this.state.total}
              showTotal={() => `${window.intl.get('common.total')}  ${this.state.total} ${window.intl.get('common.items')}`}
              onChange={this.handleChangePagination}
              onShowSizeChange={this.handleChangePagination}
            />
          </div>
        </div>
      </div>
    )
  }
}

// 使用withRouter获取this.props.location
export default withRouter(Entrance)
