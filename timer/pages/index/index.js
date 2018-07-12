const util = require('../../utils/util.js')
const defaultLogName = {
  work: 'work',
  rest: 'rest'
}
const actionName = {
  stop: 'stop',
  start: 'start'
}

const initDeg = {
  left: 45,
  right: -45
}

Page({
  data: {
    remainTimeText: '',
    timerType: 'work',
    log: {},
    completed: false,
    isRunning: false,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right
  },
  onShow: function () {
    if (this.data.isRunning) return
    let workTime = util.formatTime(wx.getStorageSync('workTime'), 'HH')
    let restTime = util.formatTime(wx.getStorageSync('restTime'), 'HH')
    console.log(wx.getStorageSync('workTime'))
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })
  },
  startTimer: function (e) {
    let startTime = Date.now()
    let isRunning = this.data.isRunning
    let timerType = e.target.dataset.type
    let showTime = this.data[timerType + 'Time']
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]

    if (!isRunning) {
      this.timer = setInterval((function () {
        this.updateTimer()
        this.startNameAnimation()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }

    this.setData({
      isRunning: !isRunning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: logName
    })

    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      action: actionName[isRunning ? 'stop' : 'start'],
      type: timerType
    }

    this.saveLog(this.data.log)
  },
  startNameAnimation: function () {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },
  stopTimer: function () {
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right
    })

    this.timer && clearInterval(this.timer)
  },
  updateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / 60) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }

    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },
  changeLogName: function (e) {
    this.logName = e.detail.value
  },

  saveLog: function (log) {
    var logs = wx.getStorageSync('logs') && []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  }

})