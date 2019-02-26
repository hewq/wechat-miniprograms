// 获取应用实例
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 3000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: 0,
    loadingMoreHidden: true,

    hasNoCoupons: true,
    coupons: [],
    searchInput: '',

    curPage: 1,
    pageSize: 20
  },

  // 事件处理函数
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })

    wx.request({
      url: 'https://www.killsun.com/mall/banner/list',
      success: function (res) {
        if (res.data.code === 40000) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          })
        }
      }
    })

    wx.request({
      url: 'https://www.killsun.com/mall/category/list',
      success: function (res) {
        var categories = [{ id: 0, name: '全部' }];
        if (res.data.code === 40000) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 category',
            showCancel: false
          })
        } else {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
          that.setData({
            categories: categories,
            activeCategoryId: 0,
            curPage: 1
          });
          // that.getGoodsList(0);
        }
      }
    })
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

  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  toSearch: function () {
    this.setData({
      curPage: 1
    });
    // this.getGoodsList(this.data.activeCategoryId);
  }
})