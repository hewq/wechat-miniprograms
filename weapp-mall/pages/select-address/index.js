// pages/select-address/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
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
    this.initShippingAddress();
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

  },

  selectTap: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://www.killsun.com/mall/user/shipping-address/update',
      data: {
        token: wx.getStorageSync('token'),
        id: id,
        isDefault: 1
      },
      success: (res) => {
        wx.navigateBack({})
      }
    })
  },

  addAddress: function () {
    wx.navigateTo({
      url: '/pages/address-add/index'
    })
  },

  editAddress: function (e) {
    wx.navigateTo({
      url: '/pages/address-add/index?id=' + e.currentTarget.dataset.id,
    })
  },

  initShippingAddress: function () {
    let that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/shipping-address/list',
      data: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code === 1) {
          that.setData({
            addressList: res.data.data
          });
        } else if (res.data.code === 40000) {
          that.setData({
            addressList: null
          });
        }
      }
    })
  }
})