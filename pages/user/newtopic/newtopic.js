// newtopic.js
var API = require('../../api.js')
Page({
  data: {
    userInfo: {},
    tabs: ['精华', 'weex', '分享', '问答', '应聘'],
    tabValue: ['good', 'weex', 'share', 'ask', 'job'],
    tabIndex: 0,
    tab: '',
    content: '',
    title: ''
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '发布主题'
    })
  },
  // 内容获取
  contentChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 标题获取
  titleChange: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  // 分类名获取
  bindTabChange: function (e) {
    this.setData({
      tab: this.data.tabValue[e.detail.value],
      tabIndex: e.detail.value
    })
  },
  // 发布新的文章
  newTopic: function () {
    var title = this.data.title
    var content = this.data.content
    var token = wx.getStorageSync('accesstoken')
    var tab = this.data.tab
    var that = this
    if (title == '' || content == '' || tab == '' || token == '') {
      wx.showToast({
        title: '参数输入有误',
        icon: 'loading',
        duration: 1000
      })
    }
    wx.showLoading({
      title: '正在发布...'
    })
    wx.request({
      url: API.API.Post_topic,
      method: 'POST',
      data: {
        'title': title,
        'tab': tab,
        'content': content,
        'accesstoken': token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1000,
            complete: function () {
              //发布成功后跳转到文章详情
              wx.redirectTo({
                url: '/pages/detail/detail?id=' + res.data.topic_id
              })
            }
          })
        }else {
          wx.showToast({
            title: res.data.error_msg,
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  }
})
