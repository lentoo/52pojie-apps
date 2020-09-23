import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button, Image, RichText, Text} from '@tarojs/components'

import './detail.scss'
import { Article, ArticleCommentItem, ArticleComment } from 'src/types/plate';
import UserInfo from './components/UserInfo'
import Tools from './components/Tools'


import ICON_MENU from '../../assets/images/commons/icon-menu.png'

type ArticleDetailProp = {
  link: string
  type: string
}
type ArticleDetailState = {
  result?: Article
  comments: ArticleCommentItem[]
  loadingText: string
  openTools: boolean
}

export default class ArticleDetail extends Component<ArticleDetailProp, ArticleDetailState> {
  constructor(props) {
    super(props)
    this.state = {
      result: undefined,
      comments: [],
      loadingText: '正在加载中',
      openTools: false
    }
  }
  $page = 1
  hasNext = false
  componentDidMount() {
    this.fetchData()
  }
  onReachBottom() {
    if (this.hasNext) {
      this.fetchComments()
    }
  }

  fetchComments() {
    const { result } = this.state
    if (!result) return
    Taro.cloud.callFunction({
      name: 'home',
      data: {
        action: 'get_article_detail_comments_data',
        id: result.id,
        page: ++this.$page
      }
    }).then(res => {
      const data = res.result as ArticleComment
      console.log(data)
      this.setState({
        comments: [...this.state.comments!, ...data.comments]
      })
      this.hasNext = data.hasNext
      this.setState({
        loadingText: this.hasNext ? '正在加载中' : '没有更多了'
      })
    })
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
        page: this.$page
      }
    })
      .then(res => {
        const result = res.result as Article
        console.log(result);
        this.setState({
          result,
          comments: result.comments
        })
        this.hasNext = result.hasNext
        this.setState({
          loadingText: this.hasNext ? '正在加载中' : '没有更多了'
        })
        Taro.hideLoading()
        Taro.hideNavigationBarLoading()
      })
      .catch(error => {
        console.log(error);
        Taro.showToast({
          title: '吾爱破解论坛友情提醒您：您所访问的页面不存在或者已删除',
          icon: 'none'
        })
        Taro.hideLoading()
        Taro.hideNavigationBarLoading()
      })
  }
  onToolsItemClick = (command: string) => {
    if (command === 'tools-image') {
      return this.previewImages()
    }

    if (command === 'tools-copy-link') {
      Taro.setClipboardData({
        data: this.state.result!.link,
        success: function() {
          Taro.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
      return
    }

    if (command === 'tools-pan-link') {
      const pan_links = this.state.result?.pan_links
      if (pan_links && pan_links.length > 0) {
        Taro.showActionSheet({
          itemList: pan_links,
          success: function(res: any) {
            console.log(res)
            const tapIndex = res.tapIndex
            Taro.setClipboardData({
              data: pan_links[tapIndex],
              success: function() {
                Taro.showToast({
                  title: '链接已复制',
                  icon: 'success'
                })
              }
            })
          }
        })
      }
    }
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
        icon: 'none',
        title: '未匹配到图片'
      })
    }
  }
  render() {
    const { result, comments, loadingText, openTools } = this.state
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

        <View className='article-comments'>
          <View className='comments-title'>评论</View>
          <View className='comments-list'>
            {
              comments.map((item, index) => {
                return (
                  <View key={index} className='comments-item'>
                    <View className='flex ali-center'>
                      <Image className='comments-item-avatar' src={item.avatar} />
                      <View>
                        <View className='comments-item-name'>{item.username}</View>
                        <View className='comments-item-date'>{item.post_date}</View>
                      </View>
                    </View>
                    <RichText className='comments-item-content' nodes={item.content}></RichText>
                    {/* <View className='comments-item-content'>{item.content}</View> */}
                  </View>
                )
              })
            }

            <View className='loading-more'>
              <Text>{loadingText}</Text>
            </View>
            
          </View>
        </View>
        <Tools 
          open={openTools} 
          onModalClick={() => {
            this.setState({
              openTools: false
            })
          }}
          onToolsItemClick={this.onToolsItemClick}
          ></Tools>
        <Button className='btn-float' onClick={() => {
          this.setState({
            openTools: true
          })
        }}>
          <Image className='icon-menu' src={ICON_MENU} />
        </Button>
      </View>
    );
  }
}