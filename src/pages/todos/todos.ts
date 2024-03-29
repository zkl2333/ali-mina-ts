// 获取全局 app 实例
const app = getApp();

export default Page({
  // 声明页面数据
  data: {},
  // 监听生命周期回调 onLoad
  onLoad() {
    // 获取用户信息并存储数据
  },
  // 监听生命周期回调 onShow
  onShow() {
    // 设置全局数据到当前页面数据

    this.setData({ todos: app.globalData.todos });
  },
  // 事件处理函数
  onTodoChanged(e) {
    // 修改全局数据
    const checkedTodos = e.detail.value;
    app.globalData.todos  = app.globalData.todos .map((todo) => ({
      ...todo,
      completed: checkedTodos.indexOf(todo.text) > -1,
    }));
    this.setData({ todos: app.globalData.todos  });
  },

  addTodo() {
    // 进行页面跳转
    my.navigateTo({ url: "../add-todo/add-todo" });
  },
});
