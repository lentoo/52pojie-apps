import React, { Component } from 'react'
import Taro from '@tarojs/taro'

import { checkAppUpdate } from './utils'
import './app.scss'

class App extends Component {

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }

    Taro.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const { openid, appid, unionid } = res.result as any
      const db = Taro.cloud.database()
      const users = db.collection('users')
      users.where({
        openid
      }).get().then(res => {
        if (res.data.length === 0) {
          users.add({
            data: {
              openid,
              appid,
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
