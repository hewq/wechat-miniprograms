Page({
  data: {
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国'}
    ]
  },
  radioChange: function (e) {
    console.log('radio 发生 change 事件，携带 value 值为： ', e.detail.value)
  }
});