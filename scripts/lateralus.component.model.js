define([

  'backbone'

  ,'./lateralus.mixins'

], function (

  Backbone

  ,mixins

) {
  'use strict';

  var fn = {};

  /**
   * @method toString
   * @protected
   * @return {string} The name of this Model.  This is used internally by
   * Lateralus.
   */
  fn.toString = function () {
    return this.component.toString() + '-model';
  };

  // jshint maxlen:100
  /**
   * The constructor for this class should not be called by application code,
   * it is used by the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
   * constructor.
   * @private
   * @param {Lateralus} lateralus
   * @param {Backbone.Model} __super__ The constructor that this subclass is
   * extending.
   * @param {Backbone.Model} __proto The prototype that this subclass is
   * extending.
   * @param {Lateralus.Component} component
   * @param {Object} [attributes] Gets passed to
   * [`Backbone.Model#initialize'](http://backbonejs.org/#Model-constructor).
   * @param {Object} [options] Gets passed to
   * [`Backbone.Model#initialize'](http://backbonejs.org/#Model-constructor).
   * @constructor
   */
  fn.constructor = function (
      lateralus, __super__, __proto, component, attributes, options) {
    this.lateralus = lateralus;

    // Build an explicit prototype chain reference for _super method
    /**
     * A reference to the class which this `{{#crossLink
     * "Lateralus.Component.Model"}}{{/crossLink}}` extends.
     * @property __super__
     * @private
     * @type {Lateralus.Component.Model}
     * @final
     */
    this.__super__ = __super__;

    /**
     * A reference to the object that proceeds this one on the prototype chain.
     * @property __proto
     * @private
     * @type {Object}
     * @final
     */
    this.__proto = __proto;

    /**
     * A reference to the `{{#crossLink "Lateralus.Component"}}{{/crossLink}}`
     * to which this `{{#crossLink "Lateralus.Component.Model"}}{{/crossLink}}`
     * belongs.
     * @property component
     * @type {Lateralus.Component}
     * @final
     */
    this.component = component;
    Backbone.Model.call(this, attributes, options);
  };

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/emit"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method emit
   */
  fn.emit = mixins.emit;

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/listenFor"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method listenFor
   */
  fn.listenFor = mixins.listenFor;

  /**
   * This is the same as the `{{#crossLink
   * "Lateralus.mixins/_super"}}{{/crossLink}}` mixin method.  See the
   * documentation for that.
   * @method _super
   */
  fn._super = mixins._super;

  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Model`](http://backbonejs.org/#Model).
   * @class Lateralus.Component.Model
   * @extends {Backbone.Model}
   */
  var ComponentModel = Backbone.Model.extend(fn);

  /**
   * Overrides [`Backbone.Model#extend`](http://backbonejs.org/#Model-extend) to
   * set up explicit prototype chain references for `{{#crossLink
   * "Lateralus.mixins/_super"}}{{/crossLink}}` calls.
   * @return {Object}
   */
  ComponentModel.extend = function () {
    var extendedObject = Backbone.Model.extend.apply(this, arguments);
    extendedObject.prototype.__proto = this.prototype;
    return extendedObject;
  };

  return ComponentModel;
});
