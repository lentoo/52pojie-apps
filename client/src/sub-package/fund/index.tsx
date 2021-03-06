import Taro from '@tarojs/taro'
import { View, Input, Text } from "@tarojs/components"
import React, { Component } from "react";
import { AtSearchBar, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import classnames from 'classnames'

import FloatButton from '../../components/FloatButton'
import { callCloudFunction, getUserFundDb, db, getUserFundSubscribeDb } from '../../utils'
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

  /**
   * 估算收益
   */
  income?: number
}

enum fab_icon_enum {
  ICON_EDIT = 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/fund/icon-edit.png',
  ICON_SAVE = 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/fund/icon-save.png'
}
const ICON_CANCEL = 'cloud://env-52pojie-2tc3i.656e-env-52pojie-2tc3i-1303107231/images/icon-cancel.png'

/**
 * 基金模板id
 */
const FOUND_TEMPLATE_ID = 'GUMP-Xoi6B1J38VU1ldRWa4NNcb5T-DiOHrm7Fl7iaE'

interface FundState {
  searchValue: string
  codes: string[]
  user_fund: { _id: string, openid: string, codes: string[], funds: IFundData[] } | null
  fund_datas: IFundData[]
  fab_icon: fab_icon_enum
  displaySubscribe: boolean

  actionsheet_title: string
  show_actionsheet: boolean
}

export default class Fund extends Component<{}, FundState> {
  user_fund_db = getUserFundDb()
  openid = Taro.getStorageSync('_o')
  timer: number = 0
  actionsheet_select_code: string

