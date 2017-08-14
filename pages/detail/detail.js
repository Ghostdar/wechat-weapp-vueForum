// detail.js
var app = getApp()
var API = require('../api.js')
var WxParse = require('../../component/wxParse/wxParse.js')
var timeTranslate = require('../../component/timeTranslate/timeTranslate.js')
Page({
  data: {
    topic: {},
    content: '',
    tabname: { good: '精华',weex: 'weex',share: '分享',ask: '问答', job: '应聘'},
    topic_id: '',
    is_collect: false,
    is_login: false,
    reply:''
  },
  onLoad: function (option) {
    this.getTpoic(option.id)
    this.setData({
      topic_id: option.id
    })
  },
  onShow: function () {
    // 判断是否登陆
    if (wx.getStorageSync('accesstoken')) {
      this.setData({
        isLogin: true
      })
      // 获取收藏状态
      this.getCollect()
    }
  },
  //获取回复内容
  contentChange: function (e) {
    this.setData({
      reply: e.detail.value
    })
  },
  //获取主题详情
  getTpoic: function (query) {
    var id = query
    var that = this
    wx.request({
      url: API.API.Get_topics_detail + id,
      method: 'GET',
      data: {
        'mdrender': false
      },
      success: function (res) {
        //时间处理
        res.data.data.create_at = timeTranslate.getDateDiff(res.data.data.create_at)
        if (res.data.data.replies) {
          res.data.data.replies = res.data.data.replies.map(function (v) {
            v.create_at = timeTranslate.getDateDiff(v.create_at)
            return v
          })
        }
        //分类名转换
        res.data.data.tab = that.data.tabname[res.data.data.tab]

        that.setData({
          topic: res.data.data || {}
        })
        //文章内容解析
        WxParse.wxParse('content', 'markdown', res.data.data.content, that, 5)
        //设置头部为文章标题
        wx.setNavigationBarTitle({
          title: res.data.data.title
        })
      }
    })
  },
  // 收藏
  collect: function () {
    var token = wx.getStorageSync('accesstoken')
    var topic_id = this.data.topic_id
    var msg = ''
    var that = this
    var url = ''
    if (that.data.is_collect) {
      msg = '取消收藏中...'
      url = API.API.Post_topic_de_collect
    }else {
      msg = '收藏中...'
      url = API.API.Post_topic_collect
    }

    wx.showLoading({
      title: msg
    })
    wx.request({
      url: url,
      method: 'POST',
      data: {
        'accesstoken': token,
        'topic_id': topic_id
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.success) {
          msg = that.data.collect ? '取消收藏成功' : '收藏成功'
          wx.showToast({
            title: msg,
            icon: 'success',
            duration: 1000
          })
          that.setData({
            is_collect: !that.data.is_collect
          })
        }else {
          msg=that.data.collect ? '取消收藏失败' : '收藏失败'
          wx.showToast({
            title: msg,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },
  //新的回复
  newReply: function () {
    var token = wx.getStorageSync('accesstoken')
    var topic_id = this.data.topic_id
    var content = this.data.reply
    var that = this
    wx.showLoading({
      title: '回复中...'
    })
    wx.request({
      url: API.API.Post_new_reply + topic_id + '/replies',
      method: 'POST',
      data: {
        'accesstoken': token,
        'content': content
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 1000
          })
          that.getTpoic(topic_id)
          that.setData({
            reply: ''
          })
        }else {
          wx.showToast({
            title: '回复失败',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },
  // 获取收藏状态
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
          if (res.data.data.collect_topics) {
            var is_collect = res.data.data.collect_topics.some(function (v) {
              return v.id == that.data.topic_id
            })
            that.setData({
              is_collect: is_collect
            })
          }
        }
      }
    })
  }
})
