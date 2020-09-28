import React from 'react'
import Taro from '@tarojs/taro'
import { Button, Image } from '@tarojs/components'
import classnames from 'classnames'

import './index.scss'
interface FloatButtonProps {
  onClick?: () => void
  icon?: any
  bottom: number
  right: number
  className?: string
}
export default function FloatButton(props: FloatButtonProps = { bottom: 100, right: 40 }) {
  
  return (
    <Button className={classnames('btn-float', props.className)} onClick={props.onClick} style={{
      bottom: Taro.pxTransform(props.bottom),
      right: Taro.pxTransform(props.right),
    }}>
      <Image className='icon' src={props.icon} />
    </Button>
  )
}