  /**
   * daycode	为0表示工作日、为1节假日、为2双休日、3为调休日（上班）
   */
  daycode: number = 0
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      codes: [],
      user_fund: null,
      fund_datas: [],
      fab_icon: fab_icon_enum.ICON_EDIT,
      displaySubscribe: false,
      actionsheet_title: '',
      show_actionsheet: false
    }
  }
  componentWillUnmount() {
    this.stopGetData()
  }
  componentDidHide() {
    this.stopGetData()
  }
  componentDidShow() {
    console.log('componentDidShow');
    this.searchTodayIsHoliday()
    this.getUserFundCodes()
    this.startGetData()
  }
  onPullDownRefresh () {
    this.getFundData()
      ?.then(() => {
        Taro.stopPullDownRefresh()
      })
  }
  startGetData = () => {
    this.stopGetData()
    this.timer = setInterval(this.whileGetFundData, 3000)
  }
  stopGetData() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = 0
    }
  }
  whileGetFundData = () => {
    if (this.daycode !== 0) {
      console.log('非工作日');
      Taro.setNavigationBarTitle({
        title: '自选基金助手(休市中)'
      })
      return
    }
    const date = new Date()
    console.log(date.getHours());
    const hourse = date.getHours()
    const minutes = date.getMinutes()
    if (date.getDay() === 6 || date.getDay() === 0) {
      Taro.setNavigationBarTitle({
        title: '自选基金助手(休市中)'
      })
      return
    }
    if (hourse < 9 || (hourse === 11 && minutes >= 32) || hourse === 12) {
      Taro.setNavigationBarTitle({
        title: '自选基金助手(休市中)'
      })
      return
    }
    if (hourse >= 15 && minutes > 2) {
      Taro.setNavigationBarTitle({
        title: '自选基金助手(休市中)'
      })
    } else {
      Taro.setNavigationBarTitle({
        title: '自选基金助手'
      })
      this.getFundData()
    }
  }
  
  searchTodayIsHoliday = () => {
    const date = new Date()
    const toDayStr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`
    Taro.cloud.callFunction({
      name: 'fund',
      data: {
        action: 'action_get_holiday',
        data: {
          date: toDayStr
        }
      }
    }).then((response: any) => {
      console.log(response);
      
      if (response.result && response.result.code === 0) {
        this.daycode = response.result.data.daycode
      }
    })
  }
  onSearchValueChange = (value) => {
    this.setState({
      searchValue: value
    })
  }
  getUserFundCodes = () => {
    this.user_fund_db.where({
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
    if (!this.state.searchValue.trim()) {
      Taro.showToast({
        title: '请输入基金代码',
        icon: 'none'
      })
      return
    }
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
      const response = res.result as any
      if (response.code !== 0) {
        Taro.showToast({
          icon: 'none',
          title: response.msg
        })
        return
      }
      const result = response.data
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
            const updated = item.PDATE === item.GZTIME.split(' ')[0]
            const portion = this.state.user_fund?.funds[index].portion || 0
            let income = portion * Number(item.GSZ) * (Number(item.GSZZL) / 100)
            if (updated) {
              income = (Number(item.NAV) - Number(item.NAV) * (Number(item.NAVCHGRT) / 100)) * portion * (Number(item.NAVCHGRT) / 100)
            }
            return {
              ...this.state.user_fund?.funds[index],
              ...item,
              income
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
        .then(() => {
          this.setState({
            fab_icon: this.state.fab_icon === fab_icon_enum.ICON_EDIT ? fab_icon_enum.ICON_SAVE : fab_icon_enum.ICON_EDIT
          })
          this.startGetData()
        })
    } else {
      // edit
      this.setState({
        fab_icon: this.state.fab_icon === fab_icon_enum.ICON_EDIT ? fab_icon_enum.ICON_SAVE : fab_icon_enum.ICON_EDIT
      })
      this.stopGetData()
    }
  }
  handleCancelClick = () => {
    this.startGetData()
    this.setState({
      fab_icon: fab_icon_enum.ICON_EDIT
    })
    this.getUserFundCodes()
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
          this.getUserFundCodes()
          Taro.showToast({
            title: '保存成功',
            icon: 'success'
          })
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
  // handleSubscribe = () => {
  //   Taro.requestSubscribeMessage({
  //     tmplIds: [FOUND_TEMPLATE_ID]
  //   }).then(res => {

  //     if (res[FOUND_TEMPLATE_ID] === 'reject') {
  //       console.log('取消订阅');
  //       return Promise.reject('取消订阅')
  //     }
  //     console.log('订阅成功', res)
  //     Taro.showLoading({
  //       title: ''
  //     })
  //     const subscribeDb = getUserFundSubscribeDb()
  //     return subscribeDb.where({
  //         openid: this.openid
  //       })
  //       .get()
  //       .then(result => {
  //         if (result.data.length === 0) {
  //           subscribeDb.add({
  //             data: {
  //               openid: this.openid
  //             }
  //           }).then(() => {
  //             Taro.showToast({
  //               title: '订阅成功',
  //               icon: 'success'
  //             })
  //           })
  //         } else {
  //           Taro.hideLoading()
  //         }
  //       })
  //   }).then(() => {
  //     this.setState({
  //       displaySubscribe: false
  //     })
  //   })
  // }
  render() {
    const { searchValue, fund_datas, fab_icon, actionsheet_title, show_actionsheet} = this.state
    const summary = fund_datas.reduce((prev, curr) => {
      return prev + (curr.income || 0)
    }, 0)
    return (
      <View className='fund'>
        {/* {
          displaySubscribe && <Subscribe onSubscribe={this.handleSubscribe} onClose={() => this.setState({
            displaySubscribe: false
          })} />
        } */}
        

        <AtSearchBar showActionButton placeholder='请输入基金代码或名称' value={searchValue} onChange={this.onSearchValueChange} actionName='新增' onActionClick={this.searchFund}/>
        <FloatButton animate={fab_icon === fab_icon_enum.ICON_EDIT} animateName='zoom' bottom={100} right={40} icon={fab_icon} onClick={this.handleFloatButtonClick} />
        <FloatButton className={
          classnames('cancel-btn', {
            'show-cancel': fab_icon === fab_icon_enum.ICON_SAVE,
            'hide-cancel': fab_icon === fab_icon_enum.ICON_EDIT
          })
        } bottom={100} right={-160} icon={ICON_CANCEL} onClick={this.handleCancelClick} />
        <AtActionSheet isOpened={show_actionsheet} cancelText='取消' title={actionsheet_title} onCancel={this.handleActionSheetClose} onClose={this.handleActionSheetClose}>
          <AtActionSheetItem onClick={ () => this.removeFund(this.actionsheet_select_code) }>
            删除
          </AtActionSheetItem>
        </AtActionSheet>
        <View className='table'>
          <View className='table-headers'>
            <View className='table-header'>基金名称</View>
            {
              fab_icon === fab_icon_enum.ICON_SAVE && <View className='table-header'>持有份额</View>
            }
            <View className='table-header'>净值</View>
            <View className='table-header'>涨跌幅</View>
            <View className='table-header'>估算收益</View>
            <View className='table-header'>更新时间</View>
          </View>
          <View className='table-body'>
            {
              fund_datas.map(item => {
                const updated = item.PDATE === item.GZTIME.split(' ')[0]
                const useGSZZL = updated ? item.NAVCHGRT : item.GSZZL
                let time = '00:00'
                if (item.GZTIME.includes(' ')) {
                  time = item.GZTIME.split(' ')[1]
                }
                return (
                  <View className='table-column' key={item.FCODE}
                    onLongPress={() => this.handleLongPress(item)}
                  >
                    {/* 基金名称 */}
                    <View className='table-item' onClick={() => {
                      // Taro.navigateTo({
                      //   url: '/sub-package/fund/fund-detail/index?code=' + item.FCODE
                      // })
                    }}>
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
                    <View className='table-item'>
                      {item.NAV}
                      <View className={
                        classnames('f22', {
                          red: Number(item.NAVCHGRT) > 0,
                          green: Number(item.NAVCHGRT) < 0
                        })
                      }>
                        {item.NAVCHGRT}% { updated && <View className='at-icon at-icon-check'></View> }
                      </View>
                    </View>
                    {/* 涨跌幅 */}
                    <View className={classnames('table-item')}>
                      {/* {
                        updated && <View className='f22'>{item.GSZZL}%</View>
                      } */}
                      <View className={classnames({
                         green: Number(useGSZZL) < 0,
                         red: Number(useGSZZL) > 0
                      })}>{item.GSZZL}% </View>
                    </View>
                    {/* 估算收益 */}
                    <View className={classnames('table-item', {
                      red: (item.income || 0) > 0,
                      green: (item.income || 0) < 0
                    })}
                    >{(item.income || 0).toFixed(2)}</View>

                    <View className='table-item'>
                      {time}
                    </View>
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