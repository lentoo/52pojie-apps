import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'

import Login from '../../components/login/index'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  renderSearchBox() {
    return (
      <View className='search-box'>
        <View className='search-container'>
          <Text className='icon icon-search' />
          <Input placeholder='请输入要搜索的内容' className='search-input' />
        </View>
      </View>
    )
  }

  renderPlateItem() {
    return (
      <View className='plate'>
        <View className='plate-title'>
          <Text>新鲜出炉</Text>
          <Text className='plate-more'>更多<Text className='icon icon-arrow-right'></Text></Text>
        </View>
        <View className='plate-list'>
          <View className='plate-item'>
            <Text className='plate-item-index'>1</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>2</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>3</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>4</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>5</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>6</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>7</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>8</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>9</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
          <View className='plate-item'>
            <Text className='plate-item-index'>10</Text> <Text className='plate-item-title'>冒险之旅：十字军东征v1.55 官方中文版</Text>
          </View>
        </View>
      </View>
    )
  }

  render () {
    return (
      <View className='index'>
        {/* <Login/> */}
        {this.renderSearchBox()}
        {this.renderPlateItem()}
        {this.renderPlateItem()}
      </View>
    )
  }
}
