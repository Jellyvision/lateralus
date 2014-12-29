define([

  'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.model'
  ,'./lateralus.component'

], function (

  _
  ,Backbone
  ,mixins
  ,LateralusModel
  ,Component

) {
  'use strict';

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
   * @protected
   * @param {Element} el The DOM element that contains the entire Lateralus
   * app.
   * @class Lateralus
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
  }

  _.extend(Lateralus.prototype, Backbone.Events);

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

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/addComponent"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method addComponent
   */
  Lateralus.prototype.addComponent = mixins.addComponent;

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/listenFor"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method listenFor
   */
  Lateralus.prototype.listenFor = mixins.listenFor;

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
    Lateralus.prototype[consoleMethodName] = function () {
      if (typeof console !== 'undefined' && console[consoleMethodName]) {
        console[consoleMethodName].apply(console, arguments);
      }
    };
  });

  /**
   * Do not override this method, it is used internally.
   * @method toString
   * @return {string} This is `"lateralus"`.
   * @final
   */
  Lateralus.prototype.toString = function () {
    return 'lateralus';
  };

  Lateralus.Component = Component;

  return Lateralus;
});
