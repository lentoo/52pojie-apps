import Taro from '@tarojs/taro'

export function checkAppUpdate() {
  let updateManager = Taro.getUpdateManager()
  updateManager.onUpdateReady(res => {
    try {
      updateManager.applyUpdate()
    } catch (error) {
      Taro.showModal({
        title: '更新提示',
        content: '应用新版本失败!'
      })
    }
  })
}

if (process.env.TARO_ENV === 'weapp') {
  Taro.cloud.init()
}





export function callCloudFunction(param: Pick<Taro.cloud.CallFunctionParam, 'name' | 'data' | 'slow' | 'config'>) : Promise<Taro.cloud.CallFunctionResult> {
  let retryCount = 0
  function callFunction() {
    return Taro.cloud.callFunction(param)
      .catch(error => {
        console.log(error);
        retryCount++
        if (retryCount <= 10) {
          return callFunction()
        } else {
          Promise.reject(error)
        }
      })    
  }
  return callFunction()
}

const db = Taro.cloud.database()
const users_db = db.collection('users')
let user_fund_db: Taro.DB.Collection
const records_db = db.collection('records')
function getUserFundDb () {
  if (!user_fund_db) {
    user_fund_db = db.collection('user_funds')
  }
  return user_fund_db
}
export {
  db,
  users_db,
  records_db,
  getUserFundDb
}