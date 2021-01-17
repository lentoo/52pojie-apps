import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View} from '@tarojs/components';

import { AtCard } from 'taro-ui'
import { callCloudFunction as cf } from '../../../utils'

import './index.scss'
enum ANT_ACTIONS {
  GET_ANT_MANOR_ANSWER = 'get_ant_manor_answer'
}

type AntManorState = {
  antManorAnswer: {
    date: string,
    id: number,
    title: string,
    answer: string
  } []
}
export default class AntManor extends Component<{}, AntManorState> {
  constructor(props) {
    super(props)
    this.state = {
      antManorAnswer: []
    }
  }
  callCloudFunction = () => {
    cf({
      name: 'ant-manor',
      data: {
        action: ANT_ACTIONS.GET_ANT_MANOR_ANSWER
      }
    }).then(res => {
      console.log(res)
      this.setState({
        antManorAnswer: res.result as any
      })
    })
  }
  componentDidMount() {
    this.callCloudFunction()
  }

  render() {
    const { antManorAnswer } = this.state
    return (
      <View>
        {
          antManorAnswer.map(answer => {
            return (
              <AtCard
                note={answer.date}
                title={answer.title}
                key={answer.id}
              >
                {answer.answer}
              </AtCard>
            )
          })
        }
        
      </View>
    );
  }
}