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
    return this.lateralus.toString() + '-model';
  };

  // jshint maxlen:100
  /**
   * The constructor for this class should not be called by application code,
   * it is used by the `{{#crossLink "Lateralus"}}{{/crossLink}}` constructor.
   * @private
   * @param {Lateralus} lateralus
   * @constructor
   */
  fn.constructor = function ( lateralus) {
    this.lateralus = lateralus;
    Backbone.Model.call(this);
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
   * This class builds on the ideas and APIs of
   * [`Backbone.Model`](http://backbonejs.org/#Model).
   * @class Lateralus.Model
   * @extends {Backbone.Model}
   */
  var LateralusModel = Backbone.Model.extend(fn);

  return LateralusModel;
});