import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, Button, BaseEventOrig } from "@tarojs/components";
import { ButtonProps } from "@tarojs/components/types/Button";
import { AtButton, AtList, AtListItem } from 'taro-ui'

import "./index.scss";
import { users_db } from '../../utils'
/** 性别的合法值 */
interface gender {
  /** 未知 */
  0;
  /** 男 */
  1;
  /** 女 */
  2;
}

type MeState = {
  userinfo: {
    /** 昵称 */
    nickName: string;
    /** 头像 */
    avatarUrl: string;
    /** 性别 */
    gender: keyof gender;
    /** 省份，如：`Yunnan` */
    province: string;
    /** 城市，如：`Dalian` */
    city: string;
    /** 国家，如：`China` */
    country: string;
  } | null;
  tools: ToolItem[]
};
type ToolItem = {
  image: string
  value: string
  url: string
}

export default class Me extends Component<{}, MeState> {
  constructor(props) {
    super(props);
    const userinfo = Taro.getStorageSync("userinfo");
    this.state = {
      userinfo: userinfo || null,
      tools: [{
        image: 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/小鸡仔.png',
        value: '蚂蚁庄园答案',
        url: '/pages/ant/ant-manor/index'
      }]
    };
  }

  componentDidMount() {
    this.doLogin();
  }

  doLogin() {
    const openid = Taro.getStorageSync('_o')
    if (openid) {
      users_db.where({
        openid
      }).get()
        .then(result => {
          if (result.data.length) {
            this.setState({
              userinfo: result.data[0] as any
            })
          } 
        })
    }
  }

  onGetUserInfo = (
    event: BaseEventOrig<ButtonProps.onGetUserInfoEventDetail>
  ) => {
    console.log(event);
    if (event.detail.userInfo) {
      this.setState({
        userinfo: event.detail.userInfo
      });
      Taro.setStorageSync("userinfo", event.detail.userInfo);
      const openid = Taro.getStorageSync('_o')
      users_db.where({
        openid
      }).get()
        .then(res => {
          if (res.data.length) {
            users_db.doc(res.data[0]._id!)
              .update({
                data: event.detail.userInfo
              })
          }
        })
    } else {
      Taro.showToast({
        icon: "none",
        title: "取消登录"
      });
    }
  };

  render() {
    const { userinfo, tools } = this.state;
    return (
      <View className="me">
        <View className="avatar-box">
          {userinfo ? (
            <View>
              <Image className="avatar-image" src={userinfo?.avatarUrl!} />
              <Text className="avatar-name">{userinfo?.nickName}</Text>
            </View>
          ) : (
            // <Button
            //   className="login-btn"
            //   openType="getUserInfo"
            //   onGetUserInfo={this.onGetUserInfo}
            // >
            //   登录
            // </Button>
            <AtButton className="login-btn" type='primary' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo}>登录</AtButton>  
          )}
          
        </View>
        
        <View className='action-list'>
          <AtList>
            <AtListItem title='访问记录' arrow='right' onClick={() => {
              Taro.navigateTo({
                url: '/pages/me/record/index'
              })
            }}/>
            <AtListItem title='我的收藏' arrow='right' onClick={() => {
              Taro.showToast({
                icon: 'none',
                title: '功能开发中'
              })
            }} />
            <Button openType='contact'><AtListItem title='联系客服' arrow='right' /></Button>
            <Button openType='feedback'><AtListItem title='问题反馈' arrow='right' /></Button>
            
          </AtList>
        </View>

        <View className='action-list'>
          <AtList>
            {
              tools.map(tool => {
                return (
                  <AtListItem key={tool.value} onClick={() => {
                    Taro.reportAnalytics('more_tools', {
                      tool_name: tool.value
                    })
                    Taro.navigateTo({
                      url: tool.url
                    })
                  }} title={tool.value} arrow='right' thumb={tool.image} />
                )
              })
            }
          </AtList>
        </View>
      </View>
    );
  }
}
