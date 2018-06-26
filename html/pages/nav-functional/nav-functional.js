Component({
  methods: {
    loginSuccess: function (e) {
      console.log(e.detail.code);
      console.log(e.detail.userInfo)
    }
  }
})