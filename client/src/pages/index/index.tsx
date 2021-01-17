import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Ad } from '@tarojs/components'
import './index.scss'
import { callCloudFunction } from '../../utils'

import { Plate, PlateItem} from '../../types'

type IndexComponentState= {
  plate_list: Plate[]
}
export default class Index extends Component<{}, IndexComponentState> {

  constructor(props) {
    super(props)
    this.state = {
      plate_list: []
    }
  }
  componentDidMount () { 
    this.getPlateListData()
  }
  onPullDownRefresh() {
    this.getPlateListData()
      .then(() => {
        Taro.stopPullDownRefresh()
      })
  }
  onShareAppMessage() {
    return {
      title: '吾爱破解',
      content: '吾爱破解论坛致力于软件安全与病毒分析的前沿，丰富的技术版块交相辉映，由无数热衷于软件加密解密及反病毒爱好者共同维护',
      path: '/pages/index/index'
    }
  }

  getPlateListData() {
    const _cache_result = Taro.getStorageSync('getPlateListData')
    if (_cache_result) {
      this.setState({
        plate_list: _cache_result
      })
      Taro.showNavigationBarLoading()
    } else {
      Taro.showLoading({
        title: '正在加载中...'
      })
    }
    return callCloudFunction({
        name: 'home',
        data: {
          action: 'get_home_page_data'
        }
      })
      .then(res => {
        console.log('res', res);
        this.setState({
          plate_list: res.result as Plate[]
        })
        Taro.setStorage({
          key: 'getPlateListData',
          data: res.result
        })
      })
      .then(() => {
        Taro.hideLoading()
        Taro.hideNavigationBarLoading()
      }).catch((err) => {
        Taro.getLogManager().warn(err)
        Taro.hideLoading()
        Taro.hideNavigationBarLoading()
      })
  }

  handlePlateItemClick = (item: PlateItem) => {
    Taro.navigateTo({
      url: '/pages/article/detail?link='+item.link + '&type=article_detail'
    })
  }

  handleMoreClick = (item: Plate) => {
    console.log('/pages/plate/list/index?link='+item.more_link + '&title=' + item.name);
    Taro.reportAnalytics('home_more', {
      plate_name: item.name
    })
    Taro.navigateTo({
      url: '/pages/plate/list/index?link='+ encodeURIComponent(item.more_link) + '&title=' + item.name
    })
  }


  renderSearchBox() {
    return (
      <View className='search-box'>
        <View className='search-container'>
          <Text className='icon icon-search' />
          <Input placeholder='请输入要搜索的内容' className='search-input' onConfirm={() => {
            Taro.showToast({
              title: '功能开发中',
              icon: 'none'
            })
          }} />
        </View>
      </View>
    )
  }

  renderPlateItem(item: Plate) {
    return (
      <View className='plate'>
        <View className='plate-title'>
          <Text>{item.name}</Text>
          <Text className='plate-more' onClick={() => this.handleMoreClick(item)}>更多<Text className='icon icon-arrow-right'></Text></Text>
        </View>
        <View className='plate-list'>
          {
            item.list.map((obj, index) => {
              return (
                <View className='plate-item' key={index} onClick={() => this.handlePlateItemClick(obj)}>
                  <Text className='plate-item-index'>{index + 1}</Text> <Text className='plate-item-title'>{obj.text}</Text>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }

  render () {
    const { plate_list } = this.state
    return (
      <View className='index'>
        {/* <Login/> */}
        {/* {this.renderSearchBox()} */}
        <View className='main'>
          {
            plate_list.map(item => (<View key={item.id}>{this.renderPlateItem(item)}</View>))
          }
        </View>
        <View style={{
          paddingLeft: Taro.pxTransform(20),
          paddingRight: Taro.pxTransform(20),
          paddingBottom: Taro.pxTransform(20),
        }}>
          <Ad unitId="adunit-c53a9cbab9e8669f" ad-intervals={30} onLoad={() => {
            Taro.reportAnalytics('ad', {
              type: '首页banner广告'
            })
          }} />
        </View>
      </View>
    )
  }
}
