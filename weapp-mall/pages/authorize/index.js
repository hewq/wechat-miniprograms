var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */ 
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      return;
    }
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      this.login();
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none'
      })
    }
  },
  login: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    if (token) {
      wx.request({
        url: 'https://www.killsun.com/user/check-token',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            wx.removeStorageSync('token');
            that.login();
          } else {
            // 回到原来的地方
            wx.navigateBack();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://www.killsun.com/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.code != 1) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('uid', res.data.data.uid);
            // 回到原来的地方
            wx.navigateBack();
          }
        })
      }
    })
  }
})