import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.scss'

import ICON_ORIGINAL from './images/icon-original.png'
import ICON_SOFTWARE from './images/icon-software.png'
import ICON_WATER from './images/icon-water.png'
import ICON_VIRUS from './images/icon-virus.png'
import ICON_WELFARE from './images/icon-welfare.png'
import ICON_SAFETY from './images/icon-safety.png'
import ICON_CODE from './images/icon-code.png'
import ICON_ANIMATE from './images/icon-animate.png'
import ICON_UTIL from './images/icon-util.png'
import ICON_EGG from './images/icon-egg.png'
import ICON_REVERSE from './images/icon-reverse.png'
import ICON_VIRUS_ANALYSIS from './images/icon-virus-analysis.png'
import ICON_REWARD from './images/icon-reward.png'

import './index.scss'
type PlateItem = {
  src: any
  text: string
  url?: string
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
          src: ICON_REWARD,
          url: 'https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=8&filter=specialtype&specialtype=reward&rewardtype=1',
          id: 0,
          text: '悬赏专区'
        },
        {
          src: ICON_SOFTWARE,
          text: '精品软件区',
          id: 16
        },
        {
          src: ICON_REVERSE,
          text: '逆向资源区',
          id: 4
        },
        {
          src: ICON_WATER,
          text: '水漫金山区',
          id: 10
        },
        {
          src: ICON_VIRUS,
          text: '病毒救援区',
          id: 50
        },
        // {
        //   src: ICON_WELFARE,
        //   text: '福利经验区',
        //   id: 66
        // },
        {
          src: ICON_EGG,
          text: '脱壳破解区',
          id: 5
        },
        {
          src: ICON_SAFETY,
          text: '移动安全区',
          id: 65
        },
        {
          src: ICON_VIRUS_ANALYSIS,
          text: '病毒分析区',
          id: 32
        },
        {
          src: ICON_CODE,
          text: '编程语言区',
          id: 24
        },
        {
          src: ICON_ANIMATE,
          text: '动画发布区',
          id: 6
        },
        {
          src: ICON_UTIL,
          text: '安全工具区',
          id: 41
        }
      ]
    }
  }
  handleIconClick = (item: PlateItem) => {
    Taro.reportAnalytics('all_plate', {
      plate_name: item.text
    })
    if (item.url) {
      Taro.navigateTo({
        url: `/pages/plate/list/index?reward=1&title=${item.text}&link=${encodeURIComponent(item.url)}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/plate/list/index?plateId=${item.id}&title=${item.text}`
      })
    }
  }
  render () {
    const { plate_list } = this.state
    return (
      <View>
        {/* <Swiper>
          <SwiperItem>1</SwiperItem>
        </Swiper> */}

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