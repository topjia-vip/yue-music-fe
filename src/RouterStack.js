/**
 * 用于记录路由跳转信息
 */
class RouterStack {
  constructor () {
    this.stack = []
    this.size = 0 // 当前栈大小
    this.pointer = -1 // 当前路由在栈中的位置
  }

  push (router) {
    // 删除当前pointer之后的所有元素
    this.stack.splice(this.pointer + 1, this.size - (this.pointer + 1))
    // 将新的router push进去
    this.stack.push(router)
    // 维护栈大小和当前指针位置指向最顶元素
    this.size = this.stack.length
    this.pointer = this.size - 1
  }

  // 查看前一个元素，若为最顶元素返回-1
  next () {
    if (!this.canNext()) {
      return -1
    }
    this.pointer += 1
    return this.stack[this.pointer]
  }

  // 查看后一元素,如果为栈底元素返回-1
  back () {
    if (!this.canBack()) {
      return -1
    }
    this.pointer -= 1
    return this.stack[this.pointer]
  }

  // 是否有上一个路由
  canNext () {
    return this.pointer !== this.size - 1
  }

  // 是否有下一个路由
  canBack () {
    return this.pointer !== 0
  }

  // 重新初始化栈（用于用户退出登陆）
  init () {
    this.stack = []
    this.size = 0 // 当前栈大小
    this.pointer = -1 // 当前路由在栈中的位置
  }
}

const routerStack = new RouterStack()
routerStack.push('/findMusic/recommend')

export default {
  routerStack
}
