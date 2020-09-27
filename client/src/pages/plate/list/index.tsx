import React, { useEffect } from 'react'
import { View } from "@tarojs/components";
import Taro, { useRouter } from '@tarojs/taro';

enum PlateActions {
  GET_PLATE_LIST_DATA = 'get_plate_list_data'
}
export default function PlateList() {
  
  const { title, plateId } = useRouter().params

  useEffect(() => {
    Taro.setNavigationBarTitle({ title })
  }, [])

  useEffect(() => {
    Taro.cloud.callFunction({
      name: 'plate',
      data: {
        action: PlateActions.GET_PLATE_LIST_DATA,
        data: {
          plateId: plateId
        }
      }
    }).then(res => {
      console.log(res.result)
    })
  }, [])
  return (
    <View>
      123321
    </View>
  )
}