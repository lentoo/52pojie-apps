import React, { useCallback, useState, useEffect } from 'react'
import Taro, { usePageScroll } from '@tarojs/taro'
import classnames from 'classnames'

import FloatButton from '../FloatButton'

import ICON_TO_TOP from '../../assets/images/commons/icon-to-top.png'

import './index.scss'

interface FloatButtonToTop {
  bottom?: number
  scrollTop?: number
  onClick?: () => void
}

export default function FloatButtonToTop(props: FloatButtonToTop) {
  const $scrollTop = props.scrollTop || 500
  const $bottom = props.bottom || 100
  const onClick = useCallback(() => {
    if (props.onClick) {
      props.onClick()
    } else {
      Taro.pageScrollTo({ scrollTop: 0, duration: 300 })    }
  }, [props.onClick])
  

  const [showToTopBtn, setShowToTopBtn] = useState<Boolean>(false)
  const [animate, setAnimate] = useState<Boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 1000)
  }, [])
  usePageScroll(({ scrollTop }) => {
    if (!showToTopBtn && scrollTop > $scrollTop) {
      setShowToTopBtn(true)
      return
    }

    if (showToTopBtn && scrollTop <= $scrollTop) {
      setShowToTopBtn(false)
    }
  })
  return (
    <FloatButton
      className={ classnames(animate && showToTopBtn ? 'ani-btn-to-top' : 'ani-btn-to-top-hidden')}
      icon={ICON_TO_TOP}
      right={-140}
      bottom={$bottom}
      onClick={onClick}
    />
  )
}