// user.js
var API = require('../../api.js')
Page({
  data: {
    userInfo: {},
    newMessage: 0
  },
  onLoad: function () {
    this.getUserInfo()
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
  },
  // 获取用户信息
  getUserInfo: function () {
    var loginname = wx.getStorageSync('loginname')
    var that = this
    if (loginname == '') {
      wx.redirectTo({
        url: '/pages/user/login/login'
      })
    }
    wx.request({
      url: API.API.Get_user + loginname,
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        if (res.data.data) {
          that.setData({
            userInfo: res.data.data
          })
          that.getMessageCount()
        }
      }
    })
  },
  // 获取未读消息
  getMessageCount: function () {
    var token = wx.getStorageSync('accesstoken')
    var that = this
    wx.request({
      url: API.API.Get_message_count,
      method: 'GET',
      data: {
        'accesstoken': token
      },
      success: function (res) {
        if (res.data.data) {
          that.setData({
            newMessage: res.data.data
          })
        }
      }
    })
  }
})
