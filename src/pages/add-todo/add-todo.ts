const app = getApp();

export default Page({
  data: {
    inputValue: "",
  },

  onBlur(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  add() {
    app.globalData.todos = app.globalData.todos.concat([
      {
        text: this.data.inputValue,
        compeleted: false,
      },
    ]);

    my.navigateBack();
  },
});
