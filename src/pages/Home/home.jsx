/*
 * @Author: 李步钻 
 * @Date: 2019-09-23 09:24:41 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-09-27 22:30:57
 */
import React from 'react';
import BgImg from '../../assets/img/Bitmap.png';
// import intl from 'react-intl-universal';

import './home.scss';

export default class Home extends React.Component {
    render() {
        return (
            <div className="homeContent">
                <div className="Info">
                    {/* <p style={{color:'red',fontSize: '20px'}}>{ intl.get('TEST') }</p> */}
                    <p className="title-cn">让生产管理更智能 · 让供应链协同更方便 </p>
                    <p className="title-en">Make production management smarter · Make supply chain collaboration more convenient</p>
                </div>
                <img className="bgImg" alt="" src={ BgImg }></img>
            </div>
        )
    }
}