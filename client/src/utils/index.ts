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

export function padZero(num: string | number): string {
  if (Number(num) < 10) {
    return '0' + num
  }
  return num.toString()
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export function callCloudFunction(param: Pick<Taro.cloud.CallFunctionParam, 'name' | 'data' | 'slow' | 'config'>) : Promise<Taro.cloud.CallFunctionResult> {
  let retryCount = 0
  if (!param.config) {
    param.config = {
      env: 'env-52pojie-2tc3i',
      traceUser: true
    }
  }
  async function callFunction() {
    return Taro.cloud.callFunction(param)
      .catch(async error => {
        console.log(error);
        retryCount++
        if (retryCount <= 20) {
          await delay(500)
          return callFunction()
        } else {
          Promise.reject(error)
        }
      })    
  }
  return callFunction()
}
Taro.cloud.init({
  env: 'env-52pojie-2tc3i'
})
const db = Taro.cloud.database()
const users_db = db.collection('users')
const records_db = db.collection('records')

function createTypeDbFactory(type: string) {
  let target: Taro.DB.Collection
  return function(): Taro.DB.Collection {
    if (!target) {
      target = db.collection(type)
    }
    return target
  }
}

const getUserFundDb = createTypeDbFactory('user_funds')
const getUserFundSubscribeDb = createTypeDbFactory('user_fund_subscribe')
export {
  db,
  users_db,
  records_db,
  getUserFundDb,
  getUserFundSubscribeDb
}