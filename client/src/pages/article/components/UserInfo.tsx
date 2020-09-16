import React from 'react'
import { View, Text,  Image} from '@tarojs/components';
import './userinfo.scss'

type UserInfoProp = {
  avatar: string
  username: string
}
export default function(props: UserInfoProp) {
  return (
    <View className='user-info'>
      <Image src={props.avatar}></Image>
      <Text>{props.username}</Text>
    </View>
  )
}