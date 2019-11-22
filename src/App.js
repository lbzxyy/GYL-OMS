import React from 'react';
import AppRouter from './router/index';
import intl from 'react-intl-universal';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
window.intl = intl

const locales = {
  "en": require('./locales/en-US.json'),
  "zh": require('./locales/zh-CN.json'),
};
export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      initDone: false,
    };
  }
  //WARNING! To be deprecated in React v17. Use componentDidMount instead.
  UNSAFE_componentWillMount() {
    let lang =(navigator.language || navigator.browserLanguage).toLowerCase();
    if(lang.indexOf('zh')>=0)
    {
      // 假如浏览器语言是中文
      localStorage.setItem("defaultLng","zh")
    }else{
      // 假如浏览器语言是其它语言
      localStorage.setItem("defaultLng","en")
    }
  }
  componentDidMount() {
    this.loadLocales();
  }

  loadLocales() {
    intl.init({
      currentLocale: localStorage.getItem('locale') || localStorage.getItem("defaultLng") ||  'zh', 
      locales,
    })
    .then(() => {
	  this.setState({initDone: true});
    });
  }

  render() {
    return (
      <ConfigProvider locale={localStorage.getItem('locale')?(localStorage.getItem('locale')==='zh'?zhCN:enUS):zhCN}>
        <div style={{height: '100%'}}>
          {this.state.initDone && <AppRouter />}
        </div>
      </ConfigProvider>
    );
  }
}
