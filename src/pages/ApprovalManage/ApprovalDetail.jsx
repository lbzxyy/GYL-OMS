import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { getCreditApplyShopInfo, getCountOfShop, getShopTotalAmount, changeLimit, approvalCheckDetail, getSellerCreditInfo } from '../../api/ApprovalManage'
import { DatePicker, Modal, Button, Table, Divider, InputNumber, message, Pagination } from 'antd';
import moment from 'moment';
import utils from '../../utils/commonUtils'
import Big from 'big.js';

import './Approval.scss';

const { getQueryByLocation } = utils

// const InputGroup = Input.Group;
// const { Search } = Input;
// const { Option } = Select;

const { MonthPicker } = DatePicker

const platformTypeArr = ['Other', 'eBay', 'Amazon', 'Aliexpress']

class Entrance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      historyVisible: false,
      limitVisible: false,
      showLoading: false,
      mainTatolInfo: {},
      shopCount: 0,
      page: 1,
      limit: 10,
      total: 0,
      dialogPage: 1,
      dialogLimit: 10,
      dialogTotal: 0,
      dataSource: [],
      checkList: [],
      totalInfo: {}, // 提额总数居
      totalAmountObj: {} // 变更历史数据
    }
  }

  columns = [
    {
      title: window.intl.get('approvalDetailTable.platformType'),
      dataIndex: 'platformType',
      key: 'platformType',
      render (text, obj) {
        return <div>{obj.platformType || '--'}/{obj.shopName || '--'}</div>
      }
    },
    {
      title: window.intl.get('approvalDetailTable.type'),
      dataIndex: 'newApplyType',
      key: 'newApplyType',
      render (text) {
        // <div>{window.intl.get(`approvalDetail.${text.toLowerCase()}`)}</div>
        return window.intl.get('approvalDetail.apply')
      }
    },
    {
      title: window.intl.get('approvalDetailTable.applyAmount'),
      dataIndex: 'totalApplyAmount',
      key: 'totalApplyAmount',
      render(text) {
        return Big(text).toFixed(2)
      }
    },
    {
      title: window.intl.get('approvalDetailTable.approvalAmount'),
      dataIndex: 'totalAccessAmount',
      key: 'totalAccessAmount',
      render(text) {
        return Big(text).toFixed(2)
      }
    },
    {
      title: window.intl.get('approvalDetailTable.shopAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render(text) {
        return Big(text).toFixed(2)
      }
    },
    {
      title: window.intl.get('approvalDetailTable.creditStatus'),
      key: 'newApplyStatus',
      dataIndex: 'newApplyStatus',
      render: text => {
        return <div>{window.intl.get(`approvalDetail.${text.toLowerCase()}`)}</div>
      }
    },
    {
      title: window.intl.get('approvalDetailTable.operating'),
      key: 'shopId',
      dataIndex: 'shopId',
      render: (text, obj) => (
        <div className="buttons-cont">
          {/* {
            obj.newApplyStatus === 'Access' && <Button type="link" onClick={this.showLimitModal.bind(this, obj.totalAmount, obj)}>{window.intl.get('approvalDetail.changeLimit')}</Button>
          } */}
          <Button type="link" onClick={this.showHistoryModal.bind(this, text)}>{window.intl.get('approvalDetail.changeHistory')}</Button>
        </div>
      ),
    },
  ];

  checkColumns = [
    {
      title: window.intl.get('approvalDetailTable.time'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: text => <div>{moment(text.time).format('YYYY-MM-DD HH:MM:SS')}</div>
    },
    {
      title: window.intl.get('approvalDetailTable.platformType'),
      dataIndex: 'newApplyType',
      key: 'newApplyType',
      render: (text, obj) => (
        <div>{platformTypeArr[~~obj.platformType] || '--'}/{obj.shopName || '--'}</div>
      )
    },
    {
      title: window.intl.get('approvalDetailTable.type'),
      dataIndex: 'applyType',
      key: 'applyType',
      render: () => (
        // <div>{window.intl.get(`approvalDetail.${text.toLowerCase()}`)}</div>
        <div>{window.intl.get(`approvalDetail.apply`)}</div>
      )
    },
    {
      title: window.intl.get('approvalDetailTable.applyAmount'),
      dataIndex: 'applyAmount',
      key: 'applyAmount',
      render(text) {
        return Big(text).toFixed(2)
      }
    },
    {
      title: window.intl.get('approvalDetailTable.approvalAmount'),
      dataIndex: 'accessAmount',
      key: 'accessAmount',
      render(text) {
        return Big(text).toFixed(2)
      }
    },
    {
      title: window.intl.get('approvalDetailTable.shopAmount'),
      dataIndex: 'beforeAmount',
      key: 'beforeAmount',
      render(text, obj) {
        if (obj.applyStatus === 'Access') {
          text = ~~text + ~~obj.accessAmount
        }
        return Big(text).toFixed(2)
      }
    },
    {
      title: window.intl.get('approvalDetailTable.creditStatus'),
      dataIndex: 'applyStatus',
      key: 'applyStatus',
      render(item) {
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
      title: window.intl.get('approvalDetailTable.operator'),
      dataIndex: 'operater',
      key: 'operater',
    },
  ]

  UNSAFE_componentWillMount = async () => {
    let id = getQueryByLocation('id')
    this.userId = id
    this.getCreditApplyShopInfo()
    this.getCountOfShop()
    let username = getQueryByLocation('person')
    let sellerType = getQueryByLocation('sellerType')
    this.getSellerCreditInfo(id, undefined, username, sellerType)
  }

  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }

  async getCreditApplyShopInfo () {
    const { data = {} } = await getCreditApplyShopInfo({
      pageNum: this.state.page,
      pageSize: this.state.limit,
      userId: this.userId,
      userType: 'Seller'
    })
    let { list = [], total = 0 } = data
    this.setState({
      dataSource: list,
      total
    })
  }
  
  handleChangePagination = (page, limit) => {
    this.setState({
      page: page,
      limit: limit
    }, this.getCreditApplyShopInfo)
  }

  async getCheckList(shopId) {
    shopId = shopId || this.shopId
    const { data = {} } = await approvalCheckDetail({
      pageNum: this.state.dialogPage,
      pageSize: this.state.dialogLimit,
      // examineStatus: 'Applying',
      userId: this.userId,
      shopId,
      userType: 'Seller'
    })
    let { list = [], total: dialogTotal = 0 } = data
    this.setState({
      checkList: list,
      dialogTotal
    })
  }

  handleChangeDialogPagination = (page, limit) => {
    this.setState({
      dialogPage: page,
      dialogLimit: limit
    }, this.getCheckList)
  }

  async getCountOfShop () {
    const { data = 0 } = await getCountOfShop({
      userId: this.userId,
      userType: 'Seller'
    })
    this.setState({ shopCount: data })
  }

  showHistoryModal = async shopId => {
    this.getCheckList(shopId)
    this.shopId = shopId
    const { data = [] } = await getShopTotalAmount({
      userId: this.userId,
      userType: 'Seller',
      shopId
    })
    let totalAmountObj = {}
    totalAmountObj.total = data.reduce((acc, cur) => {
      return acc + cur['amount']
    }, 0)
    // eslint-disable-next-line
    for (let item of data) {
      totalAmountObj[item['applyType']] = item['amount']
    }
    this.setState({
      historyVisible: true,
      totalAmountObj
    });
  };

  async getSellerCreditInfo(sellerId, totalAmount, username, sellerType) {
    const { data = [] } = await getSellerCreditInfo(sellerId)
    let totalInfo = data.find(item => item.shopType === 'PERSONAL') || {}
    if (totalAmount !== undefined) { // 弹窗的信息
      totalInfo.totalAmount = totalAmount
      this.setState({ totalInfo })
    } else { // 主页面上部
      totalInfo.username = username
      totalInfo.sellerType = sellerType
      this.setState({ mainTatolInfo: totalInfo })
    }
  };
  
  showLimitModal = async (totalAmount, obj) => {
    this.getSellerCreditInfo(this.userId, totalAmount)
    this.currentData = obj
    this.setState({
      limitVisible: true,
    });
  };

  handleHistoryCancel = e => {
    this.setState({
      historyVisible: false,
    });
  };

  handleLimitCancel = () => {
    this.setState({
      limitVisible: false,
    });
  }

  changeLimit = async () => {
    let { platformType, shopName, shopId, newApplyType: applyType } = this.currentData
    const { data } = await changeLimit({
      userId: this.userId,
      userType: 'Seller',
      platformType,
      shopName,
      shopId,
      applyType,
      applyAmount: this.limitNum // 待修改
    })
    if (data) {
      message.success('调额成功')
      this.setState({
        limitVisible: false
      })
    } else {
      message.error('操作失败')
    }
  }

  limitNumChange (val) {
    this.limitNum = val
  }

  monthChange (m, dateString) {
    console.log(moment((dateString.replace('/', '') + '01')).format('YYYY-MM-DD HH:mm:SS'))
  }

  limitNum = 1000
  monthFormat = 'YYYY/MM';

  render () {
    return (
      <div className='approval-cont'>
        {/* <Spin size='large' spinning={this.state.showLoading}></Spin> */}
        <div className="header">
          <div className="title">{window.intl.get('creditApprovalList.view')}</div>
        </div>
        <div className="p-20 content">
          <div className="sub-title">{window.intl.get('approvalDetail.generalInfo')}</div>
          <div className="cont-item">
            <div className="label">{window.intl.get('approvalDetail.submitPerson')}：</div>
            <div className="value">{this.state.mainTatolInfo.username}</div>
          </div>
          <div className="cont-item">
            <div className="label">{window.intl.get('approvalDetail.sellerType')}：</div>
            <div className="value">{window.intl.get(`creditApprovalTable.${(this.state.mainTatolInfo.sellerType || '').toLowerCase()}`)}</div>
          </div>
          <div className="cont-item">
            <div className="label">{window.intl.get('approvalDetail.totalAmount')}：</div>
            <div className="value">$ {Big(this.state.mainTatolInfo.creditLimit || 0).toFixed(2)}</div>
          </div>
          <div className="cont-item">
            <div className="label">{window.intl.get('approvalDetail.usedAmount')}：</div>
            <div className="value">$ {Big(this.state.mainTatolInfo.usedCreditLimit || 0).toFixed(2)}</div>
          </div>
          <div className="cont-item">
            <div className="label">{window.intl.get('approvalDetail.availableAmount')}：</div>
            <div className="value">$ {Big(this.state.mainTatolInfo.freeCreditLimit || 0).toFixed(2)}</div>
          </div>
          <div className="cont-item">
            <div className="label">{window.intl.get('approvalDetail.authorizationShop')}：</div>
            <div className="value">{this.state.shopCount}</div>
          </div>
          <div className="mt-30 sub-title">{window.intl.get('approvalDetail.basicInfo')}</div>
          <Table rowKey="shopId" pagination={false} className="m-20" dataSource={this.state.dataSource} columns={this.columns} />
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

        <Modal
          width={960}
          title={window.intl.get('approvalDetail.changeHistory')}
          footer={null}
          visible={this.state.historyVisible}
          onCancel={this.handleHistoryCancel}
        >
          <div className="data-cont">
            <MonthPicker format={this.monthFormat} placeholder={window.intl.get('approvalDetail.chooseMonth')} onChange={this.monthChange} />
            <div className="ml-20 dt-1">
              {window.intl.get('approvalDetail.total')}：<span className="money">$ {Big(this.state.totalAmountObj['total'] || 0).toFixed(2)}</span>
            </div>
            <div className="dt-2">
              {window.intl.get('approvalDetail.promote')}：<span className="money">$ {Big(this.state.totalAmountObj['Promote'] || 0).toFixed(2)}</span>
            </div>
            <Divider type="vertical"></Divider>
            <div className="dt-3">
              {window.intl.get('approvalDetail.reduce')}：<span className="money">$ {Big(this.state.totalAmountObj['Reduce'] || 0).toFixed(2)}</span>
            </div>
          </div>
          <Table rowKey="applyId" pagination={false} className="mt-20" dataSource={this.state.checkList} columns={this.checkColumns} />
          <div className="mt-20 mb-20 pagination-cont">
            <Pagination
              showSizeChanger
              current={this.state.dialogPage}
              defaultPageSize={this.state.dialogLimit}
              total={this.state.dialogTotal}
              showTotal={() => `${window.intl.get('common.total')}  ${this.state.dialogTotal} ${window.intl.get('common.items')}`}
              onChange={this.handleChangeDialogPagination}
              onShowSizeChange={this.handleChangeDialogPagination}
            />
          </div>
          <div className="footer-cont">
            <Button type="primary" onClick={this.handleHistoryCancel}>取消</Button>
          </div>
        </Modal>

        <Modal
          width={575}
          title="调额"
          footer={null}
          visible={this.state.limitVisible}
          onCancel={this.handleLimitCancel}
        >
          <div className="data-cont">
            <div className="dt-1">
              账户总额度：<span className="money">$ {Big(this.state.totalInfo.creditLimit || 0).toFixed(2)}</span>
            </div>
            <div className="dt-2">
              已用额度：<span className="money">$ {Big(this.state.totalInfo.usedCreditLimit || 0).toFixed(2)}</span>
            </div>
            <Divider type="vertical"></Divider>
            <div className="dt-3">
              可用额度：<span className="money">$ {Big(this.state.totalInfo.freeCreditLimit || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-20 mb-20 data-cont">
            <div className="dt-it dt-4">
              <div className="label">当前店铺额度：</div>
              <span className="money">$ {Big(this.state.totalInfo.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-20 mb-20 data-cont">
            <div className="dt-it dt-5">
              <div className="label">调整额度：</div>
              <InputNumber
                defaultValue={this.limitNum}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.limitNumChange}
              />
            </div>
          </div>
          <div className="footer-cont">
            <Button onClick={this.handleLimitCancel}>取消</Button>
            <Button type="primary" onClick={this.changeLimit}>确定</Button>
          </div>
        </Modal>
      </div>
    )
  }
}

// 使用withRouter获取this.props.location
export default withRouter(Entrance)
