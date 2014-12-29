define([

  'underscore'
  ,'backbone'

  ,'./lateralus.mixins'

], function (

  _
  ,Backbone

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
   * @param {Lateralus.Component} component
   * @param {Object} [attributes] Gets passed to
   * [`Backbone.Model#initialize'](http://backbonejs.org/#Model-constructor).
   * @param {Object} [options] Gets passed to
   * [`Backbone.Model#initialize'](http://backbonejs.org/#Model-constructor).
   * @uses Lateralus.mixins
   * @constructor
   */
  fn.constructor = function (lateralus, component, attributes, options) {
    this.lateralus = lateralus;

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

  _.extend(fn, mixins);

  /**
   * This class builds on the ideas and APIs of
   * [`Backbone.Model`](http://backbonejs.org/#Model).
   * @class Lateralus.Component.Model
   * @extends {Backbone.Model}
   */
  var ComponentModel = Backbone.Model.extend(fn);

  return ComponentModel;
});
