import "babel-polyfill"
import "coffeekraken-sugar/js/features/all"
import SRouterComponent from "../../../dist/index"


SRouterComponent.on('/home/:id/:plop', (params) => {
  return new Promise((resolve) => {
    console.log('handle route home', params)
    resolve()
  })
}, {
  before: async (params) => {
    console.log('before home')
    return true
  }
})
.on('/about', (params) => {
  return new Promise((resolve) => {
    console.log('handle route about', params)
    resolve()
  })
})
.listen()
