import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'


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

  getPlateListData() {
    Taro.showLoading()
    Taro.cloud
      .callFunction({
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
      })
      .then(() => {
        Taro.hideLoading()
      })
  }

  handlePlateItemClick = (item: PlateItem) => {
    Taro.navigateTo({
      url: '/pages/article/detail?link='+item.link + '&type=article_detail'
    })
  }


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

  renderPlateItem(item: Plate) {
    return (
      <View className='plate'>
        <View className='plate-title'>
          <Text>{item.name}</Text>
          <Text className='plate-more'>更多<Text className='icon icon-arrow-right'></Text></Text>
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
        {this.renderSearchBox()}
        <View className='main'>
          {
            plate_list.map(item => (<View key={item.id}>{this.renderPlateItem(item)}</View>))
          }
        </View>
      </View>
    )
  }
}
