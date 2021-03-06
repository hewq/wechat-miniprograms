var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,
    hasMoreSelect: false,
    selectSize: '选择：',
    selectSizePrice: 0,
    totalScoreToPay: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    propertyChildIds: '',
    propertyChildNames: '',
    canSubmit: false, // 选中规格尺寸时是否允许加入购物车
    shopCarInfo: {},
    shopType: 'addShopCar', // 购物类型，加入购物车或立即购买，默认为加入购物车
  },

  // 事件处理函数
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function (e) {
    if (e.inviter_id) {
      wx.setStorage({
        key: 'inviter_id_' + e.id,
        data: e.inviter_id
      })
      wx.setStorage({
        key: 'referrer',
        data: e.inviter_id
      })
    }
    var that = this;
    that.data.kjId = e.kjId;

    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        })
      }
    })
    wx.request({
      url: 'https://www.killsun.com/mall/goods/detail',
      data: {
        id: e.id
      },
      success: function (res) {
        var selectSizeTemp = '';
        var data = res.data.data;
        if (data.properties) {
          for (var i = 0; i < data.properties.length; i++) {
            selectSizeTemp = selectSizeTemp + ' ' + data.properties[i].name;
          }
          that.setData({
            hasMoreSelect: true,
            selectSize: that.data.selectSize + selectSizeTemp,
            selectSizePrice: data.basicInfo.minPrice,
            totalScoreToPay: data.basicInfo.minScore
          });
        }
        if (data.basicInfo.pingtuan) {
          that.pingtuanList(e.id);
        }
        that.data.goodsDetail = data;
        if (data.basicInfo.videoId) {
          that.getVideoSrc(data.basicInfo.videoId);
        }
        that.setData({
          goodsDetail: data,
          selectSizePrice: data.basicInfo.minPrice,
          totalScoreToPay: data.basicInfo.minScore,
          buyNumMax: data.basicInfo.stores,
          buyNumber: (data.basicInfo.stores > 0) ? 1 : 0
        })
        WxParse.wxParse('article', 'html', data.content, that, 5);
      }
    })
    this.reputation(e.id);
    this.getKanjiaInfo(e.id);
  },
  goShopCar: function () {
    wx.reLaunch({
      url: '/pages/shop-cart/index'
    });
  },
  toAddShopCar: function () {
    this.setData({
      shopType: 'addShopCar'
    })
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: 'tobuy',
      selectSizePrice: this.data.goodsDetail.basicInfo.minPrice
    });
    this.bindGuiGeTap();
  },
  toPingtuan: function (e) {
    let pingtuanopenid = 0;
    if (e.currentTarget.dataset.pingtuanopenid) {
      pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
    }
    this.setData({
      shopType: 'toPingtuan',
      selectSizePrice: this.data.goodsDetail.basicInfo.pingtuanPrice,
      pingtuanopenid: pingtuanopenid
    });
    this.bindGuiGeTap();
  },
  // 规格选择弹出框
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },

  // 规格选择弹出框隐藏
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  // 选择商品规格
  labelItemTap: function (e) {
    var that = this;
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds = '';
    var propertyChildNames = '';
    for (var i = 0; i < that.data.goodsDetail.properties.length; i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ':' + childs[j].id + ',';
          propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ':' + childs[j].name + ' ';
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum === curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      wx.request({
        url: 'https://www.killsun.com/mall/goods/price',
        data: {
          goodsId: that.data.goodsDetail.basicInfo.id,
          propertyChildIds: propertyChildIds
        },
        success: function (res) {
          that.setData({
            selectSizePrice: res.data.data.price,
            totalScoreToPay: res.data.data.score,
            propertyChildIds: propertyChildIds,
            propertyChildNames: propertyChildNames,
            buyNumMax: res.data.data.stores,
            buyNumber: (res.data.data.stores > 0) ? 1 : 0
          });
        }
      })
    }
    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })
  },
  // 加入购物车
  addShopCar: function () {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格!',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    // 组建购物车
    var shopCarInfo = this.buildShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
  },
  // 立即购买
  buyNow: function (e) {
    let that = this;
    let shoptype = e.currentTarget.dataset.shoptype;
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      wx.showModal({
        title: '提示',
        content: '请先选择规格尺寸哦～',
        showCancel: false
      })
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }

    // 组建立即购买信息
    var buyNowInfo = this.buildByNowInfo(shoptype);
    // 写入本地存储
    wx.setStorage({
      key: 'buyNowInfo',
      data: buyNowInfo
    })
    this.closePopupTap();
    if (shoptype === 'toPingtuan') {
      if (this.data.pingtuanopenid) {
        wx.navigateTo({
          url: '/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=' + this.data.pingtuanopenid
        })
      } else {
        wx.request({
          url: 'https://www.killsun.com/mall/goods/pingtuan/open',
          data: {
            token: wx.getStorageSync('token'),
            goodsId: that.data.goodsDetail.basicInfo.id
          },
          success: function (res) {
            if (res.data.code !== 0) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              return;
            }
            wx.navigateTo({
              url: '/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=' + res.data.data.id
            })
          }
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/to-pay-order/index?orderType=buyNow'
      })
    }
  },
  // 组建购物车信息
  buildShopCarInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.selectSizePrice;
    shopCarMap.score = this.data.totalScoreToPay;
    shopCarMap.left = '';
    shopCarMap.active = true;
    shopCarMap.logistices = this.data.goodsDetail.logistices;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopbarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId === shopCarMap.goodsId && tmpShopCarMap.propertyChildIds === shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }
    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    shopCarInfo.kjId = this.data.kjId;
    return shopCarInfo;
  },
  // 组建立即购买信息
  buildByNowInfo: function (shoptype) {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    if (shoptype === 'toPingtuan') {
      shopCarMap.price = this.data.goodsDetail.basicInfo.pingtuanPrice;
    }
    shopCarMap.score = this.data.totalScoreToPay;
    shopCarMap.left = '';
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticesType = this.data.goodsDetail.basicInfo.logisticesId;
    shopCarMap.logistices = this.data.goodsDetail.logistices;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    buyNowInfo.kjId = this.data.kjId;
    return buyNowInfo;
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },
  reputation: function (goodsId) {
    var that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/goods/reputation',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  },
  pingtuanList: function (goodsId) {
    var that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/mall/goods/pingtuan/list',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            pingtuanList: res.data.data
          });
        }
      }
    })
  },
  getVideoSrc: function (videoId) {
    var that = this;
    wx.request({
      url: 'https://www.killsun.com/mall/media/video/detail',
      data: {
        videoId: videoId
      },
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            videoMp4Src: res.data.data.fdMp4
          });
        }
      }
    })
  },
  getKanjiaInfo: function (gid) {
    var that = this;
    if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length === 0) {
      that.setData({
        curGoodsKanjia: null
      });
      return;
    }
    let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
      return ele.goodsId === gid
    });
    if (curGoodsKanjia) {
      that.setData({
        curGoodsKanjia: curGoodsKanjia
      });
    } else {
      that.setData({
        curGoodsKanjia: null
      });
    }
  },
  goKanjia: function () {
    var that = this;
    if (!that.data.curGoodsKanjia) {
      return;
    }
    wx.request({
      url: 'https://www.killsun.com/mall/goods/kanjia/join',
      data: {
        kjid: that.data.curGoodsKanjia.id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code === 0) {
          wx.navigateTo({
            url: '/pages/kanjia/index?kjId=' + res.data.data.kjId + '&joiner=' + res.data.data.uid + '&id=' + res.data.data.goodsId
          })
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
  joinPingtuan: function (e) {
    let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
    wx.navigateTo({
      url: '/pages/to-pay-order/index?orderType=butNow&pingtuanOpenId=' + pingtuanopenid
    })
  }

})