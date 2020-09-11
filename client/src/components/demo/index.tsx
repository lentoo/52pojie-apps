import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text , Button} from '@tarojs/components';

export default class Demo extends Component {

  state={}
  callCloudFunction = () => {
    Taro.cloud.callFunction({
      name: 'home',
      data: {}
    }).then(res => {
      console.log(res)
    })
  }

  render() {
    return (
      <View>
          <Button onClick={() => this.callCloudFunction()}>Call Cloud Function</Button>
      </View>
    );
  }
}