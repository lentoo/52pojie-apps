import React from 'react'
import { Text, View } from "@tarojs/components";

import './index.scss'

interface LoadingMoreProp {
  loadingText: string
}

export default function LoadingMore(props: LoadingMoreProp) {
  return (
    <View className='loading-more'>
      <Text>{props.loadingText || '正在加载中'}</Text>
    </View>
  )
}