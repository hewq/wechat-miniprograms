//app.js
App({
  onLaunch: function () {
    var that = this;

    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success: function(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });

    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function(res){
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            that.getStartIndexPage()
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });

    // 获取商城名称
    wx.request({
      url: 'https://www.killsun.com/mall/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
        }
      }
    })

    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/score/send/rule',
      data: {
        code: 'goodReputaion'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.order_reputation_score = res.data.data[0].score;
        }
      }
    })

    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/config/get-value',
      data: {
        key: 'recharge_amount_min'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.recharge_amount_min = res.data.data.value;
        }
      }
    })

    // 获取砍价设置
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/shop/goods/kanjia/list',
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          that.globalData.kanjiaList = res.data.data.result;
        }
      }
    })

    // 判断是否登录
    let token = wx.getStorageSync('token');
    if (!token) {
      that.goLoginPageTimeOut()
      return
    }
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/check-token',
      data: {
        token: token
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.removeStorageSync('token')
          that.goLoginPageTimeOut()
        }
      }
    })
  },
  sendTempleMsg: function (orderId, trigger, template_id, form_id, page, postJsonString) {
    var that = this
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www/form-urlencoded'
      },
      data: {
        token: wx.getStorageInfoSync('token'),
        type: 0,
        module: 'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: function (res) {

      }
    })
  },
  sendTempleMsgImmediately: function (template_id, form_id, page, postJsonString) {
    var that = this
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        type: 0,
        module: 'immediately',
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
        console.log(res.data);
      }
    })
  },
  goLoginPageTimeOut: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/authorize/index'
      })
    }, 1000)
  },
  goStartIndexPage: function () {
    setTimeout(function () {
      wx.redirectTo({
        url: '/pages/index/index',
      }, 1000)
    })
  },
  globalData: {
    userInfo: null,
    subDomain: 'tz',
    version: '1.0.1',
    note: '商城',
    appid: 'wx9171a836f286a1f4',
    shareProfile: '百款精品商品，总有一款适合你',
    isConnected: true, // 网络是否连接
    _path: 'https://api.it120.cc/tz'
  }
})