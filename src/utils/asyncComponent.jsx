/*
 * @Author: 李步钻 
 * @Date: 2019-09-23 09:56:33 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-09-23 10:22:10
 */
import React from 'react';
/**
 * 异步加载组件
 * @param {*} importComponent 
 */

export default function asyncComponent(importComponent) {
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                component: null
            }
        }
        async componentDidMount() {
           let { default: component} = await importComponent()
           this.setState({ component })
        }
        render() {
          const C = this.state.component;
          return C? <C { ...this.props } />: null
        }
    }
    return AsyncComponent
}
