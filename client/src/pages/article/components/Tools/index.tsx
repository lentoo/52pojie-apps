import React, { useState, useCallback } from 'react'
import { View, Image } from '@tarojs/components'
import classnames from 'classnames'

import './index.scss'
import ICON_IMAGE from './images/icon-image.png'
import ICON_LINK from './images/icon-link.png'
import ICON_PAN from './images/icon-pan.png'

type ToolsProps = {
  open: boolean
  onModalClick: () => void
  onToolsItemClick: (command: string) => void
}

export default function Tools(props: ToolsProps) {
  const toolsList = [
    {
      src: ICON_IMAGE,
      text: '查看大图',
      command: 'tools-image'
    },
    {
      src: ICON_LINK,
      text: '网页链接',
      command: 'tools-copy-link'
    },
    {
      src: ICON_PAN,
      text: '云盘链接',
      command: 'tools-pan-link'
    }
  ]
  const onToolsItemClick = useCallback((item) => {
    props.onToolsItemClick(item.command)
  }, [props.onToolsItemClick])

  const [init, setInit] = useState(false)
  return (
    <View className={classnames('tools', {
      open: props.open,
      close: !props.open && init
    })}>
      <View className='tools-modal' onClick={props.onModalClick} onAnimationEnd={() => {
        setInit(true)
      }}></View>
      <View className='tools-popup'>
        <View className='tools-list'>
          {
            toolsList.map((item, index) => {
              return (
                <View key={index} className='tools-item' onClick={() => onToolsItemClick(item)}>
                  <Image className='tools-item-image' src={item.src} />
                  <View>{item.text}</View>
                </View>
              )
            })
          }
        </View>
      </View>
    </View>
  )
}

