import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, RichText, Text, Button } from "@tarojs/components";
import qs from "qs";

import "./detail.scss";
import { Article, ArticleCommentItem, ArticleComment } from "src/types/plate";
import LoadMore from "../../components/LoadingMore";
import FloatButton from "../../components/FloatButton";
import FloatButtonToTop from "../../components/FloatButtonToTop";
import UserInfo from "./components/UserInfo";
import Tools from "./components/Tools";
import { callCloudFunction } from "../../utils";

import ICON_MENU from "../../assets/images/commons/icon-menu.png";

// import ICON_TO_TOP from '../../assets/images/commons/icon-to-top.png'

type ArticleDetailProp = {
  link: string;
  type: string;
};
type ArticleDetailState = {
  result?: Article;
  comments: ArticleCommentItem[];
  loadingText: string;
  openTools: boolean;
};

export default class ArticleDetail extends Component<
  ArticleDetailProp,
  ArticleDetailState
> {
  constructor(props) {
    super(props);
    this.state = {
      result: undefined,
      comments: [],
      loadingText: "正在加载中",
      openTools: false
    };
  }
  $page = 1;
  hasNext = false;
  componentDidMount() {
    this.fetchData()?.then(() => {
      setTimeout(() => {
        Taro.reportAnalytics("article_detail", {
          id: this.state.result?.id,
          article_name: this.state.result?.title
        });
      }, 1000);
    });
  }
  onPullDownRefresh() {
    this.$page = 1;

    this.fetchData()?.then(() => {
      Taro.stopPullDownRefresh();
    });
  }
  onReachBottom() {
    if (this.hasNext) {
      this.fetchComments();
    }
  }
  onShareAppMessage() {
    const result = this.state.result;
    return {
      title: result?.title,
      content: result?.content,
      path:
        "/pages/article/detail?link=" +
        getCurrentInstance().router?.params.link!
    };
  }

  fetchComments() {
    const { result } = this.state;
    if (!result) return;
    callCloudFunction({
      name: "home",
      data: {
        action: "get_article_detail_comments_data",
        id: result.id,
        page: ++this.$page
      }
    }).then(res => {
      const data = res.result as ArticleComment;
      console.log(data);
      this.setState({
        comments: [...this.state.comments!, ...data.comments]
      });
      this.hasNext = data.hasNext;
      this.setState({
        loadingText: this.hasNext ? "正在加载中" : "没有更多了"
      });
    });
  }

  fetchData() {
    const link = getCurrentInstance().router?.params.link;
    if (!link) {
      Taro.showToast({
        title: "参数有误"
      });
      return;
    }
    Taro.showLoading({
      title: "Loading..."
    });
    Taro.showNavigationBarLoading();

    return callCloudFunction({
      name: "home",
      data: {
        action: "get_article_detail_data",
        url: decodeURIComponent(link),
        page: this.$page
      }
    })
      .then(res => {
        const result = res.result as Article;
        console.log(result);
        this.setState({
          result,
          comments: result.comments
        });
        this.hasNext = result.hasNext;
        this.setState({
          loadingText: this.hasNext ? "正在加载中" : "没有更多了"
        });

        if (result.alert_message) {
          Taro.setNavigationBarTitle({
            title: "错误"
          });
        } else {
          Taro.setNavigationBarTitle({
            title: result.title
          });
        }

        Taro.hideLoading();
        Taro.hideNavigationBarLoading();
      })
      .catch(error => {
        console.log(error);
        Taro.showToast({
          title: "吾爱破解论坛友情提醒您：您所访问的页面不存在或者已删除",
          icon: "none"
        });
        Taro.hideLoading();
        Taro.hideNavigationBarLoading();
      });
  }
  onToolsItemClick = (command: string) => {
    if (command === "tools-image") {
      return this.previewImages();
    }

    if (command === "tools-copy-link") {
      this.copyLink(this.state.result?.link!);
      return;
    }

    if (command === "tools-pan-link") {
      const pan_links = this.state.result?.pan_links;
      if (pan_links && pan_links.length > 0) {
        Taro.showActionSheet({
          itemList: pan_links,
          success: function(res: any) {
            console.log(res);
            const tapIndex = res.tapIndex;
            Taro.setClipboardData({
              data: pan_links[tapIndex],
              success: function() {
                Taro.showToast({
                  title: "链接已复制",
                  icon: "success"
                });
              }
            });
          }
        });
      }
    }
  };
  previewImages = () => {
    const { result } = this.state;
    const images: string[] = [];
    if (result) {
      const diff = result.diff;

      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src

      diff.forEach(item => {
        const reg = srcReg.exec(item.new);
        if (reg) {
          console.log(reg);
          images.push(reg[1]);
        }
        // const query = item.new
        //   .split(" ")
        //   .filter(text => text.indexOf("=") > -1)
        //   .reduce((prev, text) => {
        //     console.log({ text });

        //     const [key, v] = text.split("=");
        //     prev[key] = v;
        //     return prev;
        //   }, {}) as any;
        // console.log(query);

        // if (query.src) {
        //   images.push(query.src);
        // }
      });
    }
    if (images.length > 0) {
      Taro.showLoading({
        title: " "
      });
      Promise.all(
        images.map(url => {
          return new Promise(resolve => {
            Taro.downloadFile({
              header: {
                Host: "attach.52pojie.cn",
                Referer: "https://www.52pojie.cn/"
              },
              url,
              success(result) {
                resolve(result);
              }
            });
          });
        })
      ).then((values: any[]) => {
        Taro.hideLoading();
        if (values) {
          Taro.previewImage({
            current: values[0].tempFilePath,
            urls: values.map(v => v.tempFilePath)
          });
        }
      });
    } else {
      Taro.showToast({
        icon: "none",
        title: "未匹配到图片"
      });
    }
  };
  copyLink = (link: string) => {
    Taro.setClipboardData({
      data: link,
      success: function() {
        Taro.showToast({
          title: "链接已复制",
          icon: "success"
        });
      }
    });
  };
  renderNoAuth() {
    const { result } = this.state;
    if (!result) return null;
    const link = result.link;
    return (
      <View className="alert-message">
        <Image
          className="icon-no-auth"
          src="cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/icon-no-auth.svg"
        ></Image>
        <View className="text">{result.alert_message}</View>
        <View className="btn">
          <Button
            onClick={() => {
              Taro.navigateBack();
            }}
            size="mini"
            type="primary"
          >
            返回上一页
          </Button>
        </View>
        <View className="btn">
          <Button
            onClick={() => this.copyLink(link)}
            size="mini"
            type="default"
          >
            复制链接
          </Button>
        </View>
      </View>
    );
  }
  render() {
    const { result, comments, loadingText, openTools } = this.state;
    if (!result) {
      return <View></View>;
    }
    if (result.alert_message) {
      return this.renderNoAuth();
    }
    return (
      <View className="article-detail">
        <UserInfo avatar={result.avatar} username={result.username} />
        <View className="article-main">
          <View>
            <View>
              <Text className="article-detail-title">{result.title}</Text>
            </View>
            <View className="article-detail-date">{result.post_date}</View>
          </View>
          {/* <parser-wx className='article-detail-body' html={result.content} selectable={true}/> */}
          <RichText
            className="article-detail-body"
            nodes={`<div>${result.content}</div>`}
          ></RichText>

          <View className="article-main-desc">
            <View>
              {result.money != -1 && (
                <Text className="money">悬赏 {result.money} CB吾爱币</Text>
              )}
              {result.hasResolve && <Text className="resolve">已解决</Text>}
            </View>
          </View>
        </View>
        <View className="article-comments">
          {comments.length > 0 && <View className="comments-title">评论</View>}

          <View className="comments-list">
            {comments.map((item, index) => {
              return (
                <View key={index} className="comments-item">
                  <View className="flex ali-center">
                    <Image className="comments-item-avatar" src={item.avatar} />
                    <View>
                      <View className="comments-item-name">
                        {item.username}
                      </View>
                      <View className="comments-item-date">
                        {item.post_date}
                      </View>
                    </View>
                  </View>
                  <RichText
                    className="comments-item-content"
                    nodes={item.content}
                  ></RichText>
                  {/* <View className='comments-item-content'>{item.content}</View> */}
                </View>
              );
            })}
            <LoadMore loadingText={loadingText} />
          </View>
        </View>
        <Tools
          open={openTools}
          onModalClick={() => {
            this.setState({
              openTools: false
            });
          }}
          onToolsItemClick={this.onToolsItemClick}
        ></Tools>

        <FloatButtonToTop />
        <FloatButton
          bottom={205}
          right={40}
          icon={ICON_MENU}
          onClick={() => {
            this.setState({
              openTools: true
            });
          }}
        />
      </View>
    );
  }
}
