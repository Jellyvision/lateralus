# Lateralus

[![Code Climate](https://codeclimate.com/github/Jellyvision/lateralus/badges/gpa.svg)](https://codeclimate.com/github/Jellyvision/lateralus)

Lateralus is a single page web application framework.  It is designed around the idea that UIs should be divided into discreet, reusable, loosely-coupled components.  These components should communicate only indirectly and be easily swappable or removable.  Lateralus provides patterns and utilities to cleanly isolate individual components of your app.

Lateralus is built upon Backbone, Lodash, jQuery, and Mustache.

**[Link: A simple demo app built with Lateralus](https://github.com/Jellyvision/marker)**

### Dependencies

The standard build of Lateralus does not have its dependencies baked, so you must provide them at runtime.  Lateralus expects and is tested with:

  * [Backbone](http://backbonejs.org/) 1.3.3
  * [lodash-compat](https://www.npmjs.com/package/lodash-compat) 3.10.2
  * [jQuery](http://jquery.com/) 1.12.4
  * [Mustache](https://github.com/janl/mustache.js/) 0.8.2

## Getting started

### Installation

To install Lateralus into an existing app:

````
npm install --save lateralus
````

### Loading Lateralus

Lateralus is a [UMD module](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/), so load it however you like.  This README's examples use the AMD format.

Once loaded, you can instantiate a Lateralus app:

```javascript
require(['lateralus'], function (Lateralus) {
  var App = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);
  });

  var app = new App(document.getElementById('app'));
});
```

`app` is a reference to a running Lateralus application.

### Working with components

Building upon the previous example:

```javascript
require(['lateralus', 'app.component.my-component'],
    function (Lateralus, MyComponent) {

  var App = Lateralus.beget(function () {
    Lateralus.apply(this, arguments);
  });

  var app = new App(document.getElementById('app'));
  app.addComponent(MyComponent);
});
```

Much of the Lateralus workflow involves creating and wiring up components.  The majority of code in a Lateralus app should be handled by components, everything outside of component code should focus on glueing them together and providing utilities.

## Using Lateralus

Lateralus's functionality is divided up into several primary Objects under the `Lateralus` namespace:

  * `Lateralus`
  * `Lateralus.Component`
  * `Lateralus.Component.View`
  * `Lateralus.Component.Model`
  * `Lateralus.Component.Collection`
  * A stylesheet

### [Lateralus](http://jellyvision.github.io/lateralus/docs/Lateralus.html)

Contains static utility methods, such as `Lateralus.inherit`.

### [Lateralus.Component](http://jellyvision.github.io/lateralus/docs/Lateralus.Component.html)

The primary class used within the framework to define UI components.  Typically, a component encompasses a `Lateralus.Component.View` and a template (though these are not required).

A component is distinct from a view.  A view is a graphical, interactive representation of a model.  A component represents all of the interrelated parts of significant, individual part of the UI.  This usually includes one or more Views, a template, a Model, and anything else a UI component needs to function.  A component is a higher-level abstraction than a View.

This is the standard directory structure for a typical component:

```
my-component/
  styles/
    main.sass
  main.js
  view.js
  model.js
  template.mustache
```

`main.js` is the main entry point for the component and defines the `Lateralus.Component` instance.  `view.js` defines the primary `Lateralus.Component.View` instance, and `template.mustache` is the primary DOM template.  All components should adhere to this directory structure, but you are also free change the directory structure to suit your needs.  If you do this, you will need to update the dependency paths in your component's AMD modules.

Boilerplate for a standard `Lateralus.Component` module:

```javascript
define(['lateralus', './view', 'text!./template.mustache'],
    function (Lateralus, View, template) {

  var ExtendedComponent = Lateralus.Component.extend({
    name: 'extended-component', // Should be unique to each component

    // A reference to the View constructor, not the instance.
    View: View,

    // This is a string of Mustache-templated HTML
    template: template
  });

  return ExtendedComponent;
});
```

`Lateralus.Component` instances have a reference to the central `Lateralus` instance as `this.lateralus`.

**Note:** The `styles/main.sass` file is not `@import`ed for you automatically in your main Sass file, you will need to do that manually when you set up a new component.

### Templates

Lateralus uses [Mustache.js](https://github.com/janl/mustache.js/) for its templating engine.  Components that render something have at least one template associated with them as `this.template`.

### [Lateralus.Component.View](http://jellyvision.github.io/lateralus/docs/Lateralus.Component.View.html)

This Object extends [`Backbone.View`](http://backbonejs.org/#View) with Lateralus-specific functionality.  Here's a basic `Lateralus.Component.View` subclass module:

```javascript
define(['lateralus'], function (Lateralus) {
  'use strict';

  var Base = Lateralus.Component.View;
  var baseProto = Base.prototype;

  var ExtendedComponentView = Base.extend({
    initialize: function () {
      // An initialize method definition isn't strictly required for a simple
      // example like this, but it's a good habit to get into. With the Base/baseProto
      // pattern above, you can easily achieve "super"-like functionality (like
      // Java has).  If you want to add additional initialization code for this
      // View, you should insert it after the baseProto.initialize call.
      baseProto.initialize.apply(this, arguments);
    }
  });

  return ExtendedComponentView;
});
```

A `Lateralus.Component.View` has a reference to the central `Lateralus` instance as `this.lateralus`, and a reference to the `Lateralus.Component` it belongs to with `this.component`.  This is necessary for using the `emit` and `listenFor` mixin methods to communicate with the rest of the app.  Generally, you can use `Lateralus.Component.View` exactly as you would `Backbone.View`, but it gives you a few additional APIs.

As a convenience, `Lateralus.Component.View` implicitly binds DOM nodes in the template as jQuery objects.  If the component's template looks like this:

```html
<div class="$container">
  <h2 class="$header">Hello!</h2>
</div>
```

The view will automatically have properties `this.$container` and `this.$header` that are jQuery objects referencing the `div` and the `h2`, respecively.

`Lateralus.Component.View` transparently renders its template for you.  `this.renderTemplate` is called by `Lateralus.Component.View.prototype.initialize` (which is why you should generally call `baseProto.initialize` as demonstrated above), but you are free to do further rendering with `this.render`.  `this.render` should be used for partial updates, whereas `this.renderTemplate` should be used to completely replace the contents of the View's `$el` with whatever is in `this.template`.

### [Lateralus.Component.Model](http://jellyvision.github.io/lateralus/docs/Lateralus.Model.html)

Similarly to `Lateralus.Component.View`, this object extends its Backbone counterpart &mdash; `Backbone.Model`.  This doesn't add much in the way of new functionality, but it does have a reference to the central `Lateralus` instance and can therefore `emit` and `listenFor` messages.


### [Lateralus.Component.Collection](http://jellyvision.github.io/lateralus/docs/Lateralus.Collection.html)

Just like `Lateralus.Component.Model`, this works consistently with `Backbone.Collection`, but in a way that is compatible with Lateralus.

### Component styles

Each component can (and should) have its own `.sass` file.  It is recommended that all rules be nested under the `[component-name]-view` CSS class, as that class is dynamically added to all `Lateralus.Component.View` instances.  This provides clean and easy component-based style isolation.

## Running tests

You can run the Lateralus unit tests both in your browser as well as in a command line environment.  To run the tests in your browser:

```
npm run start
```

And then navigate to http://127.0.0.1:8080/test/.

To run them at the command line:

```
npm test
```

## Publishing new versions

Once things are ready, you should use `npm version`.
This will:
 - change the version in the `package.json` file.
 - build the documentation (with the new version).
 - commit the new documentation
 - tag the new version
 - push to the repo.

Once this is done, Travis will publish the change to NPM.
