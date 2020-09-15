import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text , Button, RichText, Image} from '@tarojs/components';

import './detail.scss'
import { Article, ArticleComment, ArticleCommentItem } from 'src/types/plate';

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
  render() {
    const { result } = this.state
    if (!result) {
      return null
    }
    return (
      <View className='article-detail'>
        <View>
          <Image src={result.avatar}></Image>
          <Text>{result.username}</Text>
        </View>
        <RichText className='article-detail-body' nodes={`<div>${result.content}</div>`}></RichText>
      </View>
    );
  }
}