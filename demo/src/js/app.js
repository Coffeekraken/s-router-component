import "babel-polyfill"
import "coffeekraken-sugar/js/features/all"
import SRouterComponent from "../../../dist/index"

function setContent(content) {
  document.querySelector(".content").innerHTML = content
}

SRouterComponent.hooks({
  before: (params, source) => {
    console.log("BEFORE", params, source)
  },
  after: (params, source) => {
    console.log("AFTER", params, source)
  }
})

SRouterComponent.on(
  "/",
  (params, source) => {
    console.log("Welcome", params, source)
    setContent("WELCOME")
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
      console.log("handle route home", params, source)
      setContent("HOME")
    },
    {
      before: async (params, source) => {
        console.log("before home")
        // return false
      }
    }
  )
  .on("/about", (params, source) => {
    console.log("handle route about", params)
    setContent("ABOUT")
  })
  .notFound((params, source) => {
    setContent("NOT FOUND")
    console.log("not found", params, source)
  })
  .listen()

// setTimeout(() => {
//   SRouterComponent.goTo('/home')
// }, 2000)
