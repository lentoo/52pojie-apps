import Taro from '@tarojs/taro'
import { View, Input, Text } from "@tarojs/components"
import React, { Component } from "react";
import { AtSearchBar, AtInput, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import classnames from 'classnames'

import FloatButton from '../../components/FloatButton'
import { callCloudFunction, getUserFundDb, db } from '../../utils'
import './index.scss'

interface IFundData {
  FCODE: string
  SHORTNAME: string
  ACCNAV: string
  /**
   * 最新的净值日期
   * eg: 2020-12-04
   */
  PDATE: string
  /**
   * 最新净值
   * eg: 1.7440
   */
  NAV: string
  /**
   * 最新的净值涨了多少
   * eg: -0.29
   */
  NAVCHGRT: string
  /**
   * 估值
   * eg: 1.7447
   */
  GSZ: string
  /**
   * 估值涨了多少
   * eg: -0.24
   */
  GSZZL: string
  /**
   * 估值的日期
   * eg: 2020-12-04 15:00
   */
  GZTIME: string

  /**
   * 份额
   */
  portion: number
}

enum fab_icon_enum {
  ICON_EDIT = 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/fund/icon-edit.png',
  ICON_SAVE = 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/fund/icon-save.png'
}
interface FundState {
  searchValue: string
  codes: string[]
  user_fund: { _id: string, openid: string, codes: string[], funds: IFundData[] } | null
  fund_datas: IFundData[]
  fab_icon: fab_icon_enum

  actionsheet_title: string
  show_actionsheet: boolean
}

export default class Fund extends Component<{}, FundState> {
  user_fund_db = getUserFundDb()
  openid = Taro.getStorageSync('_o')
  timer: NodeJS.Timer | null
  actionsheet_select_code: string
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      codes: [],
      user_fund: null,
      fund_datas: [],
      fab_icon: fab_icon_enum.ICON_EDIT,
      actionsheet_title: '',
      show_actionsheet: false
    }
    
  }
  componentDidMount() {
    this.getUserFundCodes()
    this.timer = setInterval(this.whileGetFundData.bind(this), 3000)
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  onPullDownRefresh () {
    this.getUserFundCodes()
      .then(() => {
        Taro.stopPullDownRefresh()
      })
  }
  whileGetFundData() {
    const date = new Date()
    console.log(date.getHours());
    const hourse = date.getHours()
    const minutes = date.getMinutes()
    if (hourse === 11 && minutes >= 31 || hourse === 12) {
      return
    }
    if (hourse >= 15 && minutes > 2) {
      if (this.timer) {
        clearInterval(this.timer)
      }
    } else {
      this.getFundData()
    }
  }
  onSearchValueChange = (value) => {
    this.setState({
      searchValue: value
    })
  }
  getUserFundCodes = () => {
    return this.user_fund_db.where({
      openid: this.openid
    }).get()
      .then(res => {
        if (res.data.length) {
          this.setState({
            user_fund: res.data[0] as any
          }, () => {
            console.log(this.state.user_fund)
            this.getFundData()
          })
        }
      })
  }
  searchFund = () => {
    Taro.showLoading({
      title: ''
    })
    callCloudFunction({
      name: 'fund',
      data: {
        action: 'action_search_fund',
        data: { key: this.state.searchValue }
      }
    }).then(res => {
      Taro.hideLoading()
      const result = res.result as any

      const user_fund = this.state.user_fund
      if (user_fund && user_fund.codes.includes(result.CODE)) {
        Taro.showToast({
          title: `${result.NAME}已经添加过了`,
          icon: 'none'
        })
        return
      }
      Taro.showModal({
        title: '提示',
        content: `确认添加${result.NAME}吗？`
      }).then(res => {
        if (res.confirm) {
          return Promise.resolve('确定')
        }
        return Promise.reject('取消')
      })
      .then(() => {
        if (!user_fund) {
          this.user_fund_db.add({
            data: {
              openid: this.openid,
              codes: [result.CODE],
              funds: [{
                FCODE: result.CODE,
                portion: 0
              }]
            }
          }).then(this.getUserFundCodes)
        } else {
          const _ = db.command
          this.user_fund_db.doc(user_fund._id).update({
            data: {
              codes: _.push(result.CODE),
              funds:  _.push({
                FCODE: result.CODE,
                portion: 0
              })
            }
          }).then(this.getUserFundCodes)
        }
      })
      .then(() => {
        Taro.showToast({
          title: '添加成功'
        })
        this.setState({
          searchValue: ''
        })
      })
    })
  }
  getFundData = () => {
    if (!this.state.user_fund) { return }
    const fund_ids = this.state.user_fund.codes.join(',')
    Taro.showNavigationBarLoading()
    return Taro.request({
      url: `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=ssdfsdfsd&Fcodes=${fund_ids}`,
      method: 'GET',
    }).then(rawData => {
      console.log(rawData)
      Taro.hideNavigationBarLoading()
      if (rawData.statusCode === 200) {
        this.setState({
          fund_datas: rawData.data.Datas.map((item, index) => {
            return {
              ...this.state.user_fund?.funds[index],
              ...item
            }
          })
        })
      }
    })
  }
  handleFloatButtonClick = () => {
    if (this.state.fab_icon === fab_icon_enum.ICON_SAVE) {
      // save
      this.saveRemoteFund()
        .finally(() => {
          this.setState({
            fab_icon: this.state.fab_icon === fab_icon_enum.ICON_EDIT ? fab_icon_enum.ICON_SAVE : fab_icon_enum.ICON_EDIT
          })
        })
    } else {
      // edit
      this.setState({
        fab_icon: this.state.fab_icon === fab_icon_enum.ICON_EDIT ? fab_icon_enum.ICON_SAVE : fab_icon_enum.ICON_EDIT
      })
    }
  }
  saveRemoteFund() {
    if (this.state.user_fund) {
      Taro.showLoading({
        title: '保存中'
      })
      return this.user_fund_db
        .doc(this.state.user_fund._id)
        .update({
          data: {
            funds: this.state.fund_datas.map(item => {
              return {
                FCODE: item.FCODE,
                portion: item.portion
              }
            })
          }
        })
        .then(() => {
          this.getFundData()
          Taro.hideLoading()
        })
        .catch((reason) => {
          Taro.showToast({
            title: reason,
            icon: 'none'
          })
          console.log('error', reason);
        })
    } else {
      return Promise.reject('this.state.user_fund 不可用')
    }
  }
  handlePortionChange = (event) => {
    const code = event.target.dataset.code
    const value = event.target.value
    this.setState({
      fund_datas: this.state.fund_datas.map(obj => {
        if (obj.FCODE === code) {
          console.log(obj);
          
          obj.portion = value
        }
        return obj
      })
    })
  }
  handleLongPress = (item: IFundData) => {
    console.log('handleLongPress', item, this.state.user_fund);
    this.actionsheet_select_code = item.FCODE
    this.setState({
      show_actionsheet: true,
      actionsheet_title: item.SHORTNAME + `(${item.FCODE})`
    })
  }
  removeFund(code: string) {
    if (!this.state.user_fund) return
    this.user_fund_db
      .doc(this.state.user_fund._id)
      .update({
        data: {
          codes: this.state.user_fund.codes.filter(c => c !== code),
          funds: this.state.user_fund.funds.filter(c => c.FCODE !== code)
        }
      }).then(() => {
        this.getUserFundCodes()
        this.handleActionSheetClose()
      })
  }
  handleActionSheetClose = () => {
    this.setState({
      show_actionsheet: false,
      actionsheet_title: ''
    })
  }
  render() {
    const { searchValue, fund_datas, fab_icon, actionsheet_title, show_actionsheet } = this.state
    const summary = fund_datas.reduce((prev, curr) => {
      const income =  curr.portion * Number(curr.GSZ) * (Number(curr.GSZZL) / 100)
      return prev + income
    }, 0)
    return (
      <View className='fund'>
        <AtSearchBar showActionButton placeholder='请输入基金代码或名称' value={searchValue} onChange={this.onSearchValueChange} actionName='新增' onActionClick={this.searchFund}/>
        <FloatButton bottom={100} right={40} icon={fab_icon} onClick={this.handleFloatButtonClick} />

        <AtActionSheet isOpened={show_actionsheet} cancelText='取消' title={actionsheet_title} onCancel={this.handleActionSheetClose} onClose={this.handleActionSheetClose}>
          <AtActionSheetItem onClick={ () => this.removeFund(this.actionsheet_select_code) }>
            删除
          </AtActionSheetItem>
        </AtActionSheet>
        <View className='table'>
          <View className='table-headers'>
            <View className='table-header'>基金名称</View>
            <View className='table-header'>估算净值</View>
            <View className='table-header'>涨跌幅</View>
            <View className='table-header'>估算收益</View>
            {
              fab_icon === fab_icon_enum.ICON_SAVE && <View className='table-header'>持有份额</View>
            }
          </View>
          <View className='table-body'>
            {
              fund_datas.map(item => {
                const income =  item.portion * Number(item.GSZ) * (Number(item.GSZZL) / 100)
                const isProfit = income > 0
                const isProfitLoss = income < 0
                return (
                  <View className='table-column' key={item.FCODE}
                    onLongPress={() => this.handleLongPress(item)}
                  >
                    {/* 基金名称 */}
                    <View className='table-item'>
                      {item.SHORTNAME}
                      <View className='fund-code'>
                        {item.FCODE}
                      </View>
                    </View>
                    {/* 持有份额 */}
                    {
                      fab_icon === fab_icon_enum.ICON_SAVE && (<View className='table-item'>
                        <Input data-code={item.FCODE} value={item.portion.toString()} name='portion' type='text' onInput={this.handlePortionChange}/>
                      </View>)
                    }
                    {/* 估算净值 */}
                    <View className='table-item'>{item.GSZ}</View>
                    {/* 涨跌幅 */}
                    <View className={classnames('table-item', {
                      green: Number(item.GSZZL) < 0,
                      red: Number(item.GSZZL) > 0
                    })}>{item.GSZZL}%</View>
                    {/* 估算收益 */}
                    <View className={classnames('table-item', {
                      red: isProfit,
                      green: isProfitLoss
                    })}
                    >{income.toFixed(2)}</View>
                    
                  </View>
                )
              })
            }
          </View>

        </View>
        <View className='summary'>
          <Text className={classnames({
            green: summary < 0,
            red: summary > 0
          })}>当日估算收益：{summary.toFixed(2)}</Text>
        </View>
        <View className='summary-placeholder'></View>
      </View>
    );
  }
}