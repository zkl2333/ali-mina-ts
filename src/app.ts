App({
  onLaunch(options) {
    const a: string = "sss";
    console.log("基础库版本", my.SDKVersion);
  },
  globalData: {
    todos: [
      { text: "Learning Javascript", completed: true },
      { text: "Learning ES2016", completed: true },
      { text: "Learning 支付宝小程序", completed: false },
    ],
  },
});
