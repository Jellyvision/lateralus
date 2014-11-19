define([

  'underscore'
  ,'backbone'
  ,'./lateralus.mixins'
  ,'./lateralus.component'

], function (

  _
  ,Backbone
  ,mixins
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
    this.el = el;
    this.$el = $(el);
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
    return Lateralus.inherit(child, Lateralus);
  };

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/addComponent"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method addComponent
   */
  Lateralus.prototype.addComponent = mixins.addComponent;

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
   * @method toString
   * @return {string} This is `"lateralus"`.
   */
  Lateralus.prototype.toString = function () {
    return 'lateralus';
  };

  Lateralus.Component = Component;

  return Lateralus;
});
