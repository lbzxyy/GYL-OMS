/*
 * @Author: 李步钻 
 * @Date: 2019-09-23 09:24:53 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-10-23 14:21:49
 */
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../utils/asyncComponent';

const Layout = asyncComponent(() => import("../components/layout/index"))
const Login = asyncComponent(() => import("pages/Entrance/login"))
const Entrance = asyncComponent(() => import("pages/Entrance/entrance"))
const FindPassword = asyncComponent(() => import("pages/Entrance/findPassword"))
const ChangePassword = asyncComponent(() => import("pages/Entrance/changePassword"))
const Home = asyncComponent(() => import("pages/Home/home"))

const SupplierManagement = asyncComponent(()=>import("pages/CustomerManagement/SupplierManagement"));
const SupplierDetails = asyncComponent(()=>import("pages/CustomerManagement/SupplierDetails"));
const SellerManagement = asyncComponent(()=>import("pages/CustomerManagement/SellerManagement"));
const SellerDetails = asyncComponent(()=>import("pages/CustomerManagement/SellerDetails"));
const CompanyInfo = asyncComponent(() => import("pages/SystemSetting/CompanyInfo"));
const CreditApproval = asyncComponent(() => import("pages/ApprovalManage/CreditApproval"));
const ApprovalDetail = asyncComponent(() => import("pages/ApprovalManage/ApprovalDetail"));
const CheckDetail = asyncComponent(() => import("pages/ApprovalManage/CheckDetail"));
const PaymentMethod = asyncComponent(() => import("pages/SystemSetting/PaymentMethod"));

export default class AppRouter extends React.Component {
    render() {
        let layoutRouter = (
            <Layout>
                <Switch>
                    <Route path='/' exact component = { Home }></Route>
                    <Route path='/Customer/SupplierManagement' title='无论风景' exact component={SupplierManagement} Breadcrumb={['客户管理', '供应商管理']}></Route>
                    {/* <Route path='/Customer/SupplierManagement/:userId' component = { SupplierDetails }></Route> */}
                    <Route path='/Customer/SupplierManagement/details' component = { SupplierDetails }></Route>
                    <Route path='/Customer/SellerManagement' exact component = { SellerManagement }></Route>
                    {/* <Route path='/SellerDetails/:userId' component = { SellerDetails }></Route> */}
                    <Route path='/Customer/SellerManagement/details' component = { SellerDetails }></Route>
                    <Route path='/System/CompanyInfo' component={ CompanyInfo }></Route>
                    <Route path='/System/PaymentMethod' component={ PaymentMethod }></Route>
                    <Route path='/Approval/CreditApproval' exact component={CreditApproval }></Route>
                    <Route path='/Approval/CreditApproval/detail' component={ApprovalDetail}></Route>
                    <Route path='/Approval/CreditApproval/check' component={CheckDetail}></Route>
                    <Redirect exact from='/login' to='/entrance/login'></Redirect>
                    <Redirect exact from='/findPassword' to='/entrance/findPassword'></Redirect>
                    <Redirect exact from='/changePassword' to='/entrance/changePassword'></Redirect>
                </Switch>
            </Layout>
        );
        let entranceRouter = (
            <Entrance>
                <Switch>
                    <Redirect exact from='/entrance' to='/entrance/login'></Redirect>
                    <Route path='/entrance/login' component={Login}></Route>
                    <Route path='/entrance/findPassword' component={FindPassword}></Route>
                    <Route path='/entrance/changePassword' render={props => requireAuth(ChangePassword, props)}></Route>
                </Switch>
            </Entrance>
        )
        
        // 登录验证
        const requireAuth = (Com, props) => {
            let pathname = props.location.pathname
            if (!localStorage.token && pathname !== '/login' && pathname !== '/entrance/login') { // 未登录
                return <Redirect to='/entrance/login' />
            } else {
                // 区分render和component的路由
                return typeof(Com) === 'object' ? Com : <Com {...props} />
            }
        }

        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/entrance' render={() => entranceRouter}></Route>
                    <Route path='/' component={props => requireAuth(layoutRouter, props)}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}