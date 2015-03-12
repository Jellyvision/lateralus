define([

  'jquery'
  ,'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.model'
  ,'./lateralus.router'
  ,'./lateralus.component'

], function (

  $
  ,_
  ,Backbone
  ,mixins
  ,LateralusModel
  ,LateralusRouter
  ,Component

) {
  'use strict';

  // UNDERSCORE MIXINS
  _.mixin({

    /**
     * Remove all properties from an Object.
     * @param {Object} obj
     */
    lateralusEmptyObject: function (obj) {
      var propName;
      for (propName in obj) {
        if (obj.hasOwnProperty(propName)) {
          delete obj[propName];
        }
      }
    }
  });

  /**
   * You should not need to call the Lateralus constructor directly, use
   * `{{#crossLink "Lateralus/beget"}}{{/crossLink}}` instead.  To create a new
   * Lateralus app:
   *
   *     var App = Lateralus.beget(function () {
   *       // Don't forget to call the Lateralus constructor!
   *       Lateralus.apply(this, arguments);
   *     });
   *
   *     var app = new App(document.getElementById('app'));
   * @param {Element} el The DOM element that contains the entire Lateralus
   * app.
   * @class Lateralus
   * @uses Lateralus.mixins
   * @constructor
   */
  function Lateralus (el) {
    /**
     * The DOM node that contains this `{{#crossLink
     * "Lateralus"}}{{/crossLink}}` instance.
     * @property el
     * @type {HTMLElement}
     */
    this.el = el;

    /**
     * The jQuery Object that contains `{{#crossLink
     * "Lateralus/el:property"}}{{/crossLink}}`.
     * @property $el
     * @type {jQuery}
     */
    this.$el = $(el);

    /**
     * Maintains the state of the central `{{#crossLink
     * "Lateralus"}}{{/crossLink}}` instance.
     * @property model
     * @type {Lateralus.Model}
     */
    this.model = new LateralusModel(this);

    /**
     * An optional map of template render data to be passed to the
     * `Mustache.render` call for all Views belonging to this Lateralus app.
     * @property globalRenderData
     * @type {Object(String)}
     */
    this.globalRenderData = {};

    /**
     * An optional map of template partials to be passed to the
     * `Mustache.render` call for all Views belonging to this Lateralus app.
     * @property globalPartials
     * @type {Object(String)}
     */
    this.globalPartials = {};

    this.delegateLateralusEvents();
  }

  var fn = Lateralus.prototype;

  _.extend(fn, Backbone.Events);

  /**
   * Set up the prototype chain between two objects.
   * @static
   * @method inherit
   * @param {Function} child
   * @param {Function} parent
   * @return {Function} A reference to the passed-in `child` parameter.
   */
  Lateralus.inherit = function inherit (child, parent) {
    function Proxy () {}
    Proxy.prototype = parent.prototype;
    child.prototype = new Proxy();
    return child;
  };

  /**
   * Create a `{{#crossLink "Lateralus"}}{{/crossLink}}` application instance.
   *
   *     var App = Lateralus.beget(function () {
   *       Lateralus.apply(this, arguments);
   *     });
   * @static
   * @method beget
   * @param {Function} child
   * @return {Function} The created `{{#crossLink "Lateralus"}}{{/crossLink}}`
   * subclass.
   */
  Lateralus.beget = function (child) {
    child.displayName = child.name || 'begetConstructor';
    return Lateralus.inherit(child, Lateralus);
  };

  _.extend(fn, mixins);

  _.each([

    /**
     * Cross-browser friendly wrapper for `console.log`.
     * @method log
     * @param {...any} Any parameters to pass along to `console.log`.
     */
    'log'

    /**
     * Cross-browser friendly wrapper for `console.warn`.
     * @method warn
     * @param {...any} Any parameters to pass along to `console.warn`.
     */
    ,'warn'

    /**
     * Cross-browser friendly wrapper for `console.error`.
     * @method error
     * @param {...any} Any parameters to pass along to `console.error`.
     */
    ,'error'

  ], function (consoleMethodName) {
    fn[consoleMethodName] = function () {
      if (typeof console !== 'undefined' && console[consoleMethodName]) {
        console[consoleMethodName].apply(console, arguments);
      }
    };
  });

  /**
   * @param {Lateralus.Router} Router A constructor, not an instance.
   * @param {Object} [options] To be passed to the [Router
   * `initialize`](http://backbonejs.org/#Router-constructor) method.
   * @return {Lateralus.Router} An instance of the provided Router
   * constructor.
   * @method initRouter
   */
  fn.initRouter = function (Router, options) {
    return new Router(this, options);
  };

  /**
   * Remove this `{{#crossLink "Lateralus"}}{{/crossLink}}` app from memory.
   * @method dispose
   */
  fn.dispose = function () {
    if (this.components) {
      _.invoke(this.components, 'dispose');
    }

    this.stopListening();
    _(this).lateralusEmptyObject();
  };
  fn.spiralOut = fn.dispose;

  /**
   * Do not override this method, it is used internally.
   * @method toString
   * @return {string} This is `"lateralus"`.
   * @final
   */
  fn.toString = function () {
    return 'lateralus';
  };

  Lateralus.Component = Component;
  Lateralus.Model = LateralusModel;
  Lateralus.Router = LateralusRouter;

  return Lateralus;
});
