// message.js
var API = require('../../api.js')
var timeTranslate = require('../../../component/timeTranslate/timeTranslate.js')
Page({
  data: {
    messageList: {}
  },
  onLoad: function () {
    // 获取信息
    this.getMessage()
    wx.setNavigationBarTitle({
      title: '我的消息'
    })
  },
  //获取消息列表
  getMessage: function () {
    var token = wx.getStorageSync('accesstoken')
    var that = this
    wx.request({
      url: API.API.Get_messages,
      method: 'GET',
      data: {
        'accesstoken': token
      },
      success: function (res) {
        //时间处理
        if (res.data.data) {
          if (res.data.data.hasnot_read_messages) {
            res.data.data.hasnot_read_messages = res.data.data.hasnot_read_messages.map(function (v) {
              v.reply.create_at = timeTranslate.getDateDiff(v.reply.create_at)
              return v
            })
          }
          if (res.data.data.has_read_messages) {
            res.data.data.has_read_messages = res.data.data.has_read_messages.map(function (v) {
              v.reply.create_at = timeTranslate.getDateDiff(v.reply.create_at)
              return v
            })
          }
          that.setData({
            messageList: res.data.data
          })
        }
      }
    })
  },
  // 标记为已读
  markMsg: function () {
    var token = wx.getStorageSync('accesstoken')
    var that = this
    wx.request({
      url: API.API.Post_mark_all,
      method: 'POST',
      data: {
        'accesstoken': token
      },
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '标记成功',
            icon: 'success',
            duration: 1000
          })
          that.getMessage()
        }else {
          wx.showToast({
            title: res.data.error_msg,
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  }
})
