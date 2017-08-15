// index.js
// 获取应用实例
var app = getApp()
var API = require('../api.js')
var timeTranslate = require('../../component/timeTranslate/timeTranslate.js')
Page({
  data: {
    dataItems: [],
    navItems: [
      {name: '全部',  value: 'all', checked: true},
      {name: '精华',  value: 'good', checked: false},
      {name: 'weex',  value: 'weex', checked: false},
      {name: '分享',  value: 'share', checked: false},
      {name: '问答',  value: 'ask', checked: false},
      {name: '应聘',  value: 'job', checked: false}
    ],
    isLogin: false
  },
  onLoad: function () {
    // 设置顶部标题
    wx.setNavigationBarTitle({
      title: 'Vue 中文论坛'
    })
    // 初始化当前页数
    wx.setStorageSync('page', 1)
    // 初始化“是否最后一页”状态
    wx.setStorageSync('isLast', false)

    // 判断是否登陆
    if (wx.getStorageSync('accesstoken')) {
      this.setData({
        isLogin: true
      })
    }
    // 初始化全部数据
    this.getTopics('all')
  },
  onShow: function(){
    // 判断是否登陆
    if (wx.getStorageSync('accesstoken')) {
      this.setData({
        isLogin: true
      })
    }
  },
  // 下拉加载下一页数据
  onReachBottom: function () {
    var tab = wx.getStorageSync('tab')
    if (wx.getStorageSync('isLast')) {
      wx.showToast({
        title: 'no more tipics',
        icon: 'icon_sp_area',
        duration: 1000
      })
    }else {
      this.getTopics(tab)
      // 下拉刷新，页数加1
      wx.setStorageSync('page', wx.getStorageSync('page') + 1)
      wx.pageScrollTo({scrollTop: wx.getStorageSync('scroll') + 50})
    }
  },
  onPageScroll: function (option) {
    // 设置当前页面位置
    wx.setStorageSync('scroll', option.scrollTop)
  },
  // 上拉刷新数据
  onPullDownRefresh: function () {
    console.log('pull refresh')
    var tab = wx.getStorageSync('tab')
    this.getTopics(tab)
    wx.stopPullDownRefresh()
    wx.pageScrollTo({scrollTop: 0})
    wx.setStorageSync('page', 1)
    wx.setStorageSync('isLast', false)
    console.log(app.globalData.accesstoken)
  },
  // 导航栏change事件
  radioChange: function (e) {
    wx.setStorageSync('isLast', false)
    wx.setStorageSync('page', 1)
    var a = this.data.navItems.map(function (v) {
      if (v.value == e.detail.value) {
        v.checked = true
      }else {
        v.checked = false
      }
      return v
    })
    var that = this
    that.setData({
      navItems: a
    })
    this.getTopics(e.detail.value)
  },
  // 获取文章数据
  getTopics: function (tab) {
    var tabname = tab // 标签名
    var that = this
    var page = wx.getStorageSync('page') // 页码
    wx.showLoading({
      title: 'Loading'
    })
    wx.request({
      url: API.API.Get_topics,
      method: 'GET',
      data: {
        'tab': tabname,
        'limit': 20,
        'page': page
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.data.length > 0) {
          // 处理时间格式
          res.data.data.map(function (x) {
            x.create_at = timeTranslate.getDateDiff(x.create_at)
            return x
          })
          var dataArr = that.data.dataItems // 数据暂存
          if (page > 1) {
            // page>1追加页数数据
            dataArr = dataArr.concat(res.data.data)
          }else {
            dataArr = res.data.data
          }
          that.setData({
            dataItems: dataArr || []
          })
        }else {
          wx.setStorageSync('isLast', true)
        }
        // 设置当前标签
        wx.setStorageSync('tab', tabname)
      }
    })
  }
})
