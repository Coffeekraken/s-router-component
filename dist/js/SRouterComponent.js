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
}(); // some internal variables


var _routes = {};

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


      this._removeClickHandler = (0, _addEventListener.default)(this, 'click', this._clickHandler);
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
                e.preventDefault(); // push a new state

                window.history.pushState({}, document.title, this.getAttribute('href')); // dispatch a popstate event

                (0, _dispatchEvent.default)(window, 'popstate');

              case 3:
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
     */
    value: function on(route, handler) {
      var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // register new route
      _routes[route] = new SRoute(route, handler, hooks); // maintain chainability

      return this;
    }
    /**
     * Start the router to listen for route changes
     */

  }, {
    key: "listen",
    value: function listen() {
      // add popstate event
      (0, _addEventListener.default)(window, 'popstate', this._popStateHandler.bind(this)); // maintain chainability

      return this;
    }
  }, {
    key: "_popStateHandler",
    value: function () {
      var _popStateHandler2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(e) {
        var href, foundRoute, sroute, params, beforeResult;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('popstate', e); // get the pathname from the url

                href = document.location.pathname; // find the first route that match the requested one

                foundRoute = this._findRoute(href); // if no route match, stop here

                if (foundRoute) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return");

              case 5:
                // destructur the foundRoute
                sroute = foundRoute.sroute, params = foundRoute.params; // check if this route has a before hook

                if (!sroute.hooks.before) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 9;
                return sroute.hooks.before(params);

              case 9:
                beforeResult = _context2.sent;

                if (beforeResult) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt("return");

              case 12:
                // call the handler function for the route
                sroute.handler(params).then(function () {
                  console.log('changed!');
                });
                console.log('click', sroute, params);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _popStateHandler(_x2) {
        return _popStateHandler2.apply(this, arguments);
      }

      return _popStateHandler;
    }()
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

        var routeRegexpStringAr = route.split('/'); // replace every tokens by a regexp part

        routeRegexpStringAr = routeRegexpStringAr.map(function (token) {
          if (token === '*') {
            // wildcard
            return '([^\/]+)';
          } else if (token.substr(0, 1) === ':') {
            return '([^\/]+)';
          } // otherwise, return the token itself cause it's a simple value


          return token;
        }); // reform the routeRegexpStringAr into a simple string

        var routeRegexpString = routeRegexpStringAr.join('\\/'); // try to match the route with the built regexp

        var match = href.toString().match(new RegExp(routeRegexpString)); // check if the route match, otherwise we pass the the next one

        if (!match) continue;
        match.splice(0, 1); // get the params tokens

        var paramTokensAr = (route.match(/([:*])(\w+)/g) || []).map(function (item) {
          return item.substr(1);
        }); // build the params object

        var params = (0, _fromPairs.default)((0, _zip.default)(paramTokensAr, match)); // return the sroute and the params

        return {
          sroute: sroute,
          params: params
        };
      }
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
      };
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