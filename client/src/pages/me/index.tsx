import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, Button, BaseEventOrig } from "@tarojs/components";
import "./index.scss";
import { ButtonProps } from "@tarojs/components/types/Button";
import { AtButton, AtList, AtListItem } from 'taro-ui'
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
};

export default class Me extends Component<{}, MeState> {
  constructor(props) {
    super(props);
    const userinfo = Taro.getStorageSync("userinfo");
    this.state = {
      userinfo: userinfo || null
    };
  }

  componentDidMount() {
    this.doLogin();
  }

  doLogin() {
    Taro.cloud
      .callFunction({
        name: "login"
      })
      .then(res => {
        console.log("doLogin", res);
      });
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
    } else {
      Taro.showToast({
        icon: "none",
        title: "取消登录"
      });
    }
  };

  render() {
    const { userinfo } = this.state;
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
            {/* <AtListItem title='访问记录' arrow='right' />
            <AtListItem title='我的收藏' arrow='right' /> */}
            <Button openType='contact'><AtListItem title='联系客服' arrow='right' /></Button>
            <Button openType='feedback'><AtListItem title='问题反馈' arrow='right' /></Button>
            
          </AtList>
        </View>
      </View>
    );
  }
}
