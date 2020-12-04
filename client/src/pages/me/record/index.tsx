import React, { useCallback, useEffect, useRef, useState } from 'react'
import Taro, { useReachBottom } from '@tarojs/taro'
import { AtSwipeAction } from "taro-ui"
import { View } from "@tarojs/components";


import LoadingMore from '../../../components/LoadingMore'
import PlateItem, { IPlateItem } from '../../../components/PlateItem'
import { records_db } from '../../../utils';
import './index.scss'

interface Record extends IPlateItem {
  _o: string
  _id?: string
  date: number
}
export default function RecordPage() {
  const page = useRef(1)
  const limit = 10
  const [ loadingText, setLoadingText ] = useState('正在加载中')
  const [ list, setList ] = useState<Record[]>([])
  function getRecords() {
    const _o = Taro.getStorageSync('_o')
    records_db.where({
      _o
    })
      .orderBy('date', 'desc')
      .skip((page.current - 1) * limit)
      .limit(limit)
      .get()
      .then((result) => {
        console.log(result.data);
        if (result.data.length < limit) {
          setLoadingText('没有更多了')
        }
        setList(list.concat(result.data as Record[]))
      })
  }

  useEffect(() => {
    getRecords()
  }, [])

  useReachBottom(() => {
    page.current += 1
    getRecords()
  })

  const handleItemClick = useCallback((item: Record) => {
    Taro.navigateTo({
      url: '/pages/article/detail?link=' + encodeURIComponent(item.link)
    })
  }, [])
  
  const handleActionClick = useCallback((e, item: Record) => {
    if (e.text === '删除') {
      records_db.where({
        _id: item._id!
      }).get()
        .then(result => {
          if (result.data.length) {
            records_db.doc(result.data[0]._id!)
            .remove({})
            .then(() => {
              Taro.showToast({
                title: '成功',
                icon: 'success'
              })
              setList(prevList => prevList.filter(obj => obj._id !== item._id))
            })
          }
        })
    }
  }, [])
  return (<View className='record-list'>
    {
      list.map(item => {
        return (
          <AtSwipeAction autoClose onClick={(e) => handleActionClick(e, item)} options={[
            {
              text: '删除',
              style: {
                backgroundColor: '#FF4949'
              }
            }
          ]}>
            <PlateItem  key={'index_' + item.id} item={item} handleItemClick={handleItemClick} />
          </AtSwipeAction>
        )
      })
    }
    <LoadingMore loadingText={loadingText}  />
  </View>)
}