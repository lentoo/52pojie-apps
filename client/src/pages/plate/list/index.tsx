import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, Image } from "@tarojs/components";
import Taro, { useRouter, useReachBottom } from '@tarojs/taro';
import LoadingMore from '../../../components/LoadingMore'
import ICON_VIEWS from '../images/icon-views.png'
import ICON_COMMENT from '../images/icon-comment.png'
import './index.scss'


enum PlateActions {
  GET_PLATE_LIST_DATA = 'get_plate_list_data'
}
interface PlateItem {
  id: string
  type: string
  title: string
  link: string
  author: string
  post_date: string
  commentNum: string
  viewNum: string
  hasHot: boolean
  hasNew: boolean
  hasRecommend: boolean
}
export default function PlateList() {
  
  const { title, plateId } = useRouter().params

  const [ plate_list, setPlateList ] = useState<PlateItem[]>([])
  useEffect(() => {
    Taro.setNavigationBarTitle({ title })
  }, [])

  const fetchData = (page = 1) => {
    return Taro.cloud.callFunction({
      name: 'plate',
      data: {
        action: PlateActions.GET_PLATE_LIST_DATA,
        data: {
          plateId: plateId,
          page
        }
      }
    }).then(res => {
      setPlateList([...plate_list, ...res.result as PlateItem[]])
    })
  }

  useEffect(() => {
    Taro.showLoading({
      title: 'loading'
    })
    fetchData()
      .then(() => {
        Taro.hideLoading()
      })
      .catch(err => {
        Taro.hideLoading()
      })
  }, [])

  const handleItemClick = useCallback((item: PlateItem) => {
    Taro.navigateTo({
      url: '/pages/article/detail?link=' + item.link
    })
  }, [])

  const page = useRef<number>(1)
  useReachBottom(() => {
    page.current++
    fetchData(page.current)
  })
  return (
    <View>
      <View className='plate-list'>
        {
          plate_list.map(item => {
            return <View key={item.id} className='plate-item' onClick={() => handleItemClick(item)}>
              <View className='plate-top'>
                <View className='plate-item-username'>
                  {item.author}
                </View>
                { item.type && 
                <View className='plate-item-type'>
                  [{item.type}]
                </View>
                }
              </View>
              
              <View className='plate-item-title'><Text>{item.title}</Text></View>
              
              <View className='plate-bottom'>
                <View className='plate-item-date'>{item.post_date}</View>
                <View className='plate-item-commend'>
                  <Image className='plate-item-icon plate-item-icon-comment' src={ICON_COMMENT} />
                  <Text>{item.commentNum}</Text>
                </View>
                <View className='plate-item-views'>
                  <Image className='plate-item-icon' src={ICON_VIEWS} />
                  <Text>{item.viewNum}</Text>
                </View>
              </View>
            </View>
          })
        }
        <LoadingMore loadingText={'正在加载中'} />
      </View>
      
    </View>
  )
}