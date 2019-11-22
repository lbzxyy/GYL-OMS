export const menus = [
    // 菜单相关路由
    { key: '/', title: 'overview', icon: 'iconfont icon-shouye', breadcrumbs:['概览']},
    // {
    //     key: '/Approval',
    //     title: 'approvalManage',
    //     icon: 'iconfont icon-kehuguanli',
    //     subs: [
    //         { key: '/Approval/CreditApproval', icon: 'iconfont icon-dakaifenlei', title: 'creditApproval', breadcrumbs: ['customerManage','supplierManage']}
    //         // { key: '/Customer/SellerManagement',icon: 'iconfont icon-dakaifenlei', title: 'sellerManage', breadcrumbs: ['customerManage','sellerManage']}
    //     ]
    // },
    {
        key: '/Customer',
        title: 'customerManage',
        icon: 'iconfont icon-kehuguanli',
        subs: [
            { key: '/Customer/SupplierManagement',icon: 'iconfont icon-dakaifenlei', title: 'supplierManage', breadcrumbs: ['customerManage','supplierManage']},
            { key: '/Customer/SellerManagement',icon: 'iconfont icon-dakaifenlei', title: 'sellerManage', breadcrumbs: ['customerManage','sellerManage']}
        ]
    },
    {
        key: '/System',
        title: 'systemSetting',
        icon: 'iconfont icon-xitongshezhi',
        subs: [
            { key: '/System/CompanyInfo',icon: 'iconfont icon-dakaifenlei', title: 'companyInfo'},
            { key: '/System/PaymentMethod',icon: 'iconfont icon-dakaifenlei', title: 'paymentMethod' },

        ]
    }
    
 ]
 // 非菜单路由 子页面 如详情页
 export const others = [
     { key: '/Customer/SupplierManagement/details', title: '查看', breadcrumbs: ['customerManage','supplierManage','detail']},
     { key: '/Customer/SellerManagement/details', title: '查看', breadcrumbs: ['customerManage','sellerManage','detail']}
 ]

// 路由
 export const routes = [
    // 菜单相关路由
    { key: '/', title: 'overview', icon: 'iconfont icon-shouye', breadcrumbs:['概览']},
    {
        key: '/Customer',
        title: 'customerManage',
        icon: 'iconfont icon-kehuguanli',
        subs: [
            { 
            key: '/Customer/SupplierManagement',
            icon: 'iconfont icon-dakaifenlei', 
            title: 'supplierManage', 
            breadcrumbs: ['customerManage','supplierManage'],
            subs: [
                { key: '/Customer/SupplierManagement/details', title: 'supplierDetails', breadcrumbs: ['customerManage','supplierManage','detail']},
            ]
        },
        { 
            key: '/Customer/SellerManagement',
            icon: 'iconfont icon-dakaifenlei', 
            title: 'sellerManage', 
            breadcrumbs: ['customerManage','sellerManage'],
            subs: [
             { key: '/Customer/SellerManagement/details', title: 'sellerDetails', breadcrumbs: ['customerManage','sellerManage','detail']}
            ]
        }
        ]
    },
    {
        key: '/System',
        title: 'systemSetting',
        icon: 'iconfont icon-xitongshezhi',
        subs: [
            { key: '/System/CompanyInfo',icon: 'iconfont icon-dakaifenlei', title: 'companyInfo', breadcrumbs: ['systemSetting','companyInfo'] },
            { key: '/System/PaymentMethod',icon: 'iconfont icon-dakaifenlei', title: 'paymentMethod' },

        ]
    }
    
 ]
   
