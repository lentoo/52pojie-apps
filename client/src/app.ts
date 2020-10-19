import React, { Component } from 'react'
import Taro from '@tarojs/taro'

import { checkAppUpdate, users_db } from './utils'
import './app.scss'

class App extends Component {

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }

    Taro.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const { openid, unionid } = res.result as any
      Taro.setStorage({
        key: '_o',
        data: openid
      })
      Taro.setStorage({
        key: '_u',
        data: unionid
      })
      users_db.where({
        openid
      }).get().then(res => {
        if (res.data.length === 0) {
          users_db.add({
            data: {
              openid,
              unionid
            }
          })
        }
      })
    })
  }

  componentDidShow () {
    checkAppUpdate()
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
