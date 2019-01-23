# SRouterComponent

A simple but powerful router webcomponent with full route lifecycle (before, handler, after, leave)

### Example

```js
SRouterComponent.on("/", async (params, source) => {
  // do something here...
})
  .on("/user/:id", async (params, source) => {
    // do something here...
  })
  .listen() // start listening for routes changes
```

Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

Extends **native**

## Methods

### on

Register a route

#### Parameters

| Name    | Type                                                                                                       | Description                                                                                           | Status   | Default |
| ------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| route   | **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**     | The route to handle. Can have some params like /my/route/:id                                          | required |
| handler | **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }** | The handler function. Need to return a promise that need to be resolved when the change has been made | required |
| hooks   | **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**     | An object with some functions hooks. Available hooks: `before`, `after` and `leave`                   | optional | {}      |

Return **{ SRouterComponent }** The SRouterComponent class to maintain chainability

**Static**

### goTo

Go to a specific url

#### Parameters

| Name | Type                                                                                                   | Description       | Status   | Default |
| ---- | ------------------------------------------------------------------------------------------------------ | ----------------- | -------- | ------- |
| path | **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }** | THe path to go to | required |

Return **{ SRouterComponent }** The SRouterComponent class to maintain chainability

**Static**

### goForward

Go forward

#### Parameters

| Name | Type            | Description                              | Status   | Default |
| ---- | --------------- | ---------------------------------------- | -------- | ------- |
| by   | **{ Integer }** | How many steprs to go forward in history | optional | 1       |

Return **{ SRouterComponent }** The SRouterComponent class to maintain chainability

**Static**

### goBackward

Go backward

#### Parameters

| Name | Type            | Description                           | Status   | Default |
| ---- | --------------- | ------------------------------------- | -------- | ------- |
| by   | **{ Integer }** | How many steprs to go back in history | optional | 1       |

Return **{ SRouterComponent }** The SRouterComponent class to maintain chainability

**Static**

### notFound

Register the not found (404) route

#### Parameters

| Name    | Type                                                                                                       | Description                                                                                           | Status   | Default |
| ------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| handler | **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }** | The handler function. Need to return a promise that need to be resolved when the change has been made | required |
| hooks   | **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**     | An object with some functions hooks. Available hooks: `before`, `after` and `leave`                   | optional | {}      |

Return **{ SRouterComponent }** The SRouterComponent class to maintain chainability

**Static**

### listen

Start the router to listen for route changes

Return **{ SRouterComponent }** The SRouterComponent class to maintain chainability

**Static**

### stop

Stop listen for changes

**Static**

## Events

### s-router:change

Event dispatched on the body to notify the app of a route change
