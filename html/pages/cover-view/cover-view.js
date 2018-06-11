Page({
  onReady() {
    this.videoCtx = wx.createVideoContext('myVideo')
  },
  play() {
    this.videCtx.play()
  },
  pause() {
    this.videoCtx.pause()
  }
})