// collect.js
var API = require('../../api.js')
Page({
  data: {
    collectList: {}
  },
  onLoad: function () {
    // 获取收藏信息
    this.getCollect()
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
  },
  //获取搜查列表
  getCollect: function () {
    var loginname = wx.getStorageSync('loginname')
    var that = this
    wx.showLoading({
      title: 'Loading'
    })
    wx.request({
      url: API.API.Get_user + loginname,
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        if (res.data.data) {
          that.setData({
            collectList: res.data.data.collect_topics
          })
        }
      }
    })
  },
  // 收藏
  deCollect: function (event) {
    var token = wx.getStorageSync('accesstoken')
    var topic_id = event.target.dataset.id
    var msg = ''
    var that = this
    msg = '取消收藏中...'
    wx.showLoading({
      title: msg
    })
    wx.request({
      url: API.API.Post_topic_de_collect,
      method: 'POST',
      data: {
        'accesstoken': token,
        'topic_id': topic_id
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.success) {
          msg = '取消收藏成功'
          wx.showToast({
            title: msg,
            icon: 'success',
            duration: 1000
          })
          that.getCollect()
        }else {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  }
})
