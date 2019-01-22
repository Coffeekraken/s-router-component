"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sNativeWebComponent = _interopRequireDefault(require("coffeekraken-sugar/js/core/sNativeWebComponent"));

var _addEventListener = _interopRequireDefault(require("coffeekraken-sugar/js/dom/addEventListener"));

var _zip = _interopRequireDefault(require("lodash/zip"));

var _fromPairs = _interopRequireDefault(require("lodash/fromPairs"));

var _dispatchEvent = _interopRequireDefault(require("coffeekraken-sugar/js/dom/dispatchEvent"));

var _queryStringToObject = _interopRequireDefault(require("coffeekraken-sugar/js/utils/strings/queryStringToObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SRoute =
/*#__PURE__*/
function () {
  function SRoute(route, handler) {
    var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, SRoute);

    this._route = route;
    this._handler = handler;
    this._hooks = hooks;
  }

  _createClass(SRoute, [{
    key: "route",
    get: function get() {
      return this._route;
    }
  }, {
    key: "handler",
    get: function get() {
      return this._handler;
    }
  }, {
    key: "hooks",
    get: function get() {
      return this._hooks;
    }
  }]);

  return SRoute;
}();

function timeout(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
} // some internal variables


var _routes = {};
var _clickedItem = null; // the last s-router link clicked

var _previousRouteParamsSource = null; // save the previous route

var SRouterComponent =
/*#__PURE__*/
function (_native) {
  _inherits(SRouterComponent, _native);

  function SRouterComponent() {
    _classCallCheck(this, SRouterComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(SRouterComponent).apply(this, arguments));
  }

  _createClass(SRouterComponent, [{
    key: "componentWillMount",

    /**
     * Component will mount
     * @definition    SWebComponent.componentWillMount
     * @protected
     */
    value: function componentWillMount() {
      _get(_getPrototypeOf(SRouterComponent.prototype), "componentWillMount", this).call(this);
    }
    /**
     * Mount component
     * @definition    SWebComponent.componentMount
     * @protected
     */

  }, {
    key: "componentMount",
    value: function componentMount() {
      _get(_getPrototypeOf(SRouterComponent.prototype), "componentMount", this).call(this); // listen for click on himself


      this._removeClickHandler = (0, _addEventListener.default)(this, "click", this._clickHandler);
    }
    /**
     * Component unmount
     * @definition    SWebComponent.componentUnmount
     * @protected
     */

  }, {
    key: "componentUnmount",
    value: function componentUnmount() {
      _get(_getPrototypeOf(SRouterComponent.prototype), "componentUnmount", this).call(this);

      if (this._removeClickHandler) this._removeClickHandler();
    }
    /**
     * Component will receive prop
     * @definition    SWebComponent.componentWillReceiveProp
     * @protected
     */

  }, {
    key: "componentWillReceiveProp",
    value: function componentWillReceiveProp(name, newVal, oldVal) {
      _get(_getPrototypeOf(SRouterComponent.prototype), "componentWillReceiveProp", this).call(this, name, newVal, oldVal);
    }
    /**
     * Click handler
     * @param    {MouseEvent}    e    The mouse event
     */

  }, {
    key: "_clickHandler",
    value: function () {
      var _clickHandler2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(e) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // prevent default behavior
                e.preventDefault(); // stop here if the href is already the setted route

                if (!(this.getAttribute("href") === document.location.pathname)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                // save the clicked item in the external variable
                // to pass it then in the handler function
                _clickedItem = this;
                setTimeout(function () {
                  _clickedItem = null;
                }); // push a new state

                window.history.pushState({}, document.title, this.getAttribute("href")); // dispatch a popstate event

                (0, _dispatchEvent.default)(window, "popstate");

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _clickHandler(_x) {
        return _clickHandler2.apply(this, arguments);
      }

      return _clickHandler;
    }()
  }], [{
    key: "on",

    /**
     * Register a route
     * @param    {String}    route    The route to handle. Can have some params like /my/route/:id
     * @param    {Function}    handler    The handler function. Need to return a promise that need to be resolved when the change has been made
     * @param    {Object}    [hooks={}]    An object with some functions hooks. Available hooks: `before`, `after` and `leave`
     * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
     */
    value: function on(route, handler) {
      var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // make an array with the route parameter to allow
      // register multiple routes at once
      var routes = [].concat(route); // loop on each routes to register

      routes.forEach(function (route) {
        // register new route
        _routes[route] = new SRoute(route, handler, hooks);
      }); // maintain chainability

      return this;
    }
    /**
     * Go to a specific url
     * @param    {String}    path    THe path to go to
     * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
     */

  }, {
    key: "goTo",
    value: function goTo(path) {
      // stop here if the href is already the setted route
      if (path === document.location.pathname) return; // push a new state

      window.history.pushState({}, document.title, path); // dispatch a popstate event

      (0, _dispatchEvent.default)(window, "popstate");
    }
    /**
     * Register the not found (404) route
     * @param    {Function}     handler    The handler function. Need to return a promise that need to be resolved when the change has been made
     * @param    {Object}    [hooks={}]    An object with some functions hooks. Available hooks: `before`, `after` and `leave`
     * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
     */

  }, {
    key: "notFound",
    value: function notFound(handler) {
      var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // register 404 route
      return this.on("/404", handler, hooks);
    }
    /**
     * Start the router to listen for route changes
     * @return    {SRouterComponent}    The SRouterComponent class to maintain chainability
     */

  }, {
    key: "listen",
    value: function listen() {
      // add popstate event
      (0, _addEventListener.default)(window, "popstate", this._popStateHandler.bind(this)); // first check

      this._popStateHandler(); // maintain chainability


      return this;
    }
    /**
     * When the url has been updated either by a click on back button, or by a click on
     * an `s-router` link
     */

  }, {
    key: "_popStateHandler",
    value: function () {
      var _popStateHandler2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var href, foundRoute, sroute, params, queryString, $source, previousRouteLeaveResult, beforeResult;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // get the pathname from the url
                href = document.location.pathname; // find the first route that match the requested one

                foundRoute = this._findRoute(href); // if no route match, stop here

                if (foundRoute) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                // destructur the foundRoute
                sroute = foundRoute.sroute, params = foundRoute.params; // process query string

                queryString = (0, _queryStringToObject.default)(document.location.search);

                if (Object.keys(queryString).length) {
                  params.$qs = queryString;
                } // save the $source of the change


                $source = _clickedItem; // check if has a previous route

                if (!(_previousRouteParamsSource && _previousRouteParamsSource.sroute.hooks.leave)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 11;
                return _previousRouteParamsSource.sroute.hooks.leave(_previousRouteParamsSource.params, _previousRouteParamsSource.source || window.history);

              case 11:
                previousRouteLeaveResult = _context2.sent;

                if (!(previousRouteLeaveResult === false)) {
                  _context2.next = 15;
                  break;
                }

                // go back in history
                window.history.go(-1);
                return _context2.abrupt("return");

              case 15:
                // save the previous route
                _previousRouteParamsSource = {
                  source: $source,
                  sroute: foundRoute.sroute,
                  params: foundRoute.params // add class to the source element if exist

                };
                if ($source) $source.classList.add("loading"); // check if this route has a before hook

                if (!sroute.hooks.before) {
                  _context2.next = 24;
                  break;
                }

                _context2.next = 20;
                return sroute.hooks.before(params, $source || window.history);

              case 20:
                beforeResult = _context2.sent;

                if (!(beforeResult === false)) {
                  _context2.next = 24;
                  break;
                }

                // go back in history
                window.history.go(-1);
                return _context2.abrupt("return");

              case 24:
                // set the active state class
                this._setActiveState(); // call the handler function for the route


                _context2.next = 27;
                return sroute.handler(params, _clickedItem || window.history);

              case 27:
                // remove the class on the clicked item if exist
                if ($source) $source.classList.remove("loading"); // call the after hook if exist

                if (sroute.hooks.after) sroute.hooks.after(params, $source || window.history);

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _popStateHandler() {
        return _popStateHandler2.apply(this, arguments);
      }

      return _popStateHandler;
    }()
    /**
     * Set the components active status
     */

  }, {
    key: "_setActiveState",
    value: function _setActiveState() {
      // query all the s-router elements
      var $links = document.querySelectorAll('a[is="s-router"]'); // loop on each links

      Array.from($links).forEach(function ($link) {
        // check if the link match the location
        var href = $link.getAttribute("href");
        var regexpStr = href.replace(/\//g, "\\/");

        if (document.location.pathname === href) {
          $link.classList.remove("active-within");
          $link.classList.add("active");
        } else if (document.location.pathname.match(new RegExp(regexpStr))) {
          $link.classList.remove("active");
          $link.classList.add("active-within");
        } else {
          $link.classList.remove("active");
          $link.classList.remove("active-within");
        }
      });
    }
    /**
     * Find the route that match the href of this component instance
     * @param    {String}    href    The href value of this link
     * @return    {SRoute}    The SRoute instance of the first route that match the href
     */

  }, {
    key: "_findRoute",
    value: function _findRoute(href) {
      // loop on each routes
      for (var route in _routes) {
        // get the SRoute object
        var sroute = _routes[route]; // build a route regexp string

        var routeRegexpStringAr = route.split("/"); // replace every tokens by a regexp part

        routeRegexpStringAr = routeRegexpStringAr.map(function (token) {
          if (token === "*" || token.substr(0, 1) === ":") {
            // wildcard
            return "([^/]+)"; // eslint-disable-line
          } // otherwise, return the token itself cause it's a simple value


          return token;
        }); // reform the routeRegexpStringAr into a simple string

        var routeRegexpString = routeRegexpStringAr.join("\\/"); // try to match the route with the built regexp

        var match = href.toString().match(new RegExp("^".concat(routeRegexpString, "\\/?$"))); // check if the route match, otherwise we pass the the next one

        if (!match) continue; // eslint-disable-line
        // remove the first item of the matches which is the whole matched string

        match.splice(0, 1); // get the params tokens

        var paramTokensAr = (route.match(/([:*])(\w+)/g) || []).map(function (item) {
          return item.substr(1);
        }); // build the params object

        var params = (0, _fromPairs.default)((0, _zip.default)(paramTokensAr, match)); // return the sroute and the params

        return {
          sroute: sroute,
          params: params
        };
      } // return 404 route if exist, otherwise, false


      if (_routes["/404"]) {
        return {
          sroute: _routes["/404"],
          params: {}
        };
      } // no route found and no 404


      return false;
    }
    /**
     * Physical props
     * @definition    SWebComponent.physicalProps
     * @protected
     */

  }, {
    key: "defaultCss",

    /**
     * Css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return "\n      ".concat(componentNameDash, " {\n        display : block;\n      }\n    ");
    }
  }, {
    key: "defaultProps",

    /**
     * Default props
     * @definition    SWebComponent.defaultProps
     * @protected
     */
    get: function get() {
      return {};
    }
  }, {
    key: "physicalProps",
    get: function get() {
      return [];
    }
  }]);

  return SRouterComponent;
}((0, _sNativeWebComponent.default)(window.HTMLAnchorElement));

exports.default = SRouterComponent;