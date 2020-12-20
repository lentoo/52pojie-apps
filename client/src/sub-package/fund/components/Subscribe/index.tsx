import React, { Component } from 'react'
import { View, Button, Image } from '@tarojs/components'
import './index.scss'
const ICON_CLOSE = 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/fund/icon-gb.png'

interface SubscribeProps {
  onClose?: () => void
  onSubscribe?: () => void
}

export default function Subscribe(props: SubscribeProps) {
  return (
    <View className='subscribe'>
      <View className='subscribe-text'>
        不在小程序时，收盘估值、今日净值更新通知我
      </View>
      <View className='subscribe-right'>
        <Button className='btn' onClick={props.onSubscribe}>通知我</Button>
        <Image className="icon-close" src={ICON_CLOSE} onClick={props.onClose}></Image>
      </View>
    </View>
  )
}