/*
 * @Author: 李步钻 
 * @Date: 2019-09-23 09:37:20 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-17 17:52:26
 */

import React from 'react';
import './CustomerManagement.scss';
import { Input, Select, Table, Pagination } from 'antd';
import { getSellerList, getSellerAccount } from '../../api/CustomerManagement.js';
import {withRouter} from 'react-router-dom';

const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = Select;

class SupplierManagement extends React.Component {
     constructor(props) {
         super(props);
         this.myRef = React.createRef();
         this.state = {
          sellerList: [], // 卖家列表数据
          sellerAccoutList: [], // 卖家账号数据
          loading: false,
          columns: [
            {
              title: window.intl.get('sellerManageList.sellerUsername'),
              dataIndex: 'loginName',
              width: '25%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('sellerManageList.contacter'),
              dataIndex: 'userName',
              width: '25%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('sellerManageList.contactPhone'),
              dataIndex: 'phone',
              width: '25%',
              render: this.hideRenderFunc
            },
            // {
            //   title: window.intl.get('sellerManageList.creditLimit'),
            //   dataIndex: 'storeAccount',
            //   width: '20%',
            //   render: (storeAccount) => (
            //       <div>
            //           <p>{window.intl.get('sellerManageList.IndividualStores')}: $ {storeAccount.personal?storeAccount.personal:0}</p>
            //           <p>{window.intl.get('sellerManageList.RentalStores')}: $ {storeAccount.rent?storeAccount.rent:0}</p>
            //       </div>
            //   )
            //   },
            {
              title: window.intl.get('sellerManageList.contactMail'),
              dataIndex: 'email',
              width: '25%',
              render: this.hideRenderFunc
            },
            {
              title: window.intl.get('sellerManageList.operating'),
              key: 'operation',
              fixed: 'right',
              width: 100,
              render: (text, record) => (<span className="operation-name" onClick = {() => this.handleOperation(record.id)}>{window.intl.get('common.view')}</span>),
            },
          ],
          currentPage: 1,
          pageSize: 10,
          total: null,
          selectValue: '1',
          queryOption: {
            id: undefined
          },
          inputContent: undefined
         }
     }

      hideRenderFunc (val) {
        return <div className='over-hide'>{val}</div>
      }

     render() {
         return (
           <div className="has-table-cont SupplierManagement supplier-cont">
                  <div className="header">
                    <div className="title">{window.intl.get('Menu.sellerManage')}</div>
                    <div className="search">
                        <InputGroup compact>
                            <Select defaultValue={this.state.selectValue} onChange={this.handleChangeSearch}>
                                <Option value="1">{window.intl.get('sellerManageList.contacter')}</Option>
                                <Option value="2">{window.intl.get('sellerManageList.contactMail')}</Option>
                                <Option value="3">{window.intl.get('sellerManageList.contactPhone')}</Option>
                            </Select>
                            <Search ref={this.myRef} style={{ width: '70%' }} onChange={this.handleInput} value={this.state.inputContent} allowClear placeholder={window.intl.get('common.searchPlaceholder')} onSearch={value => this.search(value,1)} enterButton />
                        </InputGroup>
                    </div>
                  </div>
                  <div className="content">
                    <div className="selectOption">
                        <Select showSearch  value={this.state.queryOption.id} allowClear style={{ width: 180 }} placeholder={window.intl.get('sellerManageList.sellerUsername')} filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }  onChange={this.handleChange}>
                            {
                              this.state.sellerAccoutList.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                            }
                        </Select>
                        <span className="reset"  onClick={this.handleClick}>{window.intl.get('common.reset')}</span>
                    </div>
                    <Table pagination={false} loading={this.state.loading} scroll={{ x: 1300 }} columns={this.state.columns} dataSource={this.state.sellerList}/>
                    {
                      !!(this.state.sellerList && this.state.sellerList.length) && (
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
      this.getSellerAccount()
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
            }
          }
        },()=>{
          this.search(this.state.inputContent,1)
        })
    }
   
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
      // this.props.history.push({ pathname : `/SellerDetails/${id}`})
      this.props.history.push({ pathname : `/Customer/SellerManagement/details`,state:{id}})
      // this.props.history.push({ pathname : `/Customer/SellerManagement/details`,query:{id}})

    }
    // 获取供应商列表数据
    async search(value,page) {
        this.setState({
          currentPage: page?page: this.state.currentPage,
          loading: true
        })
      let params = Object.assign({currentPage: page?page:this.state.currentPage,pageSize: this.state.pageSize,type:this.state.selectValue,content:value},this.state.queryOption)
      let {errorCode, data} = await getSellerList(params)
      if(errorCode === '100200') {
        data.list.forEach( item => {
          item.key = item.id
       })
        this.setState(() => {
          return {
            sellerList: data.list,
            total: data.totalCount,
            loading: false
          }
        })
      }
    }
    // 获取卖家账号数据
    async getSellerAccount() {
      let { errorCode, data = [] } = await getSellerAccount()
      if(errorCode === '100200') {
        let list = data.map( item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.setState(()=>{
          return{
            sellerAccoutList: list
          }
        })
      }
    }
 }
export default withRouter(SupplierManagement)
