// login.js
var API = require('../../api.js')
Page({
  data: {
    inputValue: ''
  },
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '登陆'
    })
  },
  //二维码
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        if (res.result) {
          that.login(res.result)
        }
      }
    })
  },
  //accesstoken
  accessLogin: function () {
    if (this.data.inputValue != '') {
      this.login(this.data.inputValue)
    }else {
      wx.showToast({
        title: 'accesstoken值不能为空',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //accesstoken验证登陆
  login: function (token) {
    wx.showLoading({
      title: '正在登陆...'
    })
    wx.request({
      url: API.API.Post_access,
      method: 'POST',
      data: {
        'accesstoken': token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.success) {
          //设置本地缓存信息
          wx.setStorageSync('accesstoken', token)
          wx.setStorageSync('loginname', res.data.loginname)
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 2000,
            complete: function () {
              wx.redirectTo({
                url: '/pages/user/user/user'
              })
            }
          })
        }
      }
    })
  }
})
