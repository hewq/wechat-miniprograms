let commonCityData = require('../../utils/city.js');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    this.initCityData(1);
    let id = e.id;
    if (id) {
      // 初始化原数据
      wx.showLoading();
      wx.request({
        url: 'https://www.killsun.com/mall/shipping-address/detail',
        data: {
          token: wx.getStorageSync('token'),
          id: id
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code === 1) {
            that.setData({
              id: id,
              addressData: res.data.data,
              selProvince: res.data.data.provinceName,
              selCity: res.data.data.cityName,
              selDistrict: res.data.data.districtName
            });
            that.setDBSaveAddressId(res.data.data);
            return;
          } else {
            wx.showModal({
              title: '提示',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          }
        }
      })
    }
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

  bindCancel: function () {
    wx.navigateBack({});
  },

  bindSave: function (e) {
    let that = this;
    let linkMan = e.detail.value.linkMan;
    let address = e.detail.value.address;
    let mobile = e.detail.value.mobile;
    let code = e.detail.value.code;

    if (linkMan.trim() === '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return;
    }

    if (mobile.trim() === '') {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return;
    }

    if (this.data.selProvince === '请选择') {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return;
    }

    if (this.data.selCity === '请选择') {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return;
    }

    let cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    let cityName = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].name;
    let districtId;
    let districtName;
    if (this.data.selDistrict === '请选择' || !this.data.selDistrict) {
      districtId = ''; 
      districtName = '';
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
      districtName = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].name;
    }

    if (address === '') {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return;
    }

    let apiAddoRuPDATE = 'add';
    let apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = 'update';
    } else {
      apiAddid = 0;
    }

    wx.request({
      url: 'https://www.killsun.com/mall/shipping-address/' + apiAddoRuPDATE,
      data: {
        token: wx.getStorageSync('token'),
        id: apiAddid,
        provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
        provinceName: commonCityData.cityData[this.data.selProvinceIndex].name,
        cityId: cityId,
        cityName: cityName,
        districtId: districtId,
        districtName: districtName,
        linkMan: linkMan,
        address: address,
        mobile: mobile,
        code: code,
        isDefault: 1
      },
      success: function (res) {
        if (res.data.code != 1) {
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        wx.navigateBack({});
      }
    })
  },
  initCityData: function (level, obj) {
    if (level === 1) {
      let pinkArray = [];
      for (let i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces: pinkArray
      });
    } else if (level === 2) {
      let pinkArray = [];
      let dataArray = obj.cityList;
      for (let i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level === 3) {
      let pinkArray = [];
      let dataArray = obj.districtList;
      for (let i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      })
    }
  },
  bindPickerProvinceChange: function (event) {
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince: selIterm.name,
      selProvinceIndex: event.detail.value,
      selCity: '请选择',
      selCityIndex: 0,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity: selIterm.name,
      selCityIndex: event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  setDBSaveAddressId: function (data) {
    var retSelIdx = 0;
    for (var i = 0; i < commonCityData.cityData.length; i++) {
      if (data.provinceId == commonCityData.cityData[i].id) {
        this.data.selProvinceIndex = i;
        for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
          if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
            this.data.selCityIndex = j;
            for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
              if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
                this.data.selDistrictIndex = k;
              }
            }
          }
        }
      }
    }
  },
  selectCity: function () {

  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.killsun.com/mall/shipping-address/delete',
            data: {
              token: wx.getStorageSync('token'),
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx: function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        let provinceName = res.provinceName;
        let cityName = res.cityName;
        let diatrictName = res.countyName;
        let retSelIdx = 0;

        for (var i = 0; i < commonCityData.cityData.length; i++) {
          if (provinceName == commonCityData.cityData[i].name) {
            let eventJ = { detail: { value: i } };
            that.bindPickerProvinceChange(eventJ);
            that.data.selProvinceIndex = i;
            for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
              if (cityName == commonCityData.cityData[i].cityList[j].name) {
                //that.data.selCityIndex = j;
                eventJ = { detail: { value: j } };
                that.bindPickerCityChange(eventJ);
                for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
                  if (diatrictName == commonCityData.cityData[i].cityList[j].districtList[k].name) {
                    //that.data.selDistrictIndex = k;
                    eventJ = { detail: { value: k } };
                    that.bindPickerChange(eventJ);
                  }
                }
              }
            }

          }
        }

        that.setData({
          wxaddress: res,
        });
      }
    })
  }
})