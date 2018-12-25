const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.navigateTo({
        url: 'pages/authorize/index'
      })
    } else {
      that.setData({
        userInfo: userInfo,
        version: app.globalData.version
      })
    }
    this.getUserApiInfo();
    this.getUserAmount();
    this.checkScoreSign();
  },
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统基于开源小程序商城系统 https://github.com/EastWorld/wechat-app-mall 搭建，祝大家使用愉快！',
      showCancel: false
    })
  },
  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != 'getPhoneNumber: ok') {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    let that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/wxapp/bindMobile',
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code === 1) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  getUserApiInfo: function () {
    let that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/user/detail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code === 1) {
          let _data = {};
          _data.apiUserInfoMap = res.data.data;
          if (res.data.data.base.mobile) {
            _data.userMobile = res.data.data.base.mobile
          }
          that.setData(_data);
        }
      }
    })
  },
  getUserAmount: function () {
    let that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code === 1) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          })
        }
      }
    })
  },
  checkScoreSign: function () {
    let that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/score/today-signed',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res);
        if (res.data.code === 1) { 
          console.log(res.data.continuous);
          that.setData({
            score_sign_continuous: res.data.continuous
          })
        }
      }
    })
  },
  scoresign: function () {
    let that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/score/sign',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code === 1) {
          that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  relogin: function () {
    wx.navigateTo({
      url: '/pages/authorize/index'
    })
  },
  recharge: function () {
    wx.navigetaTo({
      url: '/pages/recharge/index'
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: '/page/withdraw/index'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})