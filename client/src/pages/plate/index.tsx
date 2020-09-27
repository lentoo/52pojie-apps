import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.scss'

import ICON_ORIGINAL from './images/icon-original.png'
import ICON_SOFTWARE from './images/icon-software.png'

import './index.scss'
type PlateItem = {
  src: any
  text: string
  id: string | number
}
type PlateState = {
  plate_list: PlateItem[]
}
export default class Index extends Component<{}, PlateState> {
  constructor(prop) {
    super(prop)
    this.state = {
      plate_list: [
        {
          src: ICON_ORIGINAL,
          text: '原创发布区',
          id: 2,
        },
        {
          src: ICON_SOFTWARE,
          text: '精品软件区',
          id: 16
        },
        {
          src: ICON_ORIGINAL,
          text: '逆向资源区',
          id: 4
        },
        {
          src: ICON_ORIGINAL,
          text: '水漫金山区',
          id: 10
        },
        {
          src: ICON_ORIGINAL,
          text: '病毒救援区',
          id: 50
        },
        {
          src: ICON_ORIGINAL,
          text: '福利经验区',
          id: 66
        },
        {
          src: ICON_ORIGINAL,
          text: '脱壳破解区',
          id: 5
        },
        {
          src: ICON_ORIGINAL,
          text: '移动安全区',
          id: 65
        },
        {
          src: ICON_ORIGINAL,
          text: '病毒分析区',
          id: 32
        },
        {
          src: ICON_ORIGINAL,
          text: '编程语言区',
          id: 24
        },
        {
          src: ICON_ORIGINAL,
          text: '动画发布区',
          id: 6
        },
        {
          src: ICON_ORIGINAL,
          text: '安全工具区',
          id: 41
        }
      ]
    }
  }
  handleIconClick = (item: PlateItem) => {
    Taro.navigateTo({
      url: `/pages/plate/list/index?plateId=${item.id}&title=${item.text}`
    })    
  }
  render () {
    const { plate_list } = this.state
    return (
      <View>
        <Swiper>
          <SwiperItem>1</SwiperItem>
        </Swiper>

        <View className='plate-list'>
          {
            plate_list.map(item => {
              return (
                <View key={item.id} className='plate-item' onClick={() => this.handleIconClick(item)}>
                  <Image className='plate-item-image' src={item.src}></Image>
                  <View className='plate-item-text'>
                    <Text>{item.text}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}