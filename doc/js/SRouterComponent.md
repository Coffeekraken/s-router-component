# Attributes

Here's the list of available attribute(s).

## handler

Specify the router handler used for this link

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) , [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **default**


## before

Specify a function tu run before the change
This function has to return a promise that has to be resolved
to execute the route change
This function will these properties as parameters:
- `params`: The route params taken from the url

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**




# Methods


## after

Specify a function to run after the change
This function will these properties as parameters:
- `params`: The route params taken from the url

Default : **null**


## leave

Specify a function to run when leaving the route
This function will these properties as parameters:
- `params`: The route params taken from the url

Default : **null**


## on

Register a route


### Parameters
Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
route  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The route to handle. Can have some params like /my/route/:id  |  required  |
handler  |  **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**  |  The handler function. Need to return a promise that need to be resolved when the change has been made  |  required  |
hooks  |  **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**  |  An object with some functions hooks. Available hooks: `before`, `after` and `leave`  |  optional  |  {}

**Static**


## listen

Start the router to listen for route changes

**Static**