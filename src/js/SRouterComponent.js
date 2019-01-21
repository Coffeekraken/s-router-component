import native from 'coffeekraken-sugar/js/core/sNativeWebComponent'
import addEventListener from 'coffeekraken-sugar/js/dom/addEventListener'
import zip from 'lodash/zip'
import fromPairs from 'lodash/fromPairs'
import dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'

class SRoute {

  constructor(route, handler, hooks = {}) {
    this._route = route
    this._handler = handler
    this._hooks = hooks
  }

  get route() {
    return this._route
  }

  get handler() {
    return this._handler
  }

  get hooks() {
    return this._hooks
  }
}

// some internal variables
const _routes = {}

export default class SRouterComponent extends native(window.HTMLAnchorElement) {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
    return {

      /**
       * Specify the router handler used for this link
       * @prop
       * @type    {String|Function}
       */
      handler: 'default',

      /**
       * Specify a function tu run before the change
       * This function has to return a promise that has to be resolved
       * to execute the route change
       * This function will these properties as parameters:
       * - `params`: The route params taken from the url
       * @prop
       * @type    {Function}
       */
      before: null,

      /**
       * Specify a function to run after the change
       * This function will these properties as parameters:
       * - `params`: The route params taken from the url
       */
      after: null,

      /**
       * Specify a function to run when leaving the route
       * This function will these properties as parameters:
       * - `params`: The route params taken from the url
       */
      leave: null

    }
  }

  /**
   * Register a route
   * @param    {String}    route    The route to handle. Can have some params like /my/route/:id
   * @param    {Function}    handler    The handler function. Need to return a promise that need to be resolved when the change has been made
   * @param    {Object}    [hooks={}]    An object with some functions hooks. Available hooks: `before`, `after` and `leave`
   */
  static on(route, handler, hooks = {}) {

    // register new route
    _routes[route] = new SRoute(
      route,
      handler,
      hooks
    )

    // maintain chainability
    return this
  }

  /**
   * Start the router to listen for route changes
   */
  static listen() {
    // add popstate event
    addEventListener(window, 'popstate', this._popStateHandler.bind(this))

    // maintain chainability
    return this
  }

  static async _popStateHandler(e) {
    console.log('popstate', e)

    // get the pathname from the url
    const href = document.location.pathname

    // find the first route that match the requested one
    const foundRoute = this._findRoute(href)

    // if no route match, stop here
    if (!foundRoute) return

    // destructur the foundRoute
    const { sroute, params } = foundRoute

    // check if this route has a before hook
    if (sroute.hooks.before) {
      const beforeResult = await sroute.hooks.before(params)
      if (!beforeResult) return
    }
    // call the handler function for the route
    sroute.handler(params).then(() => {
      console.log('changed!')
    })

    console.log('click', sroute, params)
  }

  /**
   * Find the route that match the href of this component instance
   * @param    {String}    href    The href value of this link
   * @return    {SRoute}    The SRoute instance of the first route that match the href
   */
  static _findRoute(href) {

    // loop on each routes
    for (let route in _routes) {
      // get the SRoute object
      const sroute = _routes[route]
      // build a route regexp string
      let routeRegexpStringAr = route.split('/')
      // replace every tokens by a regexp part
      routeRegexpStringAr = routeRegexpStringAr.map((token) => {
        if (token === '*') {
          // wildcard
          return '([^\/]+)'
        } else if (token.substr(0,1) === ':') {
          return '([^\/]+)'
        }
        // otherwise, return the token itself cause it's a simple value
        return token
      })
      // reform the routeRegexpStringAr into a simple string
      const routeRegexpString = routeRegexpStringAr.join('\\/')
      // try to match the route with the built regexp
      const match = href.toString().match(new RegExp(routeRegexpString))
      // check if the route match, otherwise we pass the the next one
      if (!match) continue
      match.splice(0,1)
      // get the params tokens
      const paramTokensAr = (route.match(/([:*])(\w+)/g) || []).map((item) => {
        return item.substr(1)
      })
      // build the params object
      const params = fromPairs(
        zip(paramTokensAr, match)
      )
      // return the sroute and the params
      return {
        sroute,
        params
      }
    }
  }

  /**
   * Physical props
   * @definition    SWebComponent.physicalProps
   * @protected
   */
  static get physicalProps() {
    return []
  }

  /**
   * Css
   * @protected
   */
  static defaultCss(componentName, componentNameDash) {
    return `
      ${componentNameDash} {
        display : block;
      }
    `
  }

  /**
   * Component will mount
   * @definition    SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount() {
    super.componentWillMount()
  }

  /**
   * Mount component
   * @definition    SWebComponent.componentMount
   * @protected
   */
  componentMount() {
    super.componentMount()

    // listen for click on himself
    this._removeClickHandler = addEventListener(this, 'click', this._clickHandler)
  }

  /**
   * Component unmount
   * @definition    SWebComponent.componentUnmount
   * @protected
   */
  componentUnmount() {
    super.componentUnmount()

    if (this._removeClickHandler) this._removeClickHandler()
  }

  /**
   * Component will receive prop
   * @definition    SWebComponent.componentWillReceiveProp
   * @protected
   */
  componentWillReceiveProp(name, newVal, oldVal) {
    super.componentWillReceiveProp(name, newVal, oldVal)
  }

  /**
   * Click handler
   * @param    {MouseEvent}    e    The mouse event
   */
  async _clickHandler(e) {
    // prevent default behavior
    e.preventDefault()

    // push a new state
    window.history.pushState({}, document.title, this.getAttribute('href'))

    // dispatch a popstate event
    dispatchEvent(window, 'popstate')
  }
}
