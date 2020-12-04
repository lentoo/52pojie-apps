import React, { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, Image } from "@tarojs/components";
import Taro, { useRouter, useReachBottom, usePullDownRefresh } from '@tarojs/taro';

import LoadingMore from '../../../components/LoadingMore'
import FloatButtonToTop from '../../../components/FloatButtonToTop'
import { callCloudFunction } from '../../../utils'

import ICON_VIEWS from '../images/icon-views.png'
import ICON_COMMENT from '../images/icon-comment.png'
import PlateItem, { IPlateItem } from '../../../components/PlateItem'
// import ICON_VIEWS from '../images/icon-views.png'
// import ICON_COMMENT from '../images/icon-comment.png'
import ICON_NEW from '../images/icon-new.png'
import './index.scss'
import { records_db } from '../../../utils';


enum PlateActions {
  GET_PLATE_LIST_DATA = 'get_plate_list_data',
  GET_PLATE_LIST_DATA_BY_GUIDE = 'get_plate_list_data_by_guide'
}

export default function PlateList() {
  
  const { title, plateId, link, reward } = useRouter().params

  const [ plate_list, setPlateList ] = useState<IPlateItem[]>([])
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: title || '' })
  }, [title])

  const fetchData = (page = 1) => {
    const requestData: any = { page }
    if (plateId) {
      requestData.plateId = plateId
    }
    if (link) {
      requestData.openUrl = link
    }
    if (reward) {
      requestData.reward = Number(reward) 
    }
    return callCloudFunction({
      name: 'plate',
      data: {
        action: link ? PlateActions.GET_PLATE_LIST_DATA_BY_GUIDE : PlateActions.GET_PLATE_LIST_DATA,
        data: requestData
      }
    }).then(res => {
      if (page === 1) {
        setPlateList(res.result as IPlateItem[])
      } else {
        setPlateList([...plate_list, ...res.result as IPlateItem[]])
      }
    })
  }

  useEffect(() => {
    Taro.showLoading({
      title: 'Loading'
    })
    fetchData()
      .then(() => {
        Taro.hideLoading()
      })
      .catch(err => {
        Taro.hideLoading()
      })
  }, [])

  const page = useRef<number>(1)
  useReachBottom(() => {
    page.current++
    fetchData(page.current)
  })

  usePullDownRefresh(() => {
    page.current = 1
    fetchData()
    .then(() => {
      Taro.stopPullDownRefresh()
    })
    .catch(err => {
      Taro.stopPullDownRefresh()
    })
  })

  const handleItemClick = useCallback((item: IPlateItem) => {
    Taro.navigateTo({
      url: '/pages/article/detail?link=' + encodeURIComponent(item.link)
    })
    const _o = Taro.getStorageSync('_o')
    records_db.where({
      _o,
      title: item.title
    }).get().then(result => {
      if (result.data.length) {
        records_db.doc(result.data[0]._id!)
          .remove({
            
          }).then(() => {
            records_db.add({
              data: {
                _o,
                date: Date.now(),
                ...item
              }
            })
          })
      } else {
        records_db.add({
          data: {
            _o,
            date: Date.now(),
            ...item
          }
        })
      }
    })
    
  }, [])

  
  return (
    <View>
      <View className='plate-list'>
        {
          plate_list.map(item => {
            return <PlateItem key={'index' + item.id} item={item} handleItemClick={handleItemClick} />
          })
        }
        <LoadingMore loadingText={'正在加载中'} />
      </View>
      <FloatButtonToTop />
      {/* <FloatButton 
        // className={ classnames(animate && showToTopBtn ? 'ani-btn-to-top' : 'ani-btn-to-top-hidden')}
        bottom={100}
        right={40}
        icon={ICON_TO_TOP}
        onClick={() => {
          Taro.pageScrollTo({ scrollTop: 0, duration: 300 })
        }}
      /> */}
      
    </View>
  )
}