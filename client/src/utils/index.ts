import Taro from '@tarojs/taro'

export function checkAppUpdate() {
  let updateManager = Taro.getUpdateManager()
  updateManager.onUpdateReady(res => {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？'
    }).then(res => {
      if (res.confirm) {
        try {
          updateManager.applyUpdate()
        } catch (error) {
          Taro.showModal({
            title: '更新提示',
            content: '应用新版本失败!'
          })
        }
      }
    })
  })
}
