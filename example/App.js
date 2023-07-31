export function App() {
  return {
    render() {
      return h('div', this.msg)
    },
    setup() {
      return {
        msg: 'Hello mini-vue',
      }
    },
  }
}
