/*
 * @Author: 李步钻 
 * @Date: 2019-09-21 12:49:59 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-17 17:44:05
 */
import React from 'react';
import './CustomerManagement.scss';
import { Input, Select, Table, Pagination } from 'antd';
import { getSupplyList, getSupplyAccount } from '../../api/CustomerManagement.js';

const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = Select;

 export default class SupplierManagement extends React.Component {
     constructor(props) {
         super(props)
         this.myRef = React.createRef();
         this.state = {
          supplyList: [], // 供应商列表数据
          supplyAccoutList: [], // 供应商账号数据
          loading: false,
          rowId: '',
          columns: [
            {
              title: window.intl.get('supplierManageList.supplierUsername'),
              dataIndex: 'loginName',
              // width: '10%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('supplierManageList.companyName'),
              dataIndex: 'companyNameUser',
              // width: '20%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('supplierManageList.contacter'),
              dataIndex: 'userName',
              // width: '10%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('supplierManageList.conractPhone'),
              dataIndex: 'phone',
              // width: '20%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('supplierManageList.contactMail'),
              dataIndex: 'email',
              // width: '20%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('supplierManageList.payPeriod'),
              dataIndex: 'closedCircle',
              // width: '10%',
              render (val) {
                return <div className='over-hide'>{window.intl.get(`settlement.${val}`)}</div>
              }
            },
            
            {
              title: window.intl.get('supplierManageList.operating'),
              key: 'operation',
              fixed: 'right',
              width: 100,
              render: (text, record) => (<span className="operation-name" onClick = {() => this.handleOperation(record.id)}>{window.intl.get('common.view')}</span>),
            },
          ],
          currentPage: 1,
          pageSize: 10,
          total: null,
          selectValue: 'companyName',
          inputContent: undefined,
          queryOption: {
            id: undefined,
          }
         }
     }

   hideRenderFunc(val) {
     return <div className='over-hide'>{val}</div>
   }
 
     render() {
         return (
              <div className="has-table-cont SupplierManagement">
                  <div className="header">
                  <div className="title">{window.intl.get('Menu.supplierManage')}</div>
                    <div className="search">
                        <InputGroup compact>
                            <Select  defaultValue={this.state.selectValue} onChange={this.handleChangeSearch}>
                                <Option value="companyName">{ window.intl.get('supplierManageList.companyName')}</Option>
                            </Select>
                            <Search  ref={this.myRef} style={{ width: '70%' }} value={this.state.inputContent} onChange={this.handleInput}  allowClear placeholder={window.intl.get('common.searchPlaceholder')} onSearch={value => this.search(value,1)} enterButton />
                        </InputGroup>
                    </div>
                  </div>
                  <div className="content">
                    <div className="selectOption">
                        <Select showSearch  value={this.state.queryOption.id} allowClear style={{ width: 180 }} placeholder={window.intl.get('supplierManageList.supplierUsername')}  filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          } onChange={this.handleChange}>
                           {
                             this.state.supplyAccoutList.map( item => 
                               <Option key={item.value} value={item.value}>{item.label}</Option>
                             )
                           }
                        </Select>
                        <span className="reset" onClick={this.handleClick}>{window.intl.get('common.reset')}</span>
                    </div>
                    <Table pagination={false} columns={this.state.columns}  
                    loading={this.state.loading}
                    scroll={{ x: 1300 }}
                    dataSource={this.state.supplyList} />
                    {
                      !!(this.state.supplyList && this.state.supplyList.length) && (
                      <div className="pagination">
                        <Pagination
                          showSizeChanger
                          defaultCurrent={this.state.currentPage}
                          current={this.state.currentPage}
                          total={this.state.total}
                          onShowSizeChange={this.onShowSizeChange}
                          showTotal={() => `${window.intl.get('common.total')}  ${this.state.total} ${window.intl.get('common.items')}`}
                          onChange={this.handleChangePagination}
                        />
                      </div>
                      )
                    }
                   
                  </div>
              </div>
         );
     }
    componentDidMount() {
      this.getSupplyAccount()
      this.search()
    }
    componentWillUnmount(){
      // 卸载异步操作设置状态
      this.setState = (state, callback) => {
          return;
      }
  }
    // 重置
    handleClick = () =>{
      this.setState(()=>{
        return {
          queryOption: {
            id: undefined
          },
          inputContent: undefined
        }
      },()=>{
        this.search()
      })
    }
     // 搜索框前 下拉框事件
    handleChangeSearch = (value) => {
      this.setState(()=>{
        return{
          selectValue: value
        }
      },()=>{
        this.search()
      })
    }
    // 输入框事件
    handleInput = (e) => {
      if(e.type !== 'change') {
        this.setState(()=>{
          return{
            inputContent: undefined
          }
        })
       return
      }
      this.setState(()=>{
        return{
          inputContent: this.myRef.current.input.input.value
        }
      })
    }
   // 下拉框事件
   handleChange = (value) => {
    this.setState(()=>{
      return{
        queryOption: {
          id: value
        },
      }
    },()=>{
      this.search(this.state.inputContent,1)
    })
}
// 分页器事件
  handleChangePagination = (page, pageSize) => {
      this.setState( () => {
        return{
          currentPage: page,
          pageSize
        }
      },()=>{
        this.search(this.state.inputContent)
      })
    }
    onShowSizeChange = (current, size) => {
      this.setState( () => {
        return{
          currentPage: current,
          pageSize: size
        }
      },()=>{
        this.search(this.state.inputContent)
      })
    }
    handleOperation = (id) => {
      // this.props.history.push({ pathname : `/SupplierDetails/${id}`})
      this.props.history.push({ pathname: `/Customer/SupplierManagement/details`,state:{id}})
    }
    // 获取供应商列表数据
    async search(value,page) {
        this.setState({
          currentPage: page?page: this.state.currentPage,
          loading: true
        })
      let params = Object.assign({currentPage: page?page:this.state.currentPage,pageSize: this.state.pageSize,[this.state.selectValue]:value},this.state.queryOption)
      let {errorCode, data} = await getSupplyList(params)
      if(errorCode === '100200') {
        this._dealDataList(data)
        this.setState(() => {
          return {
            supplyList: data.list,
            total: data.totalCount,
            loading: false
          }
        })
      }
    }
     // 获取供应商账号数据
     async getSupplyAccount() {
      let { errorCode, data = [] } = await getSupplyAccount()
      if(errorCode === '100200') {
        let list = data.map( item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.setState(()=>{
          return{
            supplyAccoutList: list
          }
        })
      }
    }
    _dealDataList(data) {
      // 结算周期 closedCircle  1：周结 2：半月结 3：月结 4:实时结算 5:账期结算
      data.list.forEach( item => {
        item.key = item.id
        switch (item.closedCircle) {
          case '1':
            item.closedCircle = 'weekly'
            break;
          case '2':
            item.closedCircle = 'monthHalf'
            break;
          case '3':
            item.closedCircle = 'monthly'
            break;
          case '4':
            item.closedCircle = 'timely'
            break;
          case '5':
            item.closedCircle = 'account'
            break;
          default:
            break;
        }
     })
    }
   
 }