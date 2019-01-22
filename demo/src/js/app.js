import "babel-polyfill"
import "coffeekraken-sugar/js/features/all"
import SRouterComponent from "../../../dist/index"

SRouterComponent.on(
  "/",
  async (params, source) => {
    console.log("Welcome", params, source)
    return true
  },
  {
    leave: async (params, source) => {
      console.warn("leaving", params, source)
    }
  }
)
  .on(
    ["/home", "/home/:id/:plop"],
    (params, source) => {
      return new Promise(resolve => {
        console.log("handle route home", params, source)
        setTimeout(() => {
          resolve()
        }, 3000)
      })
    },
    {
      before: async (params, source) => {
        console.log("before home")
        return false
      },
      after: (params, source) => {
        console.log("after home", params)
      }
    }
  )
  .on("/about", (params, source) => {
    return new Promise(resolve => {
      console.log("handle route about", params)
      resolve()
    })
  })
  .notFound((params, source) => {
    return new Promise(resolve => {
      console.log("not found", params, source)
      resolve()
    })
  })
  .listen()

// setTimeout(() => {
//   SRouterComponent.goTo('/home')
// }, 2000)
