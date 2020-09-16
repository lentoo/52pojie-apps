import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button, RichText, Text} from '@tarojs/components';

import './detail.scss'
import { Article, } from 'src/types/plate';
import UserInfo from './components/UserInfo'

type ArticleDetailProp = {
  link: string
  type: string
}
type ArticleDetailState = {
  result?: Article
}

export default class ArticleDetail extends Component<ArticleDetailProp, ArticleDetailState> {
  constructor(props) {
    super(props)
    this.state = {
      result: undefined
    }
  }
  componentDidMount() {
    this.fetchData()
  }
  fetchData() {
    const link = getCurrentInstance().router?.params.link
    if (!link) {
      Taro.showToast({
        title: '参数有误'
      })
      return
    }
    Taro.showLoading({
      title: 'Loading'
    })
    Taro.showNavigationBarLoading()

    Taro.cloud.callFunction({
      name: 'home',
      data: {
        action: 'get_article_detail_data',
        url: link,
        page: 1
      }
    })
      .then(res => {
        const result = res.result as Article
        console.log(result);
        this.setState({
          result
        })

        
      })
      .finally(() => {
        Taro.hideLoading()
        Taro.hideNavigationBarLoading()
      })
  }

  previewImages = () => {
    const { result } = this.state
    const images: string[] = []
    if (result) {
      const diff = result.diff

      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
      diff.forEach(item => {
        let src = item.new.match(srcReg)
        if (src) {
          images.push(src[1])
        }
      })
    }
    if (images.length > 0) {
      Taro.previewImage({
        current: images[0],
        urls: images
      })
      console.log(images);
      
    } else {
      Taro.showToast({
        title: '未匹配到图片'
      })
    }
  }
  render() {
    const { result } = this.state
    if (!result) {
      return <View></View>
    }
    return (
      <View className='article-detail'>
        <UserInfo avatar={result.avatar} username={result.username} />
        <View className='article-main'>
          <View>
            <View >
              <Text className='article-detail-title'>{result.title}</Text>
            </View>
            <View className='article-detail-date'>
              {result.post_date}
            </View>
          </View>
          <RichText className='article-detail-body' nodes={`<div>${result.content}</div>`}></RichText>
        </View>

        <Button className='btn-float' onClick={this.previewImages}>+</Button>
      </View>
    );
  }
}