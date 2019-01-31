import native from "coffeekraken-sugar/js/core/sNativeWebComponent"
import addEventListener from "coffeekraken-sugar/js/dom/addEventListener"
import zip from "lodash/zip"
import fromPairs from "lodash/fromPairs"
import dispatchEvent from "coffeekraken-sugar/js/dom/dispatchEvent"
import queryStringToObject from "coffeekraken-sugar/js/utils/strings/queryStringToObject"
import urlParse from "url-parse"

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
let _hooks = {} // save the generic hooks
let _genericBeforePromise = false
let _clickedItem = null // the last s-router link clicked
let _previousRouteParamsSource = null // save the previous route
let _minorChange = false // true mean that the change made is minor and does not need to trigger an actual route update

/**
 * A simple but powerful router webcomponent with full route lifecycle (before, handler, after, leave)
 *
 * @example    js
 * SRouterComponent.on("/", async (params, source) => {
 *   // do something here...
 * })
 * .on("/user/:id", async (params, source) => {
 *   // do something here...
 * })
 * .listen() // start listening for routes changes
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 */
export default class SRouterComponent extends native(window.HTMLAnchorElement) {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
    return {}
  }

  /**
   * Register a route
   * @param    {String}    route    The route to handle. Can have some params like /my/route/:id
   * @param    {Function}    handler    The handler function. Need to return a promise that need to be resolved when the change has been made
   * @param    {Object}    [hooks={}]    An object with some functions hooks. Available hooks: `before`, `after` and `leave`
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static on(route, handler, hooks = {}) {
    // make an array with the route parameter to allow
    // register multiple routes at once
    const routes = [].concat(route)

    // loop on each routes to register
    routes.forEach(rt => {
      // register new route
      _routes[rt] = new SRoute(rt, handler, hooks)
    })

    // maintain chainability
    return this
  }

  /**
   * Go to a specific url
   * @param    {String}    path    THe path to go to
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static goTo(path) {
    // stop here if the href is already the setted route
    if (path === document.location.pathname) return

    // push a new state
    window.history.pushState({}, document.title, path)

    // dispatch a popstate event
    dispatchEvent(window, "popstate")
  }

  /**
   * Go forward
   * @param    {Integer}    [by=1]    How many steprs to go forward in history
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static goForward(by = 1) {
    window.history.go(by)
    return this
  }

  /**
   * Go backward
   * @param    {Integer}    [by=1]    How many steprs to go back in history
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static goBackward(by = 1) {
    window.history.go(by * -1)
    return this
  }

  /**
   * Register the not found (404) route
   * @param    {Function}     handler    The handler function. Need to return a promise that need to be resolved when the change has been made
   * @param    {Object}    [hooks={}]    An object with some functions hooks. Available hooks: `before`, `after` and `leave`
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static notFound(handler, hooks = {}) {
    // register 404 route
    return this.on("/404", handler, hooks)
  }

  /**
   * Start the router to listen for route changes
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static listen() {
    // add popstate event
    this._removePopStateEventHandler = addEventListener(
      window,
      "popstate",
      () => {
        // check if the change is a minor one
        // meaning that we don't need to make an actuel
        // route change lifecycle process
        if (_minorChange) {
          _minorChange = false
          return
        }

        this._popStateHandler()
      }
    )

    // first check
    this._popStateHandler()

    // maintain chainability
    return this
  }

  /**
   * Stop listen for changes
   */
  static stop() {
    // remove the popstate event handler
    if (this._removePopStateEventHandler) this._removePopStateEventHandler()

    // maintain chainability
    return this
  }

  /**
   * Specify some generic hooks like `before` and `after`
   * @param    {Object}    hooks    An object of hooks
   * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
   */
  static hooks(hooks) {
    // save the hooks in the stack
    _hooks = {
      ..._hooks,
      ...hooks
    }
    // maintain chainability
    return this
  }

  /**
   * When the url has been updated either by a click on back button, or by a click on
   * an `s-router` link
   */
  static async _popStateHandler() {
    // get the pathname from the url
    const href = document.location.pathname

    // find the first route that match the requested one
    const foundRoute = this._findRoute(href)

    // if no route match, stop here
    if (!foundRoute) return

    // destructur the foundRoute
    const { sroute, params } = foundRoute

    // process query string
    const queryString = queryStringToObject(document.location.search)
    if (Object.keys(queryString).length) {
      params.$qs = queryString
    }

    // process hash
    if (document.location.hash) {
      params.$hash = document.location.hash
    }

    // pathname
    params.$pathname = document.location.pathname
    params.$host = document.location.host
    params.$hostname = document.location.hostname
    params.$href = document.location.href
    params.$port = document.location.port
    params.$protocol = document.location.protocol

    // save the $source of the change
    const $source = _clickedItem

    // check if this is a generic before hook
    if (_genericBeforePromise) {
      await _genericBeforePromise
    } else if (_hooks.before && !_genericBeforePromise) {
      _genericBeforePromise = _hooks.before(params, $source || window.history)
      const genericBeforeResult = await _genericBeforePromise
      _genericBeforePromise = false
      if (genericBeforeResult === false) {
        // flag the update as minor
        // to avoid triggering an actual route change
        _minorChange = true
        // go back in history
        window.history.go(-1)
        // stop here
        return
      }
    }

    // if this is not the actual route anymore
    if (params.$pathname !== document.location.pathname) {
      return
    }

    // check if this route has a before hook
    if (sroute.hooks.before) {
      const beforeResult = await sroute.hooks.before(
        params,
        $source || window.history
      )
      if (beforeResult === false) {
        // flag the update as minor
        // to avoid triggering an actual route change
        _minorChange = true
        // go back in history
        window.history.go(-1)
        // stop here
        return
      }
    }

    // check if has a previous route
    if (
      _previousRouteParamsSource &&
      _previousRouteParamsSource.sroute.hooks.leave
    ) {
      const previousRouteLeaveResult = await _previousRouteParamsSource.sroute.hooks.leave(
        _previousRouteParamsSource.params,
        _previousRouteParamsSource.source || window.history
      )
      if (previousRouteLeaveResult === false) {
        // flag the update as minor
        // to avoid triggering an actual route change
        _minorChange = true
        // go back in history
        window.history.go(-1)
        // stop here
        return
      }
    }

    // if this is not the actual route anymore
    if (params.$pathname !== document.location.pathname) {
      return
    }

    // save the previous route
    _previousRouteParamsSource = {
      source: $source,
      sroute: foundRoute.sroute,
      params: foundRoute.params
    }

    /**
     * @event
     * @name    s-router:change
     * Event dispatched on the body to notify the app of a route change
     */
    dispatchEvent(document.body, "s-router:change")

    // call the handler function for the route
    await sroute.handler(params, $source || window.history)

    // if this is not the actual route anymore
    if (params.$pathname !== document.location.pathname) {
      return
    }

    // call the after hook if exist
    if (sroute.hooks.after) {
      await sroute.hooks.after(params, $source || window.history)
    }

    // if this is not the actual route anymore
    if (params.$pathname !== document.location.pathname) {
      return
    }

    // call the generic after hook if exist
    if (_hooks.after) {
      await _hooks.after(params, $source || window.history)
    }
  }

  /**
   * Find the route that match the href of this component instance
   * @param    {String}    href    The href value of this link
   * @return    {SRoute}    The SRoute instance of the first route that match the href
   */
  static _findRoute(href) {
    // loop on each routes
    for (const route in _routes) {
      // get the SRoute object
      const sroute = _routes[route]
      // build a route regexp string
      let routeRegexpStringAr = route.split("/")
      // replace every tokens by a regexp part
      routeRegexpStringAr = routeRegexpStringAr.map(token => {
        if (token === "*" || token.substr(0, 1) === ":") {
          // wildcard
          return "([^/]+)" // eslint-disable-line
        }
        // otherwise, return the token itself cause it's a simple value
        return token
      })
      // reform the routeRegexpStringAr into a simple string
      const routeRegexpString = routeRegexpStringAr.join("\\/")
      // try to match the route with the built regexp
      const match = href
        .toString()
        .match(new RegExp(`^${routeRegexpString}\\/?$`))
      // check if the route match, otherwise we pass the the next one
      if (!match) continue // eslint-disable-line
      // remove the first item of the matches which is the whole matched string
      match.splice(0, 1)
      // get the params tokens
      const paramTokensAr = (route.match(/([:*])(\w+)/g) || []).map(item =>
        item.substr(1)
      )
      // build the params object
      const params = fromPairs(zip(paramTokensAr, match))
      // return the sroute and the params
      return {
        sroute,
        params
      }
    }
    // return 404 route if exist, otherwise, false
    if (_routes["/404"]) {
      return {
        sroute: _routes["/404"],
        params: {}
      }
    }
    // no route found and no 404
    return false
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
    this._removeClickHandler = addEventListener(
      this,
      "click",
      this._clickHandler
    )

    // listen for change on the body
    this._removeChangeHandler = addEventListener(
      document.body,
      "s-router:change",
      () => {
        // set the state classes
        this._setActiveStateClasses()
      }
    )

    // first check of active state
    this._setActiveStateClasses()
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

    // parse the href
    const urlObj = urlParse(this.getAttribute("href"))

    // check if the pathname is the same as the actual current one
    // to stop here if needed
    if (urlObj.pathname === document.location.pathname) {
      // take care of anchor and qs if needed
      // if (urlObj.query) document.location.search = urlObj.query
      if (urlObj.hash) {
        // flag the change as minor
        _minorChange = true
        // update the hash in the url
        document.location.hash = urlObj.hash
      }
      // stop here cause we don't change the actual route
      return
    }

    // save the clicked item in the external variable
    // to pass it then in the handler function
    _clickedItem = this
    setTimeout(() => {
      _clickedItem = null
    })

    // push a new state
    window.history.pushState({}, document.title, this.getAttribute("href"))

    // dispatch a popstate event
    dispatchEvent(window, "popstate")
  }

  /**
   * Set the components active status classes
   */
  _setActiveStateClasses() {
    // check if the link match the location
    const href = this.getAttribute("href").split(/\?|#/)[0]
    const regexpStr = href.replace(/\//g, "\\/")
    if (document.location.pathname === href) {
      this.classList.remove("active-within")
      this.classList.add("active")
    } else if (
      href !== "/" &&
      document.location.pathname.match(new RegExp(regexpStr))
    ) {
      this.classList.remove("active")
      this.classList.add("active-within")
    } else {
      this.classList.remove("active")
      this.classList.remove("active-within")
    }
  }
}
