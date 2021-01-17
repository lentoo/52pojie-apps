import React, { useEffect, useRef, useState } from 'react'
import Taro, { usePageScroll } from '@tarojs/taro'
import { Button, Image } from '@tarojs/components'
import classnames from 'classnames'

import './index.scss'
import usePageScrollTopOrBottom from '../../hooks/usePageScroll'
type AnimateName = 'zoom'
interface FloatButtonProps {
  onClick?: () => void
  icon?: any
  bottom: number
  right: number
  className?: string
  animate?: boolean
  animateName?: AnimateName
}
export default function FloatButton(props: FloatButtonProps = { bottom: 100, right: 40 }) {
  const animate = props.animate
  const [animateName, setAnimateName] = useState('')
  usePageScrollTopOrBottom((y) => {
    if (animate) {
      setAnimateName('animate-' + props.animateName + 'In')
    }
  }, (y) => {
    if (animate) {
      setAnimateName('animate-' + props.animateName + 'Out')
    }
  })
  useEffect(() => {
    props.animate &&　setAnimateName('animate-' + props.animateName + 'In')
  }, [])
  
  return (
    <Button className={classnames('btn-float', props.className, {
      animate: props.animate,
    }, props.animate ? animateName : '')} onClick={props.onClick} style={{
      bottom: Taro.pxTransform(props.bottom),
      right: Taro.pxTransform(props.right),
    }}>
      <Image className='icon' src={props.icon} />
    </Button>
  )
